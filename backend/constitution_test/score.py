"""
體質測試評分系統
"""

from typing import Dict, List, Any, Tuple
import math

class ConstitutionScorer:
    """中醫體質測試評分器"""
    
    def __init__(self):
        """初始化評分器"""
        self.questions = self._load_test_questions()
        self.constitution_weights = self._load_constitution_weights()
        self.recommendations = self._load_recommendations()
    
    def get_test_questions(self) -> List[Dict[str, Any]]:
        """獲取測試問題"""
        return self.questions
    
    def validate_answers(self, answers: Dict[int, int]) -> bool:
        """
        驗證答案格式
        
        Args:
            answers: 答案字典 {question_id: answer_value}
            
        Returns:
            是否有效
        """
        if not isinstance(answers, dict):
            return False
        
        # 檢查是否所有問題都有答案
        required_questions = set(range(1, len(self.questions) + 1))
        provided_questions = set(answers.keys())
        
        if not required_questions.issubset(provided_questions):
            return False
        
        # 檢查答案值是否在有效範圍內 (1-5)
        for answer in answers.values():
            if not isinstance(answer, int) or answer < 1 or answer > 5:
                return False
        
        return True
    
    def calculate_constitution(self, answers: Dict[int, int], 
                            user_info: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        計算體質分數
        
        Args:
            answers: 答案字典
            user_info: 用戶資訊
            
        Returns:
            體質分析結果
        """
        try:
            # 計算各體質類型得分
            raw_scores = self._calculate_raw_scores(answers)
            
            # 標準化分數
            normalized_scores = self._normalize_scores(raw_scores)
            
            # 確定主要和次要體質
            primary, secondary = self._determine_constitutions(normalized_scores)
            
            # 生成個人化建議
            recommendations = self._generate_recommendations(primary, secondary, user_info)
            
            # 計算置信度
            confidence = self._calculate_confidence(normalized_scores)
            
            result = {
                "primary_constitution": primary,
                "secondary_constitution": secondary,
                "scores": normalized_scores,
                "raw_scores": raw_scores,
                "recommendations": recommendations,
                "confidence": confidence,
                "interpretation": self._interpret_results(primary, secondary, normalized_scores)
            }
            
            return result
            
        except Exception as e:
            print(f"計算體質錯誤: {str(e)}")
            return self._get_default_result()
    
    def _calculate_raw_scores(self, answers: Dict[int, int]) -> Dict[str, int]:
        """計算原始分數"""
        scores = {constitution: 0 for constitution in self.constitution_weights.keys()}
        
        for question_id, answer_value in answers.items():
            if question_id in self.constitution_weights:
                question_weights = self.constitution_weights[question_id]
                
                for constitution, weight in question_weights.items():
                    scores[constitution] += answer_value * weight
        
        return scores
    
    def _normalize_scores(self, raw_scores: Dict[str, int]) -> Dict[str, float]:
        """標準化分數到 0-100 範圍"""
        normalized = {}
        
        # 計算理論最大值和最小值
        max_possible = sum(5 * max(weights.values(), default=0) 
                          for weights in self.constitution_weights.values())
        min_possible = sum(1 * min(weights.values(), default=0) 
                          for weights in self.constitution_weights.values())
        
        for constitution, score in raw_scores.items():
            if max_possible > min_possible:
                normalized_score = ((score - min_possible) / (max_possible - min_possible)) * 100
                normalized[constitution] = round(max(0, min(100, normalized_score)), 1)
            else:
                normalized[constitution] = 50.0  # 預設值
        
        return normalized
    
    def _determine_constitutions(self, scores: Dict[str, float]) -> Tuple[str, str]:
        """確定主要和次要體質"""
        sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        
        primary = sorted_scores[0][0]
        
        # 次要體質：分數差距在 10 分以內的最高分體質
        secondary = None
        primary_score = sorted_scores[0][1]
        
        for constitution, score in sorted_scores[1:]:
            if primary_score - score <= 10:
                secondary = constitution
                break
        
        return primary, secondary
    
    def _generate_recommendations(self, primary: str, secondary: str, 
                                user_info: Dict[str, Any]) -> Dict[str, List[str]]:
        """生成個人化建議"""
        recommendations = {
            "diet": [],
            "lifestyle": [],
            "exercise": [],
            "emotional": [],
            "seasonal": []
        }
        
        # 主要體質建議
        if primary in self.recommendations:
            primary_rec = self.recommendations[primary]
            for category in recommendations.keys():
                recommendations[category].extend(primary_rec.get(category, []))
        
        # 次要體質建議（如果存在）
        if secondary and secondary in self.recommendations:
            secondary_rec = self.recommendations[secondary]
            for category in recommendations.keys():
                # 只添加不重複的建議
                for rec in secondary_rec.get(category, []):
                    if rec not in recommendations[category]:
                        recommendations[category].append(rec)
        
        # 根據用戶資訊調整建議
        if user_info:
            recommendations = self._personalize_recommendations(recommendations, user_info)
        
        return recommendations
    
    def _personalize_recommendations(self, recommendations: Dict[str, List[str]], 
                                   user_info: Dict[str, Any]) -> Dict[str, List[str]]:
        """根據用戶資訊個人化建議"""
        # 年齡調整
        age = user_info.get('age', 0)
        if age > 60:
            recommendations['exercise'] = [
                rec for rec in recommendations['exercise'] 
                if '劇烈' not in rec and '高強度' not in rec
            ]
            recommendations['exercise'].append("選擇溫和的運動如太極、散步")
        
        # 性別調整
        gender = user_info.get('gender', '')
        if gender == '女性':
            recommendations['diet'].append("注意補充鐵質和鈣質")
            recommendations['emotional'].append("關注情緒健康，適當放鬆")
        
        # 季節調整
        import datetime
        current_month = datetime.datetime.now().month
        
        if current_month in [12, 1, 2]:  # 冬季
            recommendations['seasonal'].append("冬季養腎，多食溫熱食物")
        elif current_month in [3, 4, 5]:  # 春季
            recommendations['seasonal'].append("春季養肝，保持心情舒暢")
        elif current_month in [6, 7, 8]:  # 夏季
            recommendations['seasonal'].append("夏季養心，注意防暑降溫")
        elif current_month in [9, 10, 11]:  # 秋季
            recommendations['seasonal'].append("秋季養肺，注意潤燥")
        
        return recommendations
    
    def _calculate_confidence(self, scores: Dict[str, float]) -> float:
        """計算結果置信度"""
        sorted_scores = sorted(scores.values(), reverse=True)
        
        if len(sorted_scores) < 2:
            return 0.5
        
        # 基於最高分和次高分的差距計算置信度
        score_diff = sorted_scores[0] - sorted_scores[1]
        confidence = min(0.95, 0.5 + (score_diff / 100))
        
        return round(confidence, 2)
    
    def _interpret_results(self, primary: str, secondary: str, 
                          scores: Dict[str, float]) -> Dict[str, str]:
        """解釋測試結果"""
        interpretation = {
            "summary": f"您的主要體質類型為{primary}",
            "primary_description": self._get_constitution_description(primary),
            "advice": f"建議重點關注{primary}的調理方法"
        }
        
        if secondary:
            interpretation["summary"] += f"，次要體質為{secondary}"
            interpretation["secondary_description"] = self._get_constitution_description(secondary)
            interpretation["advice"] += f"，同時注意{secondary}相關調養"
        
        # 添加總體健康建議
        primary_score = scores.get(primary, 0)
        if primary_score >= 70:
            interpretation["health_status"] = "體質狀態良好"
        elif primary_score >= 50:
            interpretation["health_status"] = "體質需要適度調理"
        else:
            interpretation["health_status"] = "建議加強體質調養"
        
        return interpretation
    
    def _get_constitution_description(self, constitution: str) -> str:
        """獲取體質描述"""
        descriptions = {
            "平和質": "體質平和，身心健康，適應能力強",
            "氣虛質": "元氣不足，容易疲勞，免疫力較弱",
            "陽虛質": "陽氣不足，畏寒怕冷，手足不溫",
            "陰虛質": "陰液不足，體質偏熱，口乾咽燥",
            "痰濕質": "痰濕內蘊，形體肥胖，容易困倦",
            "濕熱質": "濕熱蘊結，面部油膩，容易上火",
            "血瘀質": "血行不暢，膚色晦暗，容易疼痛",
            "氣鬱質": "氣機鬱滯，情緒不穩，容易抑鬱",
            "特稟質": "先天異稟，容易過敏，體質特殊"
        }
        
        return descriptions.get(constitution, "體質特徵待進一步評估")
    
    def get_constitution_types_info(self) -> Dict[str, Dict[str, str]]:
        """獲取所有體質類型資訊"""
        types_info = {}
        
        for const_type in self.constitution_weights.keys():
            types_info[const_type] = {
                "name": const_type,
                "description": self._get_constitution_description(const_type),
                "characteristics": self._get_constitution_characteristics(const_type)
            }
        
        return types_info
    
    def _get_constitution_characteristics(self, constitution: str) -> str:
        """獲取體質特徵"""
        characteristics = {
            "平和質": "精力充沛，睡眠良好，性格開朗，適應力強",
            "氣虛質": "容易疲勞，聲音低弱，容易感冒，精神不振",
            "陽虛質": "手足發涼，喜熱飲食，精神不振，睡眠偏多",
            "陰虛質": "手足心熱，口燥咽乾，喜冷飲，大便乾燥",
            "痰濕質": "體形肥胖，腹部肥滿，胸悶，痰多",
            "濕熱質": "面垢油膩，易生痤瘡，口苦，大便黏滯",
            "血瘀質": "膚色晦暗，色素沉著，容易出現瘀斑，口唇暗淡",
            "氣鬱質": "神情抑鬱，情緒不穩，煩悶不樂，容易緊張",
            "特稟質": "過敏體質，容易哮喘，皮膚抓痕試驗陽性"
        }
        
        return characteristics.get(constitution, "特徵有待進一步評估")
    
    def get_recommendations_for_type(self, constitution_type: str) -> Dict[str, Any]:
        """獲取特定體質的調理建議"""
        if constitution_type not in self.recommendations:
            return {}
        
        return {
            "constitution_type": constitution_type,
            "description": self._get_constitution_description(constitution_type),
            "characteristics": self._get_constitution_characteristics(constitution_type),
            "recommendations": self.recommendations[constitution_type]
        }
    
    def _get_default_result(self) -> Dict[str, Any]:
        """獲取預設結果"""
        return {
            "primary_constitution": "平和質",
            "secondary_constitution": None,
            "scores": {const: 50.0 for const in self.constitution_weights.keys()},
            "recommendations": self.recommendations.get("平和質", {}),
            "confidence": 0.5,
            "interpretation": {
                "summary": "測試結果處理中，建議重新測試",
                "advice": "請確保測試環境良好，認真回答問題"
            }
        }
    
    def _load_test_questions(self) -> List[Dict[str, Any]]:
        """載入測試問題"""
        # 簡化版的體質測試問題
        return [
            {
                "id": 1,
                "question": "您平時精力充沛嗎？",
                "options": ["完全沒有", "很少", "一般", "經常", "總是如此"],
                "category": "general"
            },
            {
                "id": 2,
                "question": "您容易疲勞嗎？",
                "options": ["從不", "很少", "有時", "經常", "總是"],
                "category": "qi_deficiency"
            },
            {
                "id": 3,
                "question": "您怕冷嗎（比別人怕冷）？",
                "options": ["從不", "很少", "有時", "經常", "總是"],
                "category": "yang_deficiency"
            },
            {
                "id": 4,
                "question": "您手腳發熱嗎？",
                "options": ["從不", "很少", "有時", "經常", "總是"],
                "category": "yin_deficiency"
            },
            {
                "id": 5,
                "question": "您身體肥胖嗎？",
                "options": ["很瘦", "偏瘦", "正常", "偏胖", "肥胖"],
                "category": "phlegm_dampness"
            }
            # 實際使用中應該有更多問題
        ]
    
    def _load_constitution_weights(self) -> Dict[int, Dict[str, int]]:
        """載入體質權重配置"""
        # 簡化版權重配置
        return {
            1: {"平和質": 3, "氣虛質": -2, "陽虛質": -1, "陰虛質": -1, "痰濕質": -1, "濕熱質": -1, "血瘀質": -1, "氣鬱質": -1, "特稟質": -1},
            2: {"平和質": -2, "氣虛質": 3, "陽虛質": 1, "陰虛質": 0, "痰濕質": 1, "濕熱質": 0, "血瘀質": 1, "氣鬱質": 1, "特稟質": 0},
            3: {"平和質": -1, "氣虛質": 1, "陽虛質": 3, "陰虛質": -2, "痰濕質": 0, "濕熱質": -1, "血瘀質": 1, "氣鬱質": 0, "特稟質": 0},
            4: {"平和質": -1, "氣虛質": 0, "陽虛質": -2, "陰虛質": 3, "痰濕質": 0, "濕熱質": 1, "血瘀質": 0, "氣鬱質": 0, "特稟質": 0},
            5: {"平和質": -1, "氣虛質": 1, "陽虛質": 1, "陰虛質": 0, "痰濕質": 3, "濕熱質": 1, "血瘀質": 0, "氣鬱質": 0, "特稟質": 0}
        }
    
    def _load_recommendations(self) -> Dict[str, Dict[str, List[str]]]:
        """載入調理建議"""
        return {
            "平和質": {
                "diet": ["均衡飲食", "適量進食", "定時用餐"],
                "lifestyle": ["規律作息", "適度運動", "保持心情愉快"],
                "exercise": ["有氧運動", "力量訓練", "柔韌性練習"],
                "emotional": ["保持樂觀", "避免過度勞累", "培養興趣愛好"]
            },
            "氣虛質": {
                "diet": ["補氣食物", "山藥", "紅棗", "黃耆"],
                "lifestyle": ["充足睡眠", "避免勞累", "規律生活"],
                "exercise": ["輕度運動", "散步", "太極拳", "氣功"],
                "emotional": ["避免思慮過度", "保持愉快心情", "適當休息"]
            },
            "陽虛質": {
                "diet": ["溫熱食物", "生薑", "肉桂", "羊肉"],
                "lifestyle": ["保暖", "避免寒涼", "早睡早起"],
                "exercise": ["溫和運動", "日光浴", "保暖鍛煉"],
                "emotional": ["保持積極心態", "避免情緒低落", "多曬太陽"]
            },
            "陰虛質": {
                "diet": ["滋陰食物", "銀耳", "百合", "枸杞"],
                "lifestyle": ["避免熬夜", "保持環境濕潤", "規律作息"],
                "exercise": ["中等強度運動", "游泳", "瑜伽"],
                "emotional": ["保持平和心境", "避免急躁", "冥想放鬆"]
            },
            "痰濕質": {
                "diet": ["清淡飲食", "少油少鹽", "薏仁", "冬瓜"],
                "lifestyle": ["控制體重", "避免潮濕環境", "規律運動"],
                "exercise": ["有氧運動", "跑步", "游泳", "舞蹈"],
                "emotional": ["保持積極心態", "培養運動習慣", "社交活動"]
            }
            # 其他體質類型的建議...
        }