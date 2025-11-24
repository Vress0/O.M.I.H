"""
RAG (Retrieval-Augmented Generation) 知識庫查詢
"""

import json
import numpy as np
from typing import List, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class RAGSystem:
    def __init__(self, knowledge_base_path: str = "db/tcm_knowledge.json"):
        """初始化 RAG 系統"""
        self.knowledge_base_path = knowledge_base_path
        self.knowledge_base = []
        self.vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
        self.vectors = None
        self.load_knowledge_base()
        
    def load_knowledge_base(self):
        """載入知識庫"""
        try:
            with open(self.knowledge_base_path, 'r', encoding='utf-8') as f:
                self.knowledge_base = json.load(f)
            
            # 建立文本向量
            texts = [item.get('content', '') for item in self.knowledge_base]
            self.vectors = self.vectorizer.fit_transform(texts)
            print(f"成功載入 {len(self.knowledge_base)} 條知識庫條目")
            
        except FileNotFoundError:
            print(f"知識庫檔案不存在: {self.knowledge_base_path}")
            self.knowledge_base = []
        except Exception as e:
            print(f"載入知識庫錯誤: {str(e)}")
            self.knowledge_base = []
    
    def search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        搜尋相關知識
        
        Args:
            query: 查詢字串
            top_k: 返回前 k 個最相關結果
            
        Returns:
            相關知識列表
        """
        if not self.knowledge_base or self.vectors is None:
            return []
        
        try:
            # 查詢向量化
            query_vector = self.vectorizer.transform([query])
            
            # 計算相似度
            similarities = cosine_similarity(query_vector, self.vectors).flatten()
            
            # 獲取最相關的結果
            top_indices = np.argsort(similarities)[::-1][:top_k]
            
            results = []
            for idx in top_indices:
                if similarities[idx] > 0.1:  # 設置最低相似度閾值
                    result = self.knowledge_base[idx].copy()
                    result['similarity_score'] = float(similarities[idx])
                    results.append(result)
            
            return results
            
        except Exception as e:
            print(f"搜尋錯誤: {str(e)}")
            return []
    
    def get_context_for_query(self, query: str, max_tokens: int = 2000) -> str:
        """
        獲取查詢的上下文資訊
        
        Args:
            query: 查詢字串
            max_tokens: 最大 token 數
            
        Returns:
            格式化的上下文字串
        """
        results = self.search(query, top_k=10)
        
        context_parts = []
        current_length = 0
        
        for result in results:
            content = result.get('content', '')
            title = result.get('title', '未命名')
            
            # 估算 token 數量 (粗略估計：中文約 1 字 = 1.5 tokens)
            estimated_tokens = len(content) * 1.5
            
            if current_length + estimated_tokens > max_tokens:
                break
            
            context_parts.append(f"標題: {title}\n內容: {content}\n")
            current_length += estimated_tokens
        
        return "\n---\n".join(context_parts)
    
    def add_knowledge(self, title: str, content: str, category: str = "general") -> bool:
        """
        新增知識條目
        
        Args:
            title: 標題
            content: 內容
            category: 分類
            
        Returns:
            是否成功新增
        """
        try:
            new_entry = {
                "title": title,
                "content": content,
                "category": category,
                "id": len(self.knowledge_base) + 1
            }
            
            self.knowledge_base.append(new_entry)
            
            # 重新建立向量
            texts = [item.get('content', '') for item in self.knowledge_base]
            self.vectors = self.vectorizer.fit_transform(texts)
            
            return True
            
        except Exception as e:
            print(f"新增知識錯誤: {str(e)}")
            return False