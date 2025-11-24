"""
醫師推薦演算法
"""

from typing import List, Dict, Any, Tuple
import math

class DoctorRecommender:
    """醫師推薦系統"""
    
    def __init__(self, doctor_db):
        """
        初始化推薦系統
        
        Args:
            doctor_db: 醫師資料庫實例
        """
        self.doctor_db = doctor_db
        
        # 症狀與專長的對應關係
        self.symptom_specialty_mapping = {
            "頭痛": ["內科", "神經科"],
            "失眠": ["內科", "精神科"],
            "腹痛": ["內科", "消化科"],
            "腹瀉": ["內科", "消化科"],
            "便秘": ["內科", "消化科"],
            "咳嗽": ["內科", "呼吸科"],
            "胸悶": ["內科", "心血管科"],
            "心悸": ["內科", "心血管科"],
            "月經不調": ["婦科"],
            "更年期": ["婦科"],
            "腰痛": ["骨傷科", "復健科"],
            "關節痛": ["骨傷科", "風濕科"],
            "肌肉酸痛": ["骨傷科", "復健科"],
            "皮膚問題": ["皮膚科"],
            "過敏": ["皮膚科", "內科"]
        }
        
        # 體質與專長的對應關係
        self.constitution_specialty_mapping = {
            "氣虛質": ["內科", "調理體質"],
            "陽虛質": ["內科", "調理體質"],
            "陰虛質": ["內科", "調理體質"],
            "痰濕質": ["內科", "調理體質"],
            "濕熱質": ["內科", "皮膚科"],
            "血瘀質": ["內科", "婦科"],
            "氣鬱質": ["內科", "精神科"],
            "特稟質": ["內科", "過敏科"]
        }
    
    def recommend_doctors(self, user_profile: Dict[str, Any], 
                         max_results: int = 10) -> List[Dict[str, Any]]:
        """
        推薦醫師
        
        Args:
            user_profile: 用戶資料
            max_results: 最大結果數
            
        Returns:
            推薦醫師列表
        """
        try:
            # 獲取所有醫師
            all_doctors = list(self.doctor_db.doctors.values())
            
            if not all_doctors:
                return []
            
            # 計算每位醫師的匹配分數
            scored_doctors = []
            for doctor in all_doctors:
                score = self._calculate_match_score(doctor, user_profile)
                if score > 0:  # 只推薦有正分的醫師
                    doctor_dict = self.doctor_db._doctor_to_dict(doctor)
                    doctor_dict['match_score'] = round(score, 2)
                    doctor_dict['match_reasons'] = self._get_match_reasons(doctor, user_profile)
                    scored_doctors.append(doctor_dict)
            
            # 按匹配分數排序
            scored_doctors.sort(key=lambda x: x['match_score'], reverse=True)
            
            return scored_doctors[:max_results]
            
        except Exception as e:
            print(f"推薦醫師錯誤: {str(e)}")
            return []
    
    def _calculate_match_score(self, doctor, user_profile: Dict[str, Any]) -> float:
        """
        計算醫師與用戶的匹配分數
        
        Args:
            doctor: 醫師物件
            user_profile: 用戶資料
            
        Returns:
            匹配分數 (0-100)
        """
        score = 0.0
        
        # 1. 症狀匹配 (權重: 40%)
        symptoms = user_profile.get('symptoms', [])
        symptom_score = self._calculate_symptom_match(doctor, symptoms)
        score += symptom_score * 0.4
        
        # 2. 體質匹配 (權重: 25%)
        constitution_type = user_profile.get('constitution_type', '')
        constitution_score = self._calculate_constitution_match(doctor, constitution_type)
        score += constitution_score * 0.25
        
        # 3. 地理位置 (權重: 15%)
        location = user_profile.get('location', '')
        location_score = self._calculate_location_match(doctor, location)
        score += location_score * 0.15
        
        # 4. 醫師評分和經驗 (權重: 15%)
        quality_score = self._calculate_quality_score(doctor)
        score += quality_score * 0.15
        
        # 5. 其他偏好 (權重: 5%)
        preference_score = self._calculate_preference_match(doctor, user_profile)
        score += preference_score * 0.05
        
        return min(100.0, score)
    
    def _calculate_symptom_match(self, doctor, symptoms: List[str]) -> float:
        """計算症狀匹配度"""
        if not symptoms:
            return 50.0  # 中性分數
        
        match_score = 0.0
        total_symptoms = len(symptoms)
        
        for symptom in symptoms:
            if symptom in self.symptom_specialty_mapping:
                required_specialties = self.symptom_specialty_mapping[symptom]
                
                # 檢查醫師是否有對應專長
                for specialty in required_specialties:
                    if any(specialty in doc_specialty for doc_specialty in doctor.specialties):
                        match_score += 100 / total_symptoms
                        break
        
        return min(100.0, match_score)
    
    def _calculate_constitution_match(self, doctor, constitution_type: str) -> float:
        """計算體質匹配度"""
        if not constitution_type or constitution_type == "平和質":
            return 50.0  # 中性分數
        
        if constitution_type in self.constitution_specialty_mapping:
            required_specialties = self.constitution_specialty_mapping[constitution_type]
            
            for specialty in required_specialties:
                if any(specialty in doc_specialty for doc_specialty in doctor.specialties):
                    return 100.0
        
        # 檢查是否有調理體質的專長
        if any("調理" in specialty or "體質" in specialty for specialty in doctor.specialties):
            return 80.0
        
        return 30.0
    
    def _calculate_location_match(self, doctor, user_location: str) -> float:
        """計算地理位置匹配度"""
        if not user_location:
            return 50.0  # 中性分數
        
        doctor_location = doctor.address
        
        # 精確匹配
        if user_location in doctor_location:
            return 100.0
        
        # 部分匹配（同城市/區域）
        user_parts = user_location.split()
        doctor_parts = doctor_location.split()
        
        common_parts = set(user_parts) & set(doctor_parts)
        if common_parts:
            match_ratio = len(common_parts) / max(len(user_parts), len(doctor_parts))
            return match_ratio * 80
        
        return 20.0  # 基礎分數
    
    def _calculate_quality_score(self, doctor) -> float:
        """計算醫師品質分數"""
        # 評分權重 (60%)
        rating_score = (doctor.rating / 5.0) * 60
        
        # 經驗權重 (25%)
        experience_score = min(25, doctor.years_of_experience * 1.25)
        
        # 評價數量權重 (15%) - 更多評價表示更可信
        review_score = min(15, math.log10(doctor.review_count + 1) * 5)
        
        return rating_score + experience_score + review_score
    
    def _calculate_preference_match(self, doctor, user_profile: Dict[str, Any]) -> float:
        """計算用戶偏好匹配度"""
        score = 0.0
        
        # 性別偏好
        preferred_gender = user_profile.get('preferred_gender', '')
        if preferred_gender and doctor.gender == preferred_gender:
            score += 50.0
        elif not preferred_gender:
            score += 25.0  # 無偏好給中性分數
        
        # 費用偏好
        max_fee = user_profile.get('max_fee', float('inf'))
        if doctor.consultation_fee <= max_fee:
            # 費用越低分數越高
            if max_fee != float('inf'):
                fee_ratio = doctor.consultation_fee / max_fee
                score += (1 - fee_ratio) * 50.0
            else:
                score += 25.0
        
        return min(100.0, score)
    
    def _get_match_reasons(self, doctor, user_profile: Dict[str, Any]) -> List[str]:
        """獲取匹配原因"""
        reasons = []
        
        # 症狀匹配原因
        symptoms = user_profile.get('symptoms', [])
        for symptom in symptoms:
            if symptom in self.symptom_specialty_mapping:
                required_specialties = self.symptom_specialty_mapping[symptom]
                for specialty in required_specialties:
                    if any(specialty in doc_specialty for doc_specialty in doctor.specialties):
                        reasons.append(f"擅長治療{symptom}")
                        break
        
        # 體質匹配原因
        constitution_type = user_profile.get('constitution_type', '')
        if constitution_type and constitution_type != "平和質":
            if constitution_type in self.constitution_specialty_mapping:
                required_specialties = self.constitution_specialty_mapping[constitution_type]
                for specialty in required_specialties:
                    if any(specialty in doc_specialty for doc_specialty in doctor.specialties):
                        reasons.append(f"適合{constitution_type}調理")
                        break
        
        # 地理位置原因
        location = user_profile.get('location', '')
        if location and location in doctor.address:
            reasons.append(f"位於{location}附近")
        
        # 品質原因
        if doctor.rating >= 4.5:
            reasons.append(f"評分優秀 ({doctor.rating}/5)")
        
        if doctor.years_of_experience >= 15:
            reasons.append(f"經驗豐富 ({doctor.years_of_experience}年)")
        
        # 偏好原因
        preferred_gender = user_profile.get('preferred_gender', '')
        if preferred_gender and doctor.gender == preferred_gender:
            reasons.append(f"{preferred_gender}醫師")
        
        return reasons[:5]  # 限制原因數量
    
    def get_similar_doctors(self, doctor_id: str, limit: int = 5) -> List[Dict[str, Any]]:
        """
        獲取相似醫師
        
        Args:
            doctor_id: 目標醫師 ID
            limit: 結果數量限制
            
        Returns:
            相似醫師列表
        """
        target_doctor = self.doctor_db.get_doctor(doctor_id)
        if not target_doctor:
            return []
        
        similar_doctors = []
        
        for doctor in self.doctor_db.doctors.values():
            if doctor.id == doctor_id:
                continue
            
            similarity_score = self._calculate_doctor_similarity(
                target_doctor, self.doctor_db._doctor_to_dict(doctor)
            )
            
            if similarity_score > 0.3:  # 相似度閾值
                doctor_dict = self.doctor_db._doctor_to_dict(doctor)
                doctor_dict['similarity_score'] = round(similarity_score, 2)
                similar_doctors.append(doctor_dict)
        
        # 按相似度排序
        similar_doctors.sort(key=lambda x: x['similarity_score'], reverse=True)
        
        return similar_doctors[:limit]
    
    def _calculate_doctor_similarity(self, doctor1: Dict[str, Any], 
                                   doctor2: Dict[str, Any]) -> float:
        """計算兩位醫師的相似度"""
        similarity = 0.0
        
        # 專長相似度 (50%)
        specialties1 = set(doctor1['specialties'])
        specialties2 = set(doctor2['specialties'])
        
        if specialties1 and specialties2:
            specialty_similarity = len(specialties1 & specialties2) / len(specialties1 | specialties2)
            similarity += specialty_similarity * 0.5
        
        # 地理位置相似度 (20%)
        if doctor1['address'] and doctor2['address']:
            location_words1 = set(doctor1['address'].split())
            location_words2 = set(doctor2['address'].split())
            
            if location_words1 and location_words2:
                location_similarity = len(location_words1 & location_words2) / len(location_words1 | location_words2)
                similarity += location_similarity * 0.2
        
        # 經驗相似度 (15%)
        exp_diff = abs(doctor1['years_of_experience'] - doctor2['years_of_experience'])
        exp_similarity = max(0, 1 - exp_diff / 20)  # 20年為最大差距
        similarity += exp_similarity * 0.15
        
        # 評分相似度 (15%)
        rating_diff = abs(doctor1['rating'] - doctor2['rating'])
        rating_similarity = max(0, 1 - rating_diff / 5)  # 5分為最大差距
        similarity += rating_similarity * 0.15
        
        return similarity