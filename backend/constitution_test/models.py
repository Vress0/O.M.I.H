"""
體質測試資料模型
"""

from dataclasses import dataclass
from datetime import datetime
from typing import Dict, List, Any, Optional
import json
import uuid

@dataclass
class ConstitutionTestResult:
    """體質測試結果"""
    test_id: str
    user_id: str
    primary_constitution: str
    secondary_constitution: Optional[str]
    scores: Dict[str, float]
    recommendations: Dict[str, List[str]]
    test_date: datetime
    answers: Dict[int, int]
    user_info: Optional[Dict[str, Any]] = None

class ConstitutionTest:
    """體質測試管理類"""
    
    # 類別變數來儲存測試記錄（實際使用中應連接資料庫）
    test_records: Dict[str, ConstitutionTestResult] = {}
    user_histories: Dict[str, List[str]] = {}
    
    @classmethod
    def create_record(cls, user_id: str, answers: Dict[int, int], 
                     result: Dict[str, Any], user_info: Optional[Dict[str, Any]] = None) -> Dict[str, str]:
        """
        創建測試記錄
        
        Args:
            user_id: 用戶 ID
            answers: 答案
            result: 測試結果
            user_info: 用戶資訊
            
        Returns:
            包含 test_id 的字典
        """
        test_id = str(uuid.uuid4())
        
        test_result = ConstitutionTestResult(
            test_id=test_id,
            user_id=user_id,
            primary_constitution=result.get('primary_constitution', '平和質'),
            secondary_constitution=result.get('secondary_constitution'),
            scores=result.get('scores', {}),
            recommendations=result.get('recommendations', {}),
            test_date=datetime.now(),
            answers=answers,
            user_info=user_info
        )
        
        # 儲存記錄
        cls.test_records[test_id] = test_result
        
        # 更新用戶歷史
        if user_id not in cls.user_histories:
            cls.user_histories[user_id] = []
        cls.user_histories[user_id].append(test_id)
        
        # 限制歷史記錄數量
        if len(cls.user_histories[user_id]) > 20:
            old_test_id = cls.user_histories[user_id].pop(0)
            if old_test_id in cls.test_records:
                del cls.test_records[old_test_id]
        
        return {"test_id": test_id}
    
    @classmethod
    def get_result(cls, test_id: str) -> Optional[Dict[str, Any]]:
        """
        獲取測試結果
        
        Args:
            test_id: 測試 ID
            
        Returns:
            測試結果或 None
        """
        if test_id not in cls.test_records:
            return None
        
        record = cls.test_records[test_id]
        
        return {
            "test_id": record.test_id,
            "user_id": record.user_id,
            "primary_constitution": record.primary_constitution,
            "secondary_constitution": record.secondary_constitution,
            "scores": record.scores,
            "recommendations": record.recommendations,
            "test_date": record.test_date.isoformat(),
            "answers": record.answers,
            "user_info": record.user_info
        }
    
    @classmethod
    def get_user_history(cls, user_id: str) -> List[Dict[str, Any]]:
        """
        獲取用戶測試歷史
        
        Args:
            user_id: 用戶 ID
            
        Returns:
            測試歷史列表
        """
        if user_id not in cls.user_histories:
            return []
        
        history = []
        for test_id in cls.user_histories[user_id]:
            if test_id in cls.test_records:
                record = cls.test_records[test_id]
                history.append({
                    "test_id": record.test_id,
                    "primary_constitution": record.primary_constitution,
                    "secondary_constitution": record.secondary_constitution,
                    "test_date": record.test_date.isoformat(),
                    "scores": record.scores
                })
        
        # 按時間倒序排列
        history.sort(key=lambda x: x['test_date'], reverse=True)
        return history
    
    @classmethod
    def get_latest_result(cls, user_id: str) -> Optional[Dict[str, Any]]:
        """
        獲取用戶最新的測試結果
        
        Args:
            user_id: 用戶 ID
            
        Returns:
            最新測試結果或 None
        """
        if user_id not in cls.user_histories or not cls.user_histories[user_id]:
            return None
        
        latest_test_id = cls.user_histories[user_id][-1]
        return cls.get_result(latest_test_id)
    
    @classmethod
    def delete_test(cls, test_id: str, user_id: str) -> bool:
        """
        刪除測試記錄
        
        Args:
            test_id: 測試 ID
            user_id: 用戶 ID
            
        Returns:
            是否刪除成功
        """
        try:
            if test_id in cls.test_records:
                record = cls.test_records[test_id]
                
                # 驗證用戶權限
                if record.user_id != user_id:
                    return False
                
                # 刪除記錄
                del cls.test_records[test_id]
                
                # 從用戶歷史中移除
                if user_id in cls.user_histories:
                    cls.user_histories[user_id] = [
                        tid for tid in cls.user_histories[user_id] 
                        if tid != test_id
                    ]
                
                return True
            
            return False
            
        except Exception as e:
            print(f"刪除測試記錄錯誤: {str(e)}")
            return False
    
    @classmethod
    def get_statistics(cls) -> Dict[str, Any]:
        """
        獲取統計資訊
        
        Returns:
            統計資訊
        """
        try:
            total_tests = len(cls.test_records)
            total_users = len(cls.user_histories)
            
            # 體質類型分布
            constitution_counts = {}
            for record in cls.test_records.values():
                const_type = record.primary_constitution
                constitution_counts[const_type] = constitution_counts.get(const_type, 0) + 1
            
            # 最近 30 天的測試數量
            from datetime import timedelta
            thirty_days_ago = datetime.now() - timedelta(days=30)
            recent_tests = sum(
                1 for record in cls.test_records.values() 
                if record.test_date >= thirty_days_ago
            )
            
            return {
                "total_tests": total_tests,
                "total_users": total_users,
                "constitution_distribution": constitution_counts,
                "recent_tests_30d": recent_tests
            }
            
        except Exception as e:
            print(f"獲取統計資訊錯誤: {str(e)}")
            return {}

# 體質類型常數
CONSTITUTION_TYPES = {
    "平和質": "體質平衡，身心健康",
    "氣虛質": "元氣不足，疲乏無力",
    "陽虛質": "陽氣不足，畏寒怕冷", 
    "陰虛質": "陰液虧少，體質偏熱",
    "痰濕質": "痰濕凝聚，形體肥胖",
    "濕熱質": "濕熱蘊結，面垢油膩",
    "血瘀質": "血行不暢，膚色晦暗",
    "氣鬱質": "氣機鬱滯，神情抑鬱",
    "特稟質": "先天失常，以過敏反應為主"
}