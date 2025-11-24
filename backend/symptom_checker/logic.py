"""
症狀處理邏輯
"""

from typing import List, Dict, Any
from datetime import datetime
import json

class SymptomProcessor:
    """症狀處理器"""
    
    def __init__(self):
        """初始化症狀處理器"""
        self.symptom_categories = self._load_symptom_categories()
        self.common_symptoms = self._load_common_symptoms()
        self.user_history = {}  # 實際使用中應連接資料庫
    
    def process_symptoms(self, symptoms: List[str], user_info: Dict[str, Any]) -> Dict[str, Any]:
        """
        處理症狀輸入
        
        Args:
            symptoms: 症狀列表
            user_info: 用戶資訊
            
        Returns:
            處理結果
        """
        try:
            # 症狀標準化
            normalized_symptoms = self._normalize_symptoms(symptoms)
            
            # 分類症狀
            categorized_symptoms = self._categorize_symptoms(normalized_symptoms)
            
            # 嚴重度評估
            severity_assessment = self._assess_severity(normalized_symptoms)
            
            # 生成初步建議
            preliminary_suggestions = self._generate_preliminary_suggestions(
                categorized_symptoms, severity_assessment
            )
            
            # 儲存記錄
            if 'user_id' in user_info:
                self._save_symptom_record(user_info['user_id'], symptoms, user_info)
            
            result = {
                "processed_symptoms": normalized_symptoms,
                "categories": categorized_symptoms,
                "severity": severity_assessment,
                "preliminary_suggestions": preliminary_suggestions,
                "requires_immediate_attention": severity_assessment.get('urgent', False),
                "next_steps": self._get_next_steps(severity_assessment)
            }
            
            return result
            
        except Exception as e:
            print(f"處理症狀錯誤: {str(e)}")
            return {"error": "症狀處理失敗"}
    
    def _normalize_symptoms(self, symptoms: List[str]) -> List[str]:
        """標準化症狀描述"""
        normalized = []
        
        for symptom in symptoms:
            # 去除多餘空白
            symptom = symptom.strip()
            
            # 症狀關鍵詞映射
            symptom_mapping = {
                "頭疼": "頭痛",
                "肚子痛": "腹痛",
                "感冒": "感冒症狀",
                # 可以添加更多映射
            }
            
            normalized_symptom = symptom_mapping.get(symptom, symptom)
            if normalized_symptom and normalized_symptom not in normalized:
                normalized.append(normalized_symptom)
        
        return normalized
    
    def _categorize_symptoms(self, symptoms: List[str]) -> Dict[str, List[str]]:
        """將症狀分類"""
        categories = {
            "respiratory": [],    # 呼吸系統
            "digestive": [],      # 消化系統
            "neurological": [],   # 神經系統
            "cardiovascular": [], # 心血管系統
            "musculoskeletal": [],# 肌肉骨骼
            "dermatological": [], # 皮膚
            "general": []         # 一般症狀
        }
        
        # 症狀分類映射表
        category_mapping = {
            "咳嗽": "respiratory",
            "喉嚨痛": "respiratory",
            "鼻塞": "respiratory",
            "腹痛": "digestive",
            "腹瀉": "digestive",
            "噁心": "digestive",
            "頭痛": "neurological",
            "頭暈": "neurological",
            "胸痛": "cardiovascular",
            "心悸": "cardiovascular",
            "肌肉酸痛": "musculoskeletal",
            "關節痛": "musculoskeletal",
            "皮疹": "dermatological",
            "發燒": "general",
            "疲勞": "general"
        }
        
        for symptom in symptoms:
            category = category_mapping.get(symptom, "general")
            categories[category].append(symptom)
        
        # 移除空分類
        return {k: v for k, v in categories.items() if v}
    
    def _assess_severity(self, symptoms: List[str]) -> Dict[str, Any]:
        """評估症狀嚴重度"""
        # 緊急症狀列表
        emergency_symptoms = [
            "胸痛", "呼吸困難", "劇烈頭痛", "意識不清", 
            "嚴重腹痛", "嘔血", "高燒", "劇烈嘔吐"
        ]
        
        # 中度症狀
        moderate_symptoms = [
            "持續咳嗽", "關節腫痛", "皮疹", "腹瀉"
        ]
        
        urgent_count = sum(1 for symptom in symptoms if any(e in symptom for e in emergency_symptoms))
        moderate_count = sum(1 for symptom in symptoms if any(m in symptom for m in moderate_symptoms))
        
        if urgent_count > 0:
            severity_level = "緊急"
            urgent = True
        elif moderate_count >= 2 or len(symptoms) >= 5:
            severity_level = "中度"
            urgent = False
        else:
            severity_level = "輕度"
            urgent = False
        
        return {
            "level": severity_level,
            "urgent": urgent,
            "score": min(urgent_count * 3 + moderate_count, 10),
            "emergency_symptoms": [s for s in symptoms if any(e in s for e in emergency_symptoms)]
        }
    
    def _generate_preliminary_suggestions(self, categorized_symptoms: Dict[str, List[str]], 
                                        severity: Dict[str, Any]) -> List[str]:
        """生成初步建議"""
        suggestions = []
        
        if severity['urgent']:
            suggestions.append("建議立即就醫")
            return suggestions
        
        # 根據症狀分類給予建議
        if 'respiratory' in categorized_symptoms:
            suggestions.append("注意保暖，多喝溫水")
            suggestions.append("避免到人多的地方")
        
        if 'digestive' in categorized_symptoms:
            suggestions.append("清淡飲食，少量多餐")
            suggestions.append("避免生冷食物")
        
        if 'general' in categorized_symptoms:
            suggestions.append("充足休息")
            suggestions.append("保持規律作息")
        
        # 通用建議
        suggestions.extend([
            "均衡營養",
            "適度運動",
            "保持良好心情"
        ])
        
        return suggestions
    
    def _get_next_steps(self, severity: Dict[str, Any]) -> List[str]:
        """獲取後續步驟建議"""
        if severity['urgent']:
            return [
                "立即前往急診科",
                "準備相關病史資料",
                "聯繫家人陪同"
            ]
        elif severity['level'] == '中度':
            return [
                "建議 1-2 天內就醫",
                "觀察症狀變化",
                "記錄症狀發展"
            ]
        else:
            return [
                "觀察症狀 3-5 天",
                "如症狀加重請就醫",
                "嘗試自我調理方法"
            ]
    
    def get_symptom_categories(self) -> Dict[str, List[str]]:
        """獲取症狀分類"""
        return self.symptom_categories
    
    def get_common_symptoms(self, category: str = '') -> List[str]:
        """獲取常見症狀"""
        if category and category in self.common_symptoms:
            return self.common_symptoms[category]
        return self.common_symptoms.get('all', [])
    
    def validate_symptoms(self, symptoms: List[str]) -> Dict[str, Any]:
        """驗證症狀輸入"""
        if not symptoms or not isinstance(symptoms, list):
            return {"valid": False, "error": "症狀列表不能為空"}
        
        valid_symptoms = []
        invalid_symptoms = []
        
        for symptom in symptoms:
            if isinstance(symptom, str) and symptom.strip():
                valid_symptoms.append(symptom.strip())
            else:
                invalid_symptoms.append(symptom)
        
        return {
            "valid": len(invalid_symptoms) == 0,
            "valid_symptoms": valid_symptoms,
            "invalid_symptoms": invalid_symptoms,
            "count": len(valid_symptoms)
        }
    
    def get_user_symptom_history(self, user_id: str) -> List[Dict[str, Any]]:
        """獲取用戶症狀歷史"""
        return self.user_history.get(user_id, [])
    
    def _save_symptom_record(self, user_id: str, symptoms: List[str], user_info: Dict[str, Any]):
        """儲存症狀記錄"""
        if user_id not in self.user_history:
            self.user_history[user_id] = []
        
        record = {
            "symptoms": symptoms,
            "timestamp": datetime.now().isoformat(),
            "user_info": user_info
        }
        
        self.user_history[user_id].append(record)
        
        # 限制歷史記錄數量
        if len(self.user_history[user_id]) > 50:
            self.user_history[user_id] = self.user_history[user_id][-50:]
    
    def _load_symptom_categories(self) -> Dict[str, List[str]]:
        """載入症狀分類"""
        return {
            "呼吸系統": ["咳嗽", "喉嚨痛", "鼻塞", "流鼻水", "呼吸困難"],
            "消化系統": ["腹痛", "腹瀉", "便秘", "噁心", "嘔吐", "食慾不振"],
            "神經系統": ["頭痛", "頭暈", "失眠", "記憶力減退", "注意力不集中"],
            "心血管": ["胸痛", "心悸", "氣喘", "血壓異常"],
            "肌肉骨骼": ["肌肉酸痛", "關節痛", "腰痛", "頸痛", "四肢無力"],
            "皮膚": ["皮疹", "搔癢", "乾燥", "紅腫"],
            "一般症狀": ["發燒", "疲勞", "體重變化", "情緒變化"]
        }
    
    def _load_common_symptoms(self) -> Dict[str, List[str]]:
        """載入常見症狀"""
        return {
            "all": [
                "頭痛", "發燒", "咳嗽", "腹痛", "疲勞", 
                "失眠", "食慾不振", "肌肉酸痛", "頭暈", "噁心"
            ],
            "respiratory": ["咳嗽", "喉嚨痛", "鼻塞", "流鼻水"],
            "digestive": ["腹痛", "腹瀉", "便秘", "噁心", "嘔吐"],
            "general": ["發燒", "疲勞", "頭痛", "頭暈", "失眠"]
        }