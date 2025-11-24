"""
O.M.I.H 後端主程式
中醫智慧健康平台後端 API
"""

from api.routes import create_app
import os

if __name__ == '__main__':
    # 設定環境變數
    os.environ.setdefault('FLASK_ENV', 'development')
    os.environ.setdefault('FLASK_DEBUG', '1')
    
    # 創建應用程式
    app = create_app()
    
    print("=" * 50)
    print("🏥 O.M.I.H 中醫智慧健康平台後端")
    print("=" * 50)
    print("📍 API 端點:")
    print("   • 健康檢查: http://localhost:5000/")
    print("   • AI 小助理: http://localhost:5000/api/assistant/")
    print("   • 症狀檢查: http://localhost:5000/api/symptoms/")
    print("   • 體質測試: http://localhost:5000/api/constitution/")
    print("   • 知識庫: http://localhost:5000/api/knowledge/")
    print("   • 醫師查詢: http://localhost:5000/api/doctors/")
    print("=" * 50)
    
    # 啟動應用程式
    try:
        app.run(
            host='0.0.0.0',
            port=5000,
            debug=True,
            use_reloader=True
        )
    except KeyboardInterrupt:
        print("\n👋 服務已停止")
    except Exception as e:
        print(f"❌ 啟動錯誤: {str(e)}")