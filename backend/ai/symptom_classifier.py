"""
症狀分類器 - 將用戶症狀轉換為中醫調理方向
"""

import openai
import json
from typing import Dict, List, Any
from .utils import load_prompt

class SymptomClassifier:
    def __init__(self, api_key: str):
        """初始化症狀分類器"""
        self.client = openai.OpenAI(api_key=api_key)
        self.symptom_prompt = load_prompt('symptom_prompt.txt')
        
    def classify_symptoms(self, symptoms: List[str], user_info: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        分析症狀並返回調理方向
        
        Args:
            symptoms: 用戶症狀列表
            user_info: 用戶基本資訊 (年齡、性別等)
            
        Returns:
            調理建議的字典
        """
        try:
            # 準備提示詞
            user_context = self._prepare_user_context(symptoms, user_info)
            full_prompt = f"{self.symptom_prompt}\n\n用戶資訊：\n{user_context}"
            
            # 調用 AI
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": full_prompt},
                    {"role": "user", "content": f"請分析以下症狀：{', '.join(symptoms)}"}
                ],
                temperature=0.3
            )
            
            # 解析回應
            result = self._parse_ai_response(response.choices[0].message.content)
            return result
            
        except Exception as e:
            print(f"症狀分析錯誤: {str(e)}")
            return self._get_default_response()
    
    def _prepare_user_context(self, symptoms: List[str], user_info: Dict[str, Any]) -> str:
        """準備用戶上下文資訊"""
        context_parts = []
        context_parts.append(f"症狀: {', '.join(symptoms)}")
        
        if user_info:
            if 'age' in user_info:
                context_parts.append(f"年齡: {user_info['age']}")
            if 'gender' in user_info:
                context_parts.append(f"性別: {user_info['gender']}")
            if 'constitution_type' in user_info:
                context_parts.append(f"體質類型: {user_info['constitution_type']}")
        
        return "\n".join(context_parts)
    
    def _parse_ai_response(self, response_text: str) -> Dict[str, Any]:
        """解析 AI 回應"""
        try:
            # 嘗試解析為 JSON
            return json.loads(response_text)
        except json.JSONDecodeError:
            # 如果不是 JSON，提取關鍵資訊
            return {
                "constitution_analysis": response_text,
                "recommendations": [],
                "severity": "中等",
                "confidence": 0.7
            }
    
    def _get_default_response(self) -> Dict[str, Any]:
        """返回預設回應"""
        return {
            "constitution_analysis": "建議尋求專業中醫師診斷",
            "recommendations": [
                "保持規律作息",
                "均衡飲食",
                "適度運動"
            ],
            "severity": "未知",
            "confidence": 0.0
        }