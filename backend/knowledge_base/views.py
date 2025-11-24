"""
知識庫 API 視圖
"""

from flask import Blueprint, request, jsonify
from .models import KnowledgeBase
from .loader import KnowledgeLoader
from ai.utils import format_response
from ai.rag import RAGSystem

knowledge_bp = Blueprint('knowledge', __name__)
kb = KnowledgeBase()
loader = KnowledgeLoader()
rag_system = RAGSystem()

@knowledge_bp.route('/search', methods=['POST'])
def search_knowledge():
    """搜尋知識庫"""
    try:
        data = request.get_json()
        
        if not data or 'query' not in data:
            return jsonify(format_response(
                {"error": "缺少必要參數 'query'"},
                success=False
            )), 400
        
        query = data['query']
        category = data.get('category', '')
        limit = data.get('limit', 10)
        
        results = rag_system.search(query, top_k=limit)
        
        if category:
            results = [r for r in results if r.get('category', '').lower() == category.lower()]
        
        return jsonify(format_response({
            "query": query,
            "results": results,
            "total": len(results)
        }))
        
    except Exception as e:
        print(f"知識搜尋錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "搜尋知識時發生錯誤"},
            success=False
        )), 500

@knowledge_bp.route('/categories', methods=['GET'])
def get_categories():
    """獲取知識分類"""
    try:
        categories = kb.get_categories()
        return jsonify(format_response(categories))
        
    except Exception as e:
        print(f"獲取分類錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "獲取分類時發生錯誤"},
            success=False
        )), 500

@knowledge_bp.route('/article/<article_id>', methods=['GET'])
def get_article(article_id):
    """
    獲取單篇文章
    """
    try:
        article = kb.get_article(article_id)
        
        if not article:
            return jsonify(format_response(
                {"error": "找不到文章"},
                success=False
            )), 404
        
        return jsonify(format_response(article))
        
    except Exception as e:
        print(f"獲取文章錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "獲取文章時發生錯誤"},
            success=False
        )), 500

@knowledge_bp.route('/articles', methods=['GET'])
def get_articles():
    """
    獲取文章列表
    """
    try:
        category = request.args.get('category', '')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        
        articles = kb.get_articles(category=category, page=page, per_page=per_page)
        
        return jsonify(format_response(articles))
        
    except Exception as e:
        print(f"獲取文章列表錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "獲取文章列表時發生錯誤"},
            success=False
        )), 500

@knowledge_bp.route('/add', methods=['POST'])
def add_knowledge():
    """
    新增知識條目
    """
    try:
        data = request.get_json()
        
        required_fields = ['title', 'content', 'category']
        for field in required_fields:
            if not data or field not in data:
                return jsonify(format_response(
                    {"error": f"缺少必要參數 '{field}'"},
                    success=False
                )), 400
        
        # 驗證權限（實際使用中應檢查用戶權限）
        # if not check_admin_permission(request):
        #     return jsonify(format_response(
        #         {"error": "權限不足"},
        #         success=False
        #     )), 403
        
        article_id = kb.add_article(
            title=data['title'],
            content=data['content'],
            category=data['category'],
            author=data.get('author', 'system'),
            tags=data.get('tags', [])
        )
        
        # 更新 RAG 系統
        rag_system.add_knowledge(data['title'], data['content'], data['category'])
        
        return jsonify(format_response({
            "article_id": article_id,
            "message": "知識條目新增成功"
        }))
        
    except Exception as e:
        print(f"新增知識錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "新增知識時發生錯誤"},
            success=False
        )), 500

@knowledge_bp.route('/popular', methods=['GET'])
def get_popular_articles():
    """
    獲取熱門文章
    """
    try:
        limit = int(request.args.get('limit', 10))
        popular_articles = kb.get_popular_articles(limit)
        
        return jsonify(format_response(popular_articles))
        
    except Exception as e:
        print(f"獲取熱門文章錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "獲取熱門文章時發生錯誤"},
            success=False
        )), 500

@knowledge_bp.route('/recommendations', methods=['POST'])
def get_recommendations():
    """
    根據用戶興趣推薦文章
    """
    try:
        data = request.get_json()
        
        user_interests = data.get('interests', [])
        user_history = data.get('history', [])
        limit = data.get('limit', 5)
        
        recommendations = kb.get_recommendations(
            interests=user_interests,
            history=user_history,
            limit=limit
        )
        
        return jsonify(format_response(recommendations))
        
    except Exception as e:
        print(f"獲取推薦錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "獲取推薦時發生錯誤"},
            success=False
        )), 500

@knowledge_bp.route('/statistics', methods=['GET'])
def get_statistics():
    """
    獲取知識庫統計資訊
    """
    try:
        stats = kb.get_statistics()
        return jsonify(format_response(stats))
        
    except Exception as e:
        print(f"獲取統計錯誤: {str(e)}")
        return jsonify(format_response(
            {"error": "獲取統計時發生錯誤"},
            success=False
        )), 500