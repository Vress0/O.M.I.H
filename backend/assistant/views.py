"""
AI 小助理 API 視圖
"""

from flask import Blueprint, request, jsonify
from ai.symptom_classifier import SymptomClassifier
from ai.rag import RAGSystem
from ai.utils import load_prompt, format_response, validate_symptoms
import os

assistant_bp = Blueprint('assistant', __name__)

# 初始化 AI 組件
rag_system = RAGSystem()
symptom_classifier = SymptomClassifier(api_key=os.getenv('OPENAI_API_KEY', ''))

@assistant_bp.route('/chat', methods=['POST'])
def chat():
    """
    AI 小助理對話介面
    """
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify(format_response(
                {"error": "缺少必要參數 'message'"},
                success=False
            )), 400
        
        message = data['message']
        user_id = data.get('user_id', 'anonymous')
        
        # 從知識庫獲取相關上下文
        context = rag_system.get_context_for_query(message)
        
        # 載入助手提示詞
        assistant_prompt = load_prompt('assistant_prompt.txt')
        safety_rules = load_prompt('safety_rules.txt')
        
        # 組合完整提示詞
        full_prompt = f"{assistant_prompt}\n\n安全規則：\n{safety_rules}\n\n相關知識：\n{context}"
        
        # 這裡應該調用 AI 模型，暫時返回模擬回應
        response = {
            "message": "感謝您的諮詢，我會根據您的症狀提供中醫養生建議。請注意，我的建議僅供參考，如有嚴重症狀請及時就醫。",
            "suggestions": [
                "保持規律作息",
                "注意飲食均衡",
                "適度運動鍛煉"
            ],
            "disclaimer": "本建議僅供參考，不構成醫療診斷或治療建議。"
        }
        
        return jsonify(format_response(response))
        
    except Exception as e:
        print(f"對話處理錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "處理對話時發生錯誤"},
            success=False
        )), 500

@assistant_bp.route('/analyze_symptoms', methods=['POST'])
def analyze_symptoms():
    """
    症狀分析介面
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
        
        # 使用症狀分類器分析
        analysis_result = symptom_classifier.classify_symptoms(symptoms, user_info)
        
        return jsonify(format_response(analysis_result))
        
    except Exception as e:
        print(f"症狀分析錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "分析症狀時發生錯誤"},
            success=False
        )), 500

@assistant_bp.route('/health', methods=['GET'])
def health_check():
    """
    健康檢查端點
    """
    return jsonify(format_response({
        "status": "healthy",
        "service": "AI Assistant",
        "version": "1.0.0"
    }))