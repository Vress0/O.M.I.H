"""
醫師資料匯入工具
"""

import csv
import json
import os
from typing import List, Dict, Any
from datetime import datetime
from .models import DoctorDatabase

class DoctorImporter:
    """醫師資料匯入器"""
    
    def __init__(self, doctor_db: DoctorDatabase = None):
        """初始化匯入器"""
        self.doctor_db = doctor_db or DoctorDatabase()
        self.base_path = os.path.dirname(__file__)
    
    def import_from_csv(self, csv_file_path: str = "doctors.csv") -> Dict[str, Any]:
        """
        從 CSV 檔案匯入醫師資料
        
        Args:
            csv_file_path: CSV 檔案路徑
            
        Returns:
            匯入結果統計
        """
        full_path = os.path.join(self.base_path, '..', 'db', csv_file_path)
        
        results = {
            'total_processed': 0,
            'successful_imports': 0,
            'failed_imports': 0,
            'errors': []
        }
        
        try:
            with open(full_path, 'r', encoding='utf-8', newline='') as f:
                reader = csv.DictReader(f)
                
                for row_num, row in enumerate(reader, start=2):  # 從第2行開始（跳過標題）
                    results['total_processed'] += 1
                    
                    try:
                        doctor_data = self._parse_csv_row(row)
                        
                        if self._validate_doctor_data(doctor_data):
                            self.doctor_db.add_doctor(doctor_data)
                            results['successful_imports'] += 1
                        else:
                            results['failed_imports'] += 1
                            results['errors'].append(f"第 {row_num} 行：資料驗證失敗")
                    
                    except Exception as e:
                        results['failed_imports'] += 1
                        results['errors'].append(f"第 {row_num} 行：{str(e)}")
        
        except FileNotFoundError:
            results['errors'].append(f"找不到檔案：{csv_file_path}")
        except Exception as e:
            results['errors'].append(f"讀取檔案錯誤：{str(e)}")
        
        return results
    
    def _parse_csv_row(self, row: Dict[str, str]) -> Dict[str, Any]:
        """解析 CSV 行資料"""
        # 處理專長（以分號分隔）
        specialties = []
        if row.get('specialties'):
            specialties = [s.strip() for s in row['specialties'].split(';') if s.strip()]
        
        # 處理證照（以分號分隔）
        certifications = []
        if row.get('certifications'):
            certifications = [c.strip() for c in row['certifications'].split(';') if c.strip()]
        
        # 處理可預約時間（以分號分隔）
        available_times = []
        if row.get('available_times'):
            available_times = [t.strip() for t in row['available_times'].split(';') if t.strip()]
        
        return {
            'name': row.get('name', '').strip(),
            'gender': row.get('gender', '').strip(),
            'age': int(row.get('age', 0)) if row.get('age', '').isdigit() else 0,
            'specialties': specialties,
            'hospital': row.get('hospital', '').strip(),
            'department': row.get('department', '').strip(),
            'title': row.get('title', '').strip(),
            'years_of_experience': int(row.get('years_of_experience', 0)) if row.get('years_of_experience', '').isdigit() else 0,
            'education': row.get('education', '').strip(),
            'certifications': certifications,
            'address': row.get('address', '').strip(),
            'phone': row.get('phone', '').strip(),
            'consultation_fee': float(row.get('consultation_fee', 0)) if row.get('consultation_fee', '').replace('.', '').isdigit() else 0.0,
            'available_times': available_times,
            'rating': float(row.get('rating', 0)) if row.get('rating', '').replace('.', '').isdigit() else 0.0,
            'review_count': int(row.get('review_count', 0)) if row.get('review_count', '').isdigit() else 0,
            'description': row.get('description', '').strip()
        }
    
    def _validate_doctor_data(self, doctor_data: Dict[str, Any]) -> bool:
        """驗證醫師資料"""
        # 必要欄位檢查
        required_fields = ['name', 'specialties', 'hospital']
        
        for field in required_fields:
            if not doctor_data.get(field):
                return False
        
        # 資料格式檢查
        if doctor_data.get('age', 0) < 0 or doctor_data.get('age', 0) > 100:
            return False
        
        if doctor_data.get('years_of_experience', 0) < 0:
            return False
        
        if doctor_data.get('rating', 0) < 0 or doctor_data.get('rating', 0) > 5:
            return False
        
        if doctor_data.get('consultation_fee', 0) < 0:
            return False
        
        return True
    
    def export_to_csv(self, csv_file_path: str = "doctors_export.csv") -> bool:
        """
        匯出醫師資料到 CSV 檔案
        
        Args:
            csv_file_path: 匯出檔案路徑
            
        Returns:
            是否成功匯出
        """
        try:
            full_path = os.path.join(self.base_path, '..', 'db', csv_file_path)
            
            # 確保目錄存在
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            
            with open(full_path, 'w', encoding='utf-8', newline='') as f:
                if not self.doctor_db.doctors:
                    return True  # 空資料庫也算成功
                
                # 取得第一個醫師的資料來決定欄位
                first_doctor = next(iter(self.doctor_db.doctors.values()))
                fieldnames = [
                    'name', 'gender', 'age', 'specialties', 'hospital', 'department',
                    'title', 'years_of_experience', 'education', 'certifications',
                    'address', 'phone', 'consultation_fee', 'available_times',
                    'rating', 'review_count', 'description'
                ]
                
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
                
                for doctor in self.doctor_db.doctors.values():
                    row = {
                        'name': doctor.name,
                        'gender': doctor.gender,
                        'age': doctor.age,
                        'specialties': ';'.join(doctor.specialties),
                        'hospital': doctor.hospital,
                        'department': doctor.department,
                        'title': doctor.title,
                        'years_of_experience': doctor.years_of_experience,
                        'education': doctor.education,
                        'certifications': ';'.join(doctor.certifications),
                        'address': doctor.address,
                        'phone': doctor.phone,
                        'consultation_fee': doctor.consultation_fee,
                        'available_times': ';'.join(doctor.available_times),
                        'rating': doctor.rating,
                        'review_count': doctor.review_count,
                        'description': doctor.description
                    }
                    writer.writerow(row)
            
            return True
            
        except Exception as e:
            print(f"匯出 CSV 錯誤: {str(e)}")
            return False
    
    def create_sample_csv(self, csv_file_path: str = "sample_doctors.csv") -> bool:
        """
        創建範例 CSV 檔案
        
        Args:
            csv_file_path: 檔案路徑
            
        Returns:
            是否成功創建
        """
        try:
            full_path = os.path.join(self.base_path, '..', 'db', csv_file_path)
            
            # 確保目錄存在
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            
            sample_data = [
                {
                    'name': '陳中醫師',
                    'gender': '男',
                    'age': 48,
                    'specialties': '內科;消化系統;慢性病調理',
                    'hospital': '康寧中醫診所',
                    'department': '內科',
                    'title': '院長',
                    'years_of_experience': 22,
                    'education': '中醫學博士',
                    'certifications': '中醫師執照;內科專科醫師',
                    'address': '台北市大安區信義路四段123號',
                    'phone': '02-1111-2222',
                    'consultation_fee': 850,
                    'available_times': '週一至週五 09:00-12:00;週一至週五 14:00-17:00;週六 09:00-12:00',
                    'rating': 4.6,
                    'review_count': 156,
                    'description': '專精消化系統疾病，擅長慢性胃炎、腸胃功能紊亂的調理。'
                },
                {
                    'name': '劉中醫師',
                    'gender': '女',
                    'age': 42,
                    'specialties': '婦科;不孕症;產後調理',
                    'hospital': '生生中醫診所',
                    'department': '婦科',
                    'title': '主治醫師',
                    'years_of_experience': 18,
                    'education': '中醫學碩士',
                    'certifications': '中醫師執照;婦科專科醫師',
                    'address': '新北市板橋區中山路二段456號',
                    'phone': '02-2222-3333',
                    'consultation_fee': 1200,
                    'available_times': '週二四六 10:00-18:00',
                    'rating': 4.9,
                    'review_count': 203,
                    'description': '專門治療女性相關疾病，在不孕症治療方面有顯著成效。'
                },
                {
                    'name': '黃中醫師',
                    'gender': '男',
                    'age': 56,
                    'specialties': '骨傷科;運動傷害;脊椎問題',
                    'hospital': '正骨堂中醫診所',
                    'department': '骨傷科',
                    'title': '主任醫師',
                    'years_of_experience': 30,
                    'education': '中醫學學士',
                    'certifications': '中醫師執照;推拿師證照;骨傷科專科',
                    'address': '台中市西區台灣大道二段789號',
                    'phone': '04-3333-4444',
                    'consultation_fee': 1000,
                    'available_times': '週一至週六 08:00-12:00;週一至週五 14:00-18:00',
                    'rating': 4.4,
                    'review_count': 98,
                    'description': '從事骨傷科治療30年，對各類筋骨痠痛、運動傷害有豐富經驗。'
                }
            ]
            
            with open(full_path, 'w', encoding='utf-8', newline='') as f:
                fieldnames = sample_data[0].keys()
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(sample_data)
            
            return True
            
        except Exception as e:
            print(f"創建範例 CSV 錯誤: {str(e)}")
            return False
    
    def validate_csv_format(self, csv_file_path: str) -> Dict[str, Any]:
        """
        驗證 CSV 檔案格式
        
        Args:
            csv_file_path: CSV 檔案路徑
            
        Returns:
            驗證結果
        """
        full_path = os.path.join(self.base_path, '..', 'db', csv_file_path)
        
        result = {
            'valid': True,
            'errors': [],
            'warnings': [],
            'total_rows': 0,
            'valid_rows': 0
        }
        
        required_columns = ['name', 'specialties', 'hospital']
        
        try:
            with open(full_path, 'r', encoding='utf-8', newline='') as f:
                reader = csv.DictReader(f)
                
                # 檢查必要欄位
                missing_columns = [col for col in required_columns if col not in reader.fieldnames]
                if missing_columns:
                    result['valid'] = False
                    result['errors'].append(f"缺少必要欄位: {', '.join(missing_columns)}")
                    return result
                
                for row_num, row in enumerate(reader, start=2):
                    result['total_rows'] += 1
                    
                    # 檢查必要欄位是否有值
                    row_errors = []
                    for col in required_columns:
                        if not row.get(col, '').strip():
                            row_errors.append(f"第 {row_num} 行：{col} 欄位不能為空")
                    
                    # 檢查數值欄位格式
                    numeric_fields = ['age', 'years_of_experience', 'consultation_fee', 'rating', 'review_count']
                    for field in numeric_fields:
                        value = row.get(field, '').strip()
                        if value and not self._is_numeric(value):
                            row_errors.append(f"第 {row_num} 行：{field} 必須為數值")
                    
                    if row_errors:
                        result['errors'].extend(row_errors)
                    else:
                        result['valid_rows'] += 1
                
                if result['errors']:
                    result['valid'] = False
        
        except FileNotFoundError:
            result['valid'] = False
            result['errors'].append(f"找不到檔案: {csv_file_path}")
        except Exception as e:
            result['valid'] = False
            result['errors'].append(f"讀取檔案錯誤: {str(e)}")
        
        return result
    
    def _is_numeric(self, value: str) -> bool:
        """檢查字串是否為數值"""
        try:
            float(value)
            return True
        except ValueError:
            return False