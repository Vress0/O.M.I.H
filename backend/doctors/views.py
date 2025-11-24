"""
中醫師 API 視圖
"""

from flask import Blueprint, request, jsonify
from .models import DoctorDatabase
from .recommender import DoctorRecommender
from ai.utils import format_response

doctors_bp = Blueprint('doctors', __name__)
doctor_db = DoctorDatabase()
recommender = DoctorRecommender(doctor_db)

@doctors_bp.route('/search', methods=['POST'])
def search_doctors():
    """
    搜尋醫師
    """
    try:
        data = request.get_json()
        
        criteria = {
            'name': data.get('name', ''),
            'specialty': data.get('specialty', ''),
            'location': data.get('location', ''),
            'min_rating': data.get('min_rating', 0),
            'max_fee': data.get('max_fee', float('inf')),
            'sort_by': data.get('sort_by', 'rating'),
            'reverse': data.get('reverse', True)
        }
        
        results = doctor_db.search_doctors(criteria)
        
        return jsonify(format_response({
            "doctors": results,
            "total": len(results),
            "criteria": criteria
        }))
        
    except Exception as e:
        print(f"搜尋醫師錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "搜尋醫師時發生錯誤"},
            success=False
        )), 500

@doctors_bp.route('/doctor/<doctor_id>', methods=['GET'])
def get_doctor(doctor_id):
    """
    獲取醫師詳細資料
    """
    try:
        doctor = doctor_db.get_doctor(doctor_id)
        
        if not doctor:
            return jsonify(format_response(
                {"error": "找不到醫師"},
                success=False
            )), 404
        
        # 獲取評價
        reviews = doctor_db.get_doctor_reviews(doctor_id, limit=5)
        doctor['recent_reviews'] = reviews
        
        return jsonify(format_response(doctor))
        
    except Exception as e:
        print(f"獲取醫師錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "獲取醫師資料時發生錯誤"},
            success=False
        )), 500

@doctors_bp.route('/specialties', methods=['GET'])
def get_specialties():
    """
    獲取專長領域列表
    """
    try:
        specialties = doctor_db.get_specialties()
        return jsonify(format_response(specialties))
        
    except Exception as e:
        print(f"獲取專長錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "獲取專長時發生錯誤"},
            success=False
        )), 500

@doctors_bp.route('/specialty/<specialty>', methods=['GET'])
def get_doctors_by_specialty(specialty):
    """
    根據專長獲取醫師
    """
    try:
        doctors = doctor_db.get_doctors_by_specialty(specialty)
        
        return jsonify(format_response({
            "specialty": specialty,
            "doctors": doctors,
            "total": len(doctors)
        }))
        
    except Exception as e:
        print(f"獲取專長醫師錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "獲取專長醫師時發生錯誤"},
            success=False
        )), 500

@doctors_bp.route('/recommend', methods=['POST'])
def recommend_doctors():
    """
    推薦醫師
    """
    try:
        data = request.get_json()
        
        user_profile = {
            'symptoms': data.get('symptoms', []),
            'constitution_type': data.get('constitution_type', ''),
            'location': data.get('location', ''),
            'preferred_gender': data.get('preferred_gender', ''),
            'max_fee': data.get('max_fee', float('inf')),
            'user_id': data.get('user_id', 'anonymous')
        }
        
        recommendations = recommender.recommend_doctors(user_profile)
        
        return jsonify(format_response({
            "recommendations": recommendations,
            "user_profile": user_profile,
            "total": len(recommendations)
        }))
        
    except Exception as e:
        print(f"推薦醫師錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "推薦醫師時發生錯誤"},
            success=False
        )), 500

@doctors_bp.route('/reviews', methods=['POST'])
def add_review():
    """
    新增醫師評價
    """
    try:
        data = request.get_json()
        
        required_fields = ['doctor_id', 'user_id', 'rating', 'comment']
        for field in required_fields:
            if not data or field not in data:
                return jsonify(format_response(
                    {"error": f"缺少必要參數 '{field}'"},
                    success=False
                )), 400
        
        # 驗證評分範圍
        rating = data['rating']
        if not (1 <= rating <= 5):
            return jsonify(format_response(
                {"error": "評分必須在 1-5 之間"},
                success=False
            )), 400
        
        review_id = doctor_db.add_review(
            doctor_id=data['doctor_id'],
            user_id=data['user_id'],
            rating=rating,
            comment=data['comment']
        )
        
        return jsonify(format_response({
            "review_id": review_id,
            "message": "評價新增成功"
        }))
        
    except ValueError as ve:
        return jsonify(format_response(
            {"error": str(ve)},
            success=False
        )), 400
    except Exception as e:
        print(f"新增評價錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "新增評價時發生錯誤"},
            success=False
        )), 500

@doctors_bp.route('/reviews/<doctor_id>', methods=['GET'])
def get_doctor_reviews(doctor_id):
    """
    獲取醫師評價
    """
    try:
        limit = int(request.args.get('limit', 10))
        reviews = doctor_db.get_doctor_reviews(doctor_id, limit)
        
        return jsonify(format_response({
            "doctor_id": doctor_id,
            "reviews": reviews,
            "total": len(reviews)
        }))
        
    except Exception as e:
        print(f"獲取評價錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "獲取評價時發生錯誤"},
            success=False
        )), 500

@doctors_bp.route('/statistics', methods=['GET'])
def get_statistics():
    """
    獲取醫師統計資訊
    """
    try:
        stats = doctor_db.get_statistics()
        return jsonify(format_response(stats))
        
    except Exception as e:
        print(f"獲取統計錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "獲取統計時發生錯誤"},
            success=False
        )), 500

@doctors_bp.route('/popular', methods=['GET'])
def get_popular_doctors():
    """
    獲取熱門醫師
    """
    try:
        limit = int(request.args.get('limit', 10))
        
        # 獲取所有醫師並按評分和評價數排序
        all_doctors = []
        for doctor in doctor_db.doctors.values():
            all_doctors.append(doctor_db._doctor_to_dict(doctor))
        
        # 計算熱門度分數（評分 * 權重 + 評價數 * 權重）
        for doctor in all_doctors:
            popularity_score = (doctor['rating'] * 0.7) + (doctor['review_count'] * 0.003)
            doctor['popularity_score'] = popularity_score
        
        # 按熱門度排序
        all_doctors.sort(key=lambda x: x['popularity_score'], reverse=True)
        
        popular_doctors = all_doctors[:limit]
        
        return jsonify(format_response({
            "popular_doctors": popular_doctors,
            "total": len(popular_doctors)
        }))
        
    except Exception as e:
        print(f"獲取熱門醫師錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "獲取熱門醫師時發生錯誤"},
            success=False
        )), 500