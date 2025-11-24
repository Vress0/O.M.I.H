"""
AI 工具函數
"""

import os
from typing import Dict, Any

def load_prompt(filename: str) -> str:
    """
    載入提示詞檔案
    
    Args:
        filename: 提示詞檔案名稱
        
    Returns:
        提示詞內容
    """
    try:
        prompt_path = os.path.join(os.path.dirname(__file__), 'prompts', filename)
        with open(prompt_path, 'r', encoding='utf-8') as f:
            return f.read().strip()
    except FileNotFoundError:
        print(f"提示詞檔案不存在: {filename}")
        return ""
    except Exception as e:
        print(f"載入提示詞錯誤: {str(e)}")
        return ""

def format_response(data: Dict[str, Any], success: bool = True) -> Dict[str, Any]:
    """
    格式化 API 回應
    
    Args:
        data: 回應資料
        success: 是否成功
        
    Returns:
        格式化的回應
    """
    return {
        "success": success,
        "data": data,
        "timestamp": "2025-11-24T00:00:00Z"  # 在實際使用中應使用 datetime.now()
    }

def validate_symptoms(symptoms: list) -> bool:
    """
    驗證症狀輸入
    
    Args:
        symptoms: 症狀列表
        
    Returns:
        是否有效
    """
    if not symptoms or not isinstance(symptoms, list):
        return False
    
    # 檢查每個症狀是否為字串且不為空
    for symptom in symptoms:
        if not isinstance(symptom, str) or not symptom.strip():
            return False
    
    return True

def calculate_confidence_score(factors: Dict[str, float]) -> float:
    """
    計算置信度分數
    
    Args:
        factors: 影響因子字典
        
    Returns:
        置信度分數 (0-1)
    """
    if not factors:
        return 0.0
    
    # 加權平均
    weights = {
        'symptom_clarity': 0.3,
        'knowledge_match': 0.4,
        'user_info_completeness': 0.2,
        'ai_confidence': 0.1
    }
    
    total_score = 0.0
    total_weight = 0.0
    
    for factor, score in factors.items():
        if factor in weights:
            total_score += score * weights[factor]
            total_weight += weights[factor]
    
    return total_score / total_weight if total_weight > 0 else 0.0