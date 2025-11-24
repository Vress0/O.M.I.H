"""
症狀輸入 API 視圖
"""

from flask import Blueprint, request, jsonify
from .logic import SymptomProcessor
from ai.utils import format_response, validate_symptoms

symptom_bp = Blueprint('symptoms', __name__)
symptom_processor = SymptomProcessor()

@symptom_bp.route('/submit', methods=['POST'])
def submit_symptoms():
    """
    提交症狀進行分析
    """
    try:
        data = request.get_json()
        
        if not data or 'symptoms' not in data:
            return jsonify(format_response(
                {"error": "缺少必要參數 'symptoms'"},
                success=False
            )), 400
        
        symptoms = data['symptoms']
        user_info = data.get('user_info', {})
        
        # 驗證症狀輸入
        if not validate_symptoms(symptoms):
            return jsonify(format_response(
                {"error": "症狀格式不正確"},
                success=False
            )), 400
        
        # 處理症狀
        result = symptom_processor.process_symptoms(symptoms, user_info)
        
        return jsonify(format_response(result))
        
    except Exception as e:
        print(f"症狀提交錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "處理症狀時發生錯誤"},
            success=False
        )), 500

@symptom_bp.route('/categories', methods=['GET'])
def get_symptom_categories():
    """
    獲取症狀分類
    """
    try:
        categories = symptom_processor.get_symptom_categories()
        return jsonify(format_response(categories))
        
    except Exception as e:
        print(f"獲取症狀分類錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "獲取症狀分類時發生錯誤"},
            success=False
        )), 500

@symptom_bp.route('/common', methods=['GET'])
def get_common_symptoms():
    """
    獲取常見症狀列表
    """
    try:
        category = request.args.get('category', '')
        common_symptoms = symptom_processor.get_common_symptoms(category)
        
        return jsonify(format_response(common_symptoms))
        
    except Exception as e:
        print(f"獲取常見症狀錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "獲取常見症狀時發生錯誤"},
            success=False
        )), 500

@symptom_bp.route('/validate', methods=['POST'])
def validate_symptom_input():
    """
    驗證症狀輸入
    """
    try:
        data = request.get_json()
        
        if not data or 'symptoms' not in data:
            return jsonify(format_response(
                {"error": "缺少必要參數 'symptoms'"},
                success=False
            )), 400
        
        symptoms = data['symptoms']
        validation_result = symptom_processor.validate_symptoms(symptoms)
        
        return jsonify(format_response(validation_result))
        
    except Exception as e:
        print(f"症狀驗證錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "驗證症狀時發生錯誤"},
            success=False
        )), 500

@symptom_bp.route('/history/<user_id>', methods=['GET'])
def get_symptom_history(user_id):
    """
    獲取用戶症狀記錄歷史
    """
    try:
        history = symptom_processor.get_user_symptom_history(user_id)
        return jsonify(format_response(history))
        
    except Exception as e:
        print(f"獲取症狀歷史錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "獲取症狀歷史時發生錯誤"},
            success=False
        )), 500