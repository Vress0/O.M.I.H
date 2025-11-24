"""
中醫師資料模型
"""

from dataclasses import dataclass
from datetime import datetime
from typing import List, Dict, Any, Optional
import json
import uuid

@dataclass
class Doctor:
    """醫師資料模型"""
    id: str
    name: str
    gender: str
    age: int
    specialties: List[str]  # 專長領域
    hospital: str
    department: str
    title: str  # 職稱
    years_of_experience: int
    education: str
    certifications: List[str]  # 證照
    address: str
    phone: str
    consultation_fee: float
    available_times: List[str]  # 可預約時間
    rating: float  # 評分 (1-5)
    review_count: int
    description: str
    created_at: datetime
    updated_at: datetime

@dataclass  
class DoctorReview:
    """醫師評價模型"""
    id: str
    doctor_id: str
    user_id: str
    rating: int  # 1-5 星
    comment: str
    treatment_date: datetime
    created_at: datetime

class DoctorDatabase:
    """醫師資料庫管理"""
    
    def __init__(self):
        """初始化醫師資料庫"""
        self.doctors: Dict[str, Doctor] = {}
        self.reviews: Dict[str, DoctorReview] = {}
        self.specialties_index: Dict[str, List[str]] = {}  # 專長 -> 醫師ID列表
        self.location_index: Dict[str, List[str]] = {}     # 地區 -> 醫師ID列表
        self.load_sample_doctors()
    
    def add_doctor(self, doctor_data: Dict[str, Any]) -> str:
        """
        新增醫師
        
        Args:
            doctor_data: 醫師資料
            
        Returns:
            醫師 ID
        """
        doctor_id = str(uuid.uuid4())
        
        doctor = Doctor(
            id=doctor_id,
            name=doctor_data['name'],
            gender=doctor_data.get('gender', ''),
            age=doctor_data.get('age', 0),
            specialties=doctor_data.get('specialties', []),
            hospital=doctor_data.get('hospital', ''),
            department=doctor_data.get('department', ''),
            title=doctor_data.get('title', ''),
            years_of_experience=doctor_data.get('years_of_experience', 0),
            education=doctor_data.get('education', ''),
            certifications=doctor_data.get('certifications', []),
            address=doctor_data.get('address', ''),
            phone=doctor_data.get('phone', ''),
            consultation_fee=doctor_data.get('consultation_fee', 0.0),
            available_times=doctor_data.get('available_times', []),
            rating=doctor_data.get('rating', 0.0),
            review_count=doctor_data.get('review_count', 0),
            description=doctor_data.get('description', ''),
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        self.doctors[doctor_id] = doctor
        
        # 更新索引
        self._update_indices(doctor)
        
        return doctor_id
    
    def get_doctor(self, doctor_id: str) -> Optional[Dict[str, Any]]:
        """
        獲取醫師詳細資料
        
        Args:
            doctor_id: 醫師 ID
            
        Returns:
            醫師資料或 None
        """
        if doctor_id not in self.doctors:
            return None
        
        doctor = self.doctors[doctor_id]
        
        return {
            "id": doctor.id,
            "name": doctor.name,
            "gender": doctor.gender,
            "age": doctor.age,
            "specialties": doctor.specialties,
            "hospital": doctor.hospital,
            "department": doctor.department,
            "title": doctor.title,
            "years_of_experience": doctor.years_of_experience,
            "education": doctor.education,
            "certifications": doctor.certifications,
            "address": doctor.address,
            "phone": doctor.phone,
            "consultation_fee": doctor.consultation_fee,
            "available_times": doctor.available_times,
            "rating": doctor.rating,
            "review_count": doctor.review_count,
            "description": doctor.description,
            "created_at": doctor.created_at.isoformat(),
            "updated_at": doctor.updated_at.isoformat()
        }
    
    def search_doctors(self, criteria: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        搜尋醫師
        
        Args:
            criteria: 搜尋條件
            
        Returns:
            符合條件的醫師列表
        """
        results = []
        
        for doctor in self.doctors.values():
            if self._matches_criteria(doctor, criteria):
                results.append(self._doctor_to_dict(doctor))
        
        # 排序結果
        sort_by = criteria.get('sort_by', 'rating')
        reverse = criteria.get('reverse', True)
        
        if sort_by == 'rating':
            results.sort(key=lambda x: x['rating'], reverse=reverse)
        elif sort_by == 'experience':
            results.sort(key=lambda x: x['years_of_experience'], reverse=reverse)
        elif sort_by == 'fee':
            results.sort(key=lambda x: x['consultation_fee'], reverse=not reverse)
        
        return results
    
    def get_doctors_by_specialty(self, specialty: str) -> List[Dict[str, Any]]:
        """
        根據專長獲取醫師列表
        
        Args:
            specialty: 專長領域
            
        Returns:
            醫師列表
        """
        if specialty not in self.specialties_index:
            return []
        
        doctor_ids = self.specialties_index[specialty]
        doctors = []
        
        for doctor_id in doctor_ids:
            if doctor_id in self.doctors:
                doctors.append(self._doctor_to_dict(self.doctors[doctor_id]))
        
        # 按評分排序
        doctors.sort(key=lambda x: x['rating'], reverse=True)
        
        return doctors
    
    def get_doctors_by_location(self, location: str) -> List[Dict[str, Any]]:
        """
        根據地區獲取醫師列表
        
        Args:
            location: 地區
            
        Returns:
            醫師列表
        """
        if location not in self.location_index:
            return []
        
        doctor_ids = self.location_index[location]
        doctors = []
        
        for doctor_id in doctor_ids:
            if doctor_id in self.doctors:
                doctors.append(self._doctor_to_dict(self.doctors[doctor_id]))
        
        return doctors
    
    def add_review(self, doctor_id: str, user_id: str, rating: int, 
                   comment: str, treatment_date: datetime = None) -> str:
        """
        新增醫師評價
        
        Args:
            doctor_id: 醫師 ID
            user_id: 用戶 ID
            rating: 評分 (1-5)
            comment: 評論
            treatment_date: 就診日期
            
        Returns:
            評價 ID
        """
        if doctor_id not in self.doctors:
            raise ValueError("醫師不存在")
        
        if not (1 <= rating <= 5):
            raise ValueError("評分必須在 1-5 之間")
        
        review_id = str(uuid.uuid4())
        
        review = DoctorReview(
            id=review_id,
            doctor_id=doctor_id,
            user_id=user_id,
            rating=rating,
            comment=comment,
            treatment_date=treatment_date or datetime.now(),
            created_at=datetime.now()
        )
        
        self.reviews[review_id] = review
        
        # 更新醫師評分
        self._update_doctor_rating(doctor_id)
        
        return review_id
    
    def get_doctor_reviews(self, doctor_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        獲取醫師評價
        
        Args:
            doctor_id: 醫師 ID
            limit: 限制數量
            
        Returns:
            評價列表
        """
        doctor_reviews = []
        
        for review in self.reviews.values():
            if review.doctor_id == doctor_id:
                doctor_reviews.append({
                    "id": review.id,
                    "user_id": review.user_id,
                    "rating": review.rating,
                    "comment": review.comment,
                    "treatment_date": review.treatment_date.isoformat(),
                    "created_at": review.created_at.isoformat()
                })
        
        # 按創建時間排序
        doctor_reviews.sort(key=lambda x: x['created_at'], reverse=True)
        
        return doctor_reviews[:limit]
    
    def get_specialties(self) -> List[Dict[str, Any]]:
        """
        獲取所有專長領域
        
        Returns:
            專長列表
        """
        specialties = []
        
        for specialty, doctor_ids in self.specialties_index.items():
            specialties.append({
                "name": specialty,
                "doctor_count": len(doctor_ids)
            })
        
        # 按醫師數量排序
        specialties.sort(key=lambda x: x['doctor_count'], reverse=True)
        
        return specialties
    
    def get_statistics(self) -> Dict[str, Any]:
        """
        獲取統計資訊
        
        Returns:
            統計資訊
        """
        total_doctors = len(self.doctors)
        total_reviews = len(self.reviews)
        
        # 平均評分
        if self.doctors:
            avg_rating = sum(d.rating for d in self.doctors.values()) / total_doctors
        else:
            avg_rating = 0.0
        
        # 專長分布
        specialty_distribution = {
            specialty: len(doctor_ids) 
            for specialty, doctor_ids in self.specialties_index.items()
        }
        
        return {
            "total_doctors": total_doctors,
            "total_reviews": total_reviews,
            "average_rating": round(avg_rating, 2),
            "specialty_distribution": specialty_distribution
        }
    
    def _matches_criteria(self, doctor: Doctor, criteria: Dict[str, Any]) -> bool:
        """檢查醫師是否符合搜尋條件"""
        # 姓名搜尋
        if 'name' in criteria and criteria['name']:
            if criteria['name'].lower() not in doctor.name.lower():
                return False
        
        # 專長搜尋
        if 'specialty' in criteria and criteria['specialty']:
            if criteria['specialty'] not in doctor.specialties:
                return False
        
        # 地區搜尋
        if 'location' in criteria and criteria['location']:
            if criteria['location'] not in doctor.address:
                return False
        
        # 評分篩選
        if 'min_rating' in criteria:
            if doctor.rating < criteria['min_rating']:
                return False
        
        # 費用範圍
        if 'max_fee' in criteria:
            if doctor.consultation_fee > criteria['max_fee']:
                return False
        
        return True
    
    def _doctor_to_dict(self, doctor: Doctor) -> Dict[str, Any]:
        """將醫師物件轉換為字典"""
        return {
            "id": doctor.id,
            "name": doctor.name,
            "gender": doctor.gender,
            "specialties": doctor.specialties,
            "hospital": doctor.hospital,
            "title": doctor.title,
            "years_of_experience": doctor.years_of_experience,
            "address": doctor.address,
            "phone": doctor.phone,
            "consultation_fee": doctor.consultation_fee,
            "rating": doctor.rating,
            "review_count": doctor.review_count,
            "description": doctor.description
        }
    
    def _update_indices(self, doctor: Doctor):
        """更新索引"""
        # 專長索引
        for specialty in doctor.specialties:
            if specialty not in self.specialties_index:
                self.specialties_index[specialty] = []
            self.specialties_index[specialty].append(doctor.id)
        
        # 地區索引
        location_parts = doctor.address.split()
        for part in location_parts:
            if len(part) >= 2:  # 忽略太短的詞
                if part not in self.location_index:
                    self.location_index[part] = []
                self.location_index[part].append(doctor.id)
    
    def _update_doctor_rating(self, doctor_id: str):
        """更新醫師評分"""
        if doctor_id not in self.doctors:
            return
        
        doctor_reviews = [r for r in self.reviews.values() if r.doctor_id == doctor_id]
        
        if doctor_reviews:
            total_rating = sum(r.rating for r in doctor_reviews)
            avg_rating = total_rating / len(doctor_reviews)
            
            self.doctors[doctor_id].rating = round(avg_rating, 1)
            self.doctors[doctor_id].review_count = len(doctor_reviews)
            self.doctors[doctor_id].updated_at = datetime.now()
    
    def load_sample_doctors(self):
        """載入範例醫師資料"""
        sample_doctors = [
            {
                "name": "王中醫師",
                "gender": "男",
                "age": 45,
                "specialties": ["內科", "消化系統", "失眠"],
                "hospital": "中醫綜合醫院",
                "department": "內科",
                "title": "主治醫師",
                "years_of_experience": 20,
                "education": "中醫學碩士",
                "certifications": ["中醫師執照", "針灸專科"],
                "address": "台北市中正區中山南路123號",
                "phone": "02-1234-5678",
                "consultation_fee": 800.0,
                "available_times": ["週一至週五 09:00-17:00"],
                "rating": 4.5,
                "review_count": 120,
                "description": "擅長治療消化系統疾病和失眠問題，採用溫和的調理方法。"
            },
            {
                "name": "李中醫師",
                "gender": "女",
                "age": 38,
                "specialties": ["婦科", "調理體質", "美容"],
                "hospital": "國泰中醫診所",
                "department": "婦科",
                "title": "主任醫師",
                "years_of_experience": 15,
                "education": "中醫學博士",
                "certifications": ["中醫師執照", "婦科專科"],
                "address": "台北市信義區忠孝東路456號",
                "phone": "02-2345-6789",
                "consultation_fee": 1000.0,
                "available_times": ["週二、週四、週六 10:00-18:00"],
                "rating": 4.8,
                "review_count": 200,
                "description": "專精婦科調理，對於月經不調、更年期症狀有豐富經驗。"
            },
            {
                "name": "張中醫師", 
                "gender": "男",
                "age": 52,
                "specialties": ["骨傷科", "筋骨痠痛", "復健"],
                "hospital": "中醫正骨醫院",
                "department": "骨傷科",
                "title": "科主任",
                "years_of_experience": 25,
                "education": "中醫學學士",
                "certifications": ["中醫師執照", "推拿師證照"],
                "address": "新北市板橋區文化路789號",
                "phone": "02-3456-7890",
                "consultation_fee": 900.0,
                "available_times": ["週一至週五 08:00-12:00, 14:00-18:00"],
                "rating": 4.3,
                "review_count": 85,
                "description": "專治各種筋骨痠痛、運動傷害，手法溫和有效。"
            }
        ]
        
        for doctor_data in sample_doctors:
            self.add_doctor(doctor_data)