"""
體質測試 API 視圖
"""

from flask import Blueprint, request, jsonify
from .score import ConstitutionScorer
from .models import ConstitutionTest
from ai.utils import format_response

constitution_bp = Blueprint('constitution', __name__)
scorer = ConstitutionScorer()

@constitution_bp.route('/questions', methods=['GET'])
def get_questions():
    """
    獲取體質測試問題
    """
    try:
        questions = scorer.get_test_questions()
        return jsonify(format_response(questions))
        
    except Exception as e:
        print(f"獲取問題錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "獲取問題時發生錯誤"},
            success=False
        )), 500

@constitution_bp.route('/submit', methods=['POST'])
def submit_test():
    """
    提交體質測試答案
    """
    try:
        data = request.get_json()
        
        if not data or 'answers' not in data:
            return jsonify(format_response(
                {"error": "缺少必要參數 'answers'"},
                success=False
            )), 400
        
        answers = data['answers']
        user_info = data.get('user_info', {})
        
        # 驗證答案格式
        if not scorer.validate_answers(answers):
            return jsonify(format_response(
                {"error": "答案格式不正確"},
                success=False
            )), 400
        
        # 計算得分
        result = scorer.calculate_constitution(answers, user_info)
        
        # 儲存結果（可選）
        if user_info.get('user_id'):
            test_record = ConstitutionTest.create_record(
                user_id=user_info['user_id'],
                answers=answers,
                result=result,
                user_info=user_info
            )
            result['test_id'] = test_record['test_id']
        
        return jsonify(format_response(result))
        
    except Exception as e:
        print(f"提交測試錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "處理測試時發生錯誤"},
            success=False
        )), 500

@constitution_bp.route('/result/<test_id>', methods=['GET'])
def get_test_result(test_id):
    """
    獲取測試結果
    """
    try:
        result = ConstitutionTest.get_result(test_id)
        
        if not result:
            return jsonify(format_response(
                {"error": "找不到測試結果"},
                success=False
            )), 404
        
        return jsonify(format_response(result))
        
    except Exception as e:
        print(f"獲取結果錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "獲取結果時發生錯誤"},
            success=False
        )), 500

@constitution_bp.route('/history/<user_id>', methods=['GET'])
def get_test_history(user_id):
    """
    獲取用戶測試歷史
    """
    try:
        history = ConstitutionTest.get_user_history(user_id)
        return jsonify(format_response(history))
        
    except Exception as e:
        print(f"獲取歷史錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "獲取歷史時發生錯誤"},
            success=False
        )), 500

@constitution_bp.route('/types', methods=['GET'])
def get_constitution_types():
    """
    獲取體質類型說明
    """
    try:
        types_info = scorer.get_constitution_types_info()
        return jsonify(format_response(types_info))
        
    except Exception as e:
        print(f"獲取體質類型錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "獲取體質類型時發生錯誤"},
            success=False
        )), 500

@constitution_bp.route('/recommendations/<constitution_type>', methods=['GET'])
def get_constitution_recommendations(constitution_type):
    """
    根據體質類型獲取調理建議
    """
    try:
        recommendations = scorer.get_recommendations_for_type(constitution_type)
        
        if not recommendations:
            return jsonify(format_response(
                {"error": "找不到該體質類型的建議"},
                success=False
            )), 404
        
        return jsonify(format_response(recommendations))
        
    except Exception as e:
        print(f"獲取建議錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "獲取建議時發生錯誤"},
            success=False
        )), 500