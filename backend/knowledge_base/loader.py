"""
知識庫資料載入器
"""

import json
import csv
import os
from typing import List, Dict, Any
from datetime import datetime

class KnowledgeLoader:
    """知識庫資料載入器"""
    
    def __init__(self):
        """初始化載入器"""
        self.base_path = os.path.dirname(__file__)
    
    def load_from_json(self, file_path: str) -> List[Dict[str, Any]]:
        """
        從 JSON 檔案載入知識
        
        Args:
            file_path: JSON 檔案路徑
            
        Returns:
            知識條目列表
        """
        try:
            full_path = os.path.join(self.base_path, '..', 'db', file_path)
            
            with open(full_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            if isinstance(data, list):
                return data
            elif isinstance(data, dict) and 'articles' in data:
                return data['articles']
            else:
                return [data]
                
        except FileNotFoundError:
            print(f"知識庫檔案不存在: {file_path}")
            return []
        except json.JSONDecodeError as e:
            print(f"JSON 格式錯誤: {str(e)}")
            return []
        except Exception as e:
            print(f"載入知識庫錯誤: {str(e)}")
            return []
    
    def load_from_csv(self, file_path: str) -> List[Dict[str, Any]]:
        """
        從 CSV 檔案載入知識
        
        Args:
            file_path: CSV 檔案路徑
            
        Returns:
            知識條目列表
        """
        try:
            full_path = os.path.join(self.base_path, '..', 'db', file_path)
            
            articles = []
            with open(full_path, 'r', encoding='utf-8', newline='') as f:
                reader = csv.DictReader(f)
                
                for row in reader:
                    article = {
                        'title': row.get('title', ''),
                        'content': row.get('content', ''),
                        'category': row.get('category', '一般'),
                        'author': row.get('author', 'system'),
                        'tags': row.get('tags', '').split(',') if row.get('tags') else []
                    }
                    
                    if article['title'] and article['content']:
                        articles.append(article)
            
            return articles
            
        except FileNotFoundError:
            print(f"CSV 檔案不存在: {file_path}")
            return []
        except Exception as e:
            print(f"載入 CSV 錯誤: {str(e)}")
            return []
    
    def save_to_json(self, articles: List[Dict[str, Any]], file_path: str) -> bool:
        """
        儲存知識到 JSON 檔案
        
        Args:
            articles: 知識條目列表
            file_path: 儲存路徑
            
        Returns:
            是否成功
        """
        try:
            full_path = os.path.join(self.base_path, '..', 'db', file_path)
            
            # 確保目錄存在
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            
            with open(full_path, 'w', encoding='utf-8') as f:
                json.dump(articles, f, ensure_ascii=False, indent=2)
            
            return True
            
        except Exception as e:
            print(f"儲存 JSON 錯誤: {str(e)}")
            return False
    
    def import_tcm_knowledge(self) -> List[Dict[str, Any]]:
        """
        匯入中醫知識庫
        
        Returns:
            中醫知識條目列表
        """
        # 嘗試從 JSON 檔案載入
        tcm_data = self.load_from_json('tcm_knowledge.json')
        
        if not tcm_data:
            # 如果沒有資料，創建基礎知識庫
            tcm_data = self._create_basic_tcm_knowledge()
            # 儲存到檔案
            self.save_to_json(tcm_data, 'tcm_knowledge.json')
        
        return tcm_data
    
    def _create_basic_tcm_knowledge(self) -> List[Dict[str, Any]]:
        """創建基礎中醫知識庫"""
        return [
            {
                "id": 1,
                "title": "中醫基礎理論",
                "content": "中醫學是以陰陽五行作為理論基礎，將人體看成是氣、形、神的統一體，通過望、聞、問、切四診合參的方法，探求病因、病性、病位、分析病機及人體內五臟六腑、經絡關節、氣血津液的變化，判斷邪正消長，進而得出病名，歸納出證型，以辨證論治原則，制定汗、吐、下、和、溫、清、補、消等治法，使用中藥、針灸、推拿、按摩、拔罐、氣功、食療等多種治療手段，使人體達到陰陽調和而康復。",
                "category": "基礎理論",
                "tags": ["陰陽", "五行", "四診", "辨證論治"],
                "author": "中醫專家"
            },
            {
                "id": 2,
                "title": "九種體質類型",
                "content": "中醫將人體體質分為九種類型：平和質、氣虛質、陽虛質、陰虛質、痰濕質、濕熱質、血瘀質、氣鬱質、特稟質。每種體質都有其特定的生理和心理特徵，需要相應的調理方法。",
                "category": "體質學說",
                "tags": ["體質", "九種體質", "調理"],
                "author": "體質專家"
            },
            {
                "id": 3,
                "title": "中醫養生原則",
                "content": "中醫養生強調「治未病」，即預防疾病的發生。主要原則包括：順應自然、調和陰陽、調養精神、規律生活、適度運動、合理飲食、節制房事等。",
                "category": "養生保健",
                "tags": ["養生", "治未病", "陰陽調和"],
                "author": "養生專家"
            },
            {
                "id": 4,
                "title": "常見症狀的中醫解釋",
                "content": "頭痛：多由風邪上犯、肝陽上亢、腎精不足等引起。失眠：多由心腎不交、肝鬱化火、脾胃不和等導致。咳嗽：分為外感咳嗽和內傷咳嗽，需要辨證施治。",
                "category": "症狀辨證",
                "tags": ["症狀", "辨證", "頭痛", "失眠", "咳嗽"],
                "author": "臨床醫師"
            },
            {
                "id": 5,
                "title": "四季養生法",
                "content": "春季養肝：疏肝理氣，保持心情舒暢。夏季養心：清心火，注意防暑。秋季養肺：潤燥養陰，預防感冒。冬季養腎：溫腎助陽，適當進補。",
                "category": "四季養生",
                "tags": ["四季養生", "春夏秋冬", "臟腑調養"],
                "author": "季節養生專家"
            },
            {
                "id": 6,
                "title": "中藥材功效分類",
                "content": "補益類：人參、黃耆、當歸等。清熱類：黃連、黃芩、板藍根等。理氣類：陳皮、香附、柴胡等。活血類：丹參、紅花、川芎等。每類藥材都有其特定的功效和適用範圍。",
                "category": "中藥知識",
                "tags": ["中藥", "藥材分類", "功效"],
                "author": "中藥師"
            },
            {
                "id": 7,
                "title": "經絡穴位基礎",
                "content": "人體有十二正經和奇經八脈，共有361個經穴。常用保健穴位包括：足三里（強身健體）、關元（補腎壯陽）、氣海（益氣養血）、百會（醒腦開竅）等。",
                "category": "經絡穴位",
                "tags": ["經絡", "穴位", "針灸", "保健"],
                "author": "針灸專家"
            },
            {
                "id": 8,
                "title": "中醫飲食療法",
                "content": "藥食同源是中醫的重要理念。常見食療方：生薑紅糖水（溫中散寒）、蓮子百合湯（養心安神）、山藥粥（健脾益氣）、枸杞菊花茶（滋陰明目）。",
                "category": "食療養生",
                "tags": ["食療", "藥食同源", "食療方"],
                "author": "食療專家"
            }
        ]
    
    def validate_article_data(self, article: Dict[str, Any]) -> bool:
        """
        驗證文章資料格式
        
        Args:
            article: 文章資料
            
        Returns:
            是否有效
        """
        required_fields = ['title', 'content']
        
        for field in required_fields:
            if field not in article or not article[field]:
                return False
        
        return True
    
    def batch_import(self, file_paths: List[str]) -> Dict[str, Any]:
        """
        批量匯入知識
        
        Args:
            file_paths: 檔案路徑列表
            
        Returns:
            匯入結果統計
        """
        results = {
            'total_files': len(file_paths),
            'successful_files': 0,
            'failed_files': 0,
            'total_articles': 0,
            'errors': []
        }
        
        for file_path in file_paths:
            try:
                if file_path.endswith('.json'):
                    articles = self.load_from_json(file_path)
                elif file_path.endswith('.csv'):
                    articles = self.load_from_csv(file_path)
                else:
                    results['errors'].append(f"不支援的檔案格式: {file_path}")
                    results['failed_files'] += 1
                    continue
                
                valid_articles = [a for a in articles if self.validate_article_data(a)]
                
                results['successful_files'] += 1
                results['total_articles'] += len(valid_articles)
                
                if len(valid_articles) != len(articles):
                    results['errors'].append(
                        f"{file_path}: {len(articles) - len(valid_articles)} 篇文章格式錯誤"
                    )
                
            except Exception as e:
                results['failed_files'] += 1
                results['errors'].append(f"{file_path}: {str(e)}")
        
        return results