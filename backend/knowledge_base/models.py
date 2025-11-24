"""
知識庫資料模型
"""

from dataclasses import dataclass
from datetime import datetime
from typing import List, Dict, Any, Optional
import json
import uuid

@dataclass
class Article:
    """文章資料模型"""
    id: str
    title: str
    content: str
    category: str
    author: str
    tags: List[str]
    created_at: datetime
    updated_at: datetime
    view_count: int = 0
    like_count: int = 0

class KnowledgeBase:
    """知識庫管理類"""
    
    def __init__(self):
        """初始化知識庫"""
        self.articles: Dict[str, Article] = {}
        self.categories: Dict[str, int] = {}
        self.load_sample_data()
    
    def add_article(self, title: str, content: str, category: str, 
                   author: str = "system", tags: List[str] = None) -> str:
        """
        新增文章
        
        Args:
            title: 文章標題
            content: 文章內容
            category: 分類
            author: 作者
            tags: 標籤列表
            
        Returns:
            文章 ID
        """
        article_id = str(uuid.uuid4())
        
        if tags is None:
            tags = []
        
        article = Article(
            id=article_id,
            title=title,
            content=content,
            category=category,
            author=author,
            tags=tags,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        self.articles[article_id] = article
        
        # 更新分類統計
        self.categories[category] = self.categories.get(category, 0) + 1
        
        return article_id
    
    def get_article(self, article_id: str) -> Optional[Dict[str, Any]]:
        """
        獲取文章
        
        Args:
            article_id: 文章 ID
            
        Returns:
            文章資料或 None
        """
        if article_id not in self.articles:
            return None
        
        article = self.articles[article_id]
        
        # 增加閱讀次數
        article.view_count += 1
        
        return {
            "id": article.id,
            "title": article.title,
            "content": article.content,
            "category": article.category,
            "author": article.author,
            "tags": article.tags,
            "created_at": article.created_at.isoformat(),
            "updated_at": article.updated_at.isoformat(),
            "view_count": article.view_count,
            "like_count": article.like_count
        }
    
    def get_articles(self, category: str = '', page: int = 1, 
                    per_page: int = 20) -> Dict[str, Any]:
        """
        獲取文章列表
        
        Args:
            category: 分類篩選
            page: 頁數
            per_page: 每頁文章數
            
        Returns:
            文章列表和分頁資訊
        """
        # 篩選文章
        filtered_articles = []
        for article in self.articles.values():
            if not category or article.category == category:
                filtered_articles.append(article)
        
        # 排序（按創建時間倒序）
        filtered_articles.sort(key=lambda x: x.created_at, reverse=True)
        
        # 分頁
        total = len(filtered_articles)
        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        page_articles = filtered_articles[start_idx:end_idx]
        
        # 轉換為字典格式
        articles_data = []
        for article in page_articles:
            articles_data.append({
                "id": article.id,
                "title": article.title,
                "content": article.content[:200] + "..." if len(article.content) > 200 else article.content,
                "category": article.category,
                "author": article.author,
                "tags": article.tags,
                "created_at": article.created_at.isoformat(),
                "view_count": article.view_count,
                "like_count": article.like_count
            })
        
        return {
            "articles": articles_data,
            "pagination": {
                "page": page,
                "per_page": per_page,
                "total": total,
                "pages": (total + per_page - 1) // per_page
            }
        }
    
    def get_categories(self) -> List[Dict[str, Any]]:
        """
        獲取所有分類
        
        Returns:
            分類列表
        """
        categories_list = []
        for category, count in self.categories.items():
            categories_list.append({
                "name": category,
                "count": count
            })
        
        # 按文章數量排序
        categories_list.sort(key=lambda x: x['count'], reverse=True)
        
        return categories_list
    
    def get_popular_articles(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        獲取熱門文章
        
        Args:
            limit: 限制數量
            
        Returns:
            熱門文章列表
        """
        # 按閱讀次數排序
        popular_articles = sorted(
            self.articles.values(),
            key=lambda x: x.view_count + x.like_count * 2,
            reverse=True
        )[:limit]
        
        articles_data = []
        for article in popular_articles:
            articles_data.append({
                "id": article.id,
                "title": article.title,
                "category": article.category,
                "author": article.author,
                "view_count": article.view_count,
                "like_count": article.like_count,
                "created_at": article.created_at.isoformat()
            })
        
        return articles_data
    
    def get_recommendations(self, interests: List[str] = None, 
                          history: List[str] = None, limit: int = 5) -> List[Dict[str, Any]]:
        """
        獲取推薦文章
        
        Args:
            interests: 用戶興趣
            history: 用戶歷史
            limit: 限制數量
            
        Returns:
            推薦文章列表
        """
        if interests is None:
            interests = []
        if history is None:
            history = []
        
        scored_articles = []
        
        for article in self.articles.values():
            score = 0
            
            # 基於興趣評分
            if article.category in interests:
                score += 3
            
            for interest in interests:
                if interest.lower() in article.title.lower() or interest.lower() in " ".join(article.tags).lower():
                    score += 2
            
            # 避免推薦已看過的文章
            if article.id in history:
                score -= 5
            
            # 基於熱度評分
            score += (article.view_count * 0.1) + (article.like_count * 0.5)
            
            scored_articles.append((article, score))
        
        # 按分數排序
        scored_articles.sort(key=lambda x: x[1], reverse=True)
        
        # 取前 limit 篇
        recommendations = []
        for article, score in scored_articles[:limit]:
            if score > 0:  # 只推薦有正分的文章
                recommendations.append({
                    "id": article.id,
                    "title": article.title,
                    "category": article.category,
                    "author": article.author,
                    "tags": article.tags,
                    "created_at": article.created_at.isoformat(),
                    "score": round(score, 2)
                })
        
        return recommendations
    
    def get_statistics(self) -> Dict[str, Any]:
        """
        獲取統計資訊
        
        Returns:
            統計資訊
        """
        total_articles = len(self.articles)
        total_categories = len(self.categories)
        total_views = sum(article.view_count for article in self.articles.values())
        total_likes = sum(article.like_count for article in self.articles.values())
        
        # 最受歡迎的分類
        popular_category = max(self.categories.items(), key=lambda x: x[1]) if self.categories else ("", 0)
        
        return {
            "total_articles": total_articles,
            "total_categories": total_categories,
            "total_views": total_views,
            "total_likes": total_likes,
            "most_popular_category": {
                "name": popular_category[0],
                "count": popular_category[1]
            }
        }
    
    def search_articles(self, query: str, category: str = '') -> List[Dict[str, Any]]:
        """
        搜尋文章
        
        Args:
            query: 搜尋關鍵字
            category: 分類篩選
            
        Returns:
            搜尋結果
        """
        results = []
        query_lower = query.lower()
        
        for article in self.articles.values():
            # 分類篩選
            if category and article.category != category:
                continue
            
            # 關鍵字搜尋
            if (query_lower in article.title.lower() or
                query_lower in article.content.lower() or
                any(query_lower in tag.lower() for tag in article.tags)):
                
                results.append({
                    "id": article.id,
                    "title": article.title,
                    "content": article.content[:200] + "..." if len(article.content) > 200 else article.content,
                    "category": article.category,
                    "author": article.author,
                    "tags": article.tags,
                    "created_at": article.created_at.isoformat(),
                    "relevance_score": self._calculate_relevance(query_lower, article)
                })
        
        # 按相關度排序
        results.sort(key=lambda x: x['relevance_score'], reverse=True)
        
        return results
    
    def _calculate_relevance(self, query: str, article: Article) -> float:
        """計算文章相關度"""
        score = 0.0
        
        # 標題匹配
        if query in article.title.lower():
            score += 3.0
        
        # 內容匹配
        content_matches = article.content.lower().count(query)
        score += content_matches * 0.5
        
        # 標籤匹配
        for tag in article.tags:
            if query in tag.lower():
                score += 2.0
        
        return score
    
    def load_sample_data(self):
        """載入範例資料"""
        sample_articles = [
            {
                "title": "中醫養生基礎概念",
                "content": "中醫養生是以傳統中醫理論為指導，通過各種方法頤養生命、增強體質、預防疾病，從而達到延年益壽的一種醫事活動。中醫認為，人應該順應自然的變化，通過調整飲食、情志、運動等來維護健康。",
                "category": "養生保健",
                "author": "中醫專家",
                "tags": ["養生", "中醫理論", "健康"]
            },
            {
                "title": "四季養生法",
                "content": "春養肝、夏養心、秋養肺、冬養腎，這是中醫四季養生的基本原則。每個季節都有其特定的養生重點和方法，順應季節變化進行調養，能夠達到事半功倍的效果。",
                "category": "四季養生",
                "author": "養生專家", 
                "tags": ["四季", "養生", "臟腑"]
            },
            {
                "title": "常用中藥材介紹",
                "content": "中藥材是中醫治療疾病和養生保健的重要組成部分。人參、黃耆、當歸、川芎等都是常用的中藥材，各有其獨特的功效和使用方法。",
                "category": "中藥知識",
                "author": "藥學專家",
                "tags": ["中藥", "藥材", "功效"]
            }
        ]
        
        for article_data in sample_articles:
            self.add_article(**article_data)