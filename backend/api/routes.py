"""
API 路由配置
整合所有模組的 API 端點
"""

from flask import Flask, Blueprint
from assistant.views import assistant_bp
from symptom_checker.views import symptom_bp
from constitution_test.views import constitution_bp
from knowledge_base.views import knowledge_bp
from doctors.views import doctors_bp

def create_app():
    """創建 Flask 應用程式"""
    app = Flask(__name__)
    
    # 配置設定
    app.config['SECRET_KEY'] = 'your-secret-key-here'
    app.config['DEBUG'] = True
    
    # 健康檢查端點
    @app.route('/')
    def health_check():
        return {
            "status": "healthy",
            "service": "O.M.I.H Backend",
            "version": "1.0.0",
            "message": "🏥 中醫智慧健康平台後端運行正常"
        }
    
    # 註冊藍圖
    app.register_blueprint(assistant_bp, url_prefix='/api/assistant')
    app.register_blueprint(symptom_bp, url_prefix='/api/symptoms')
    app.register_blueprint(constitution_bp, url_prefix='/api/constitution')
    app.register_blueprint(knowledge_bp, url_prefix='/api/knowledge')
    app.register_blueprint(doctors_bp, url_prefix='/api/doctors')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)