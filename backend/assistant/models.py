"""
AI 小助理相關的資料模型
可選擇性使用，用於儲存對話記錄等
"""

from dataclasses import dataclass
from datetime import datetime
from typing import List, Dict, Any, Optional

@dataclass
class ChatMessage:
    """對話訊息模型"""
    user_id: str
    message: str
    response: str
    timestamp: datetime
    session_id: Optional[str] = None
    
@dataclass
class UserSession:
    """用戶會話模型"""
    session_id: str
    user_id: str
    start_time: datetime
    last_activity: datetime
    messages: List[ChatMessage]
    
class ChatHistory:
    """對話歷史管理"""
    
    def __init__(self):
        self.sessions: Dict[str, UserSession] = {}
    
    def create_session(self, user_id: str) -> str:
        """創建新的會話"""
        import uuid
        session_id = str(uuid.uuid4())
        
        session = UserSession(
            session_id=session_id,
            user_id=user_id,
            start_time=datetime.now(),
            last_activity=datetime.now(),
            messages=[]
        )
        
        self.sessions[session_id] = session
        return session_id
    
    def add_message(self, session_id: str, message: str, response: str) -> bool:
        """新增訊息到會話"""
        if session_id not in self.sessions:
            return False
        
        session = self.sessions[session_id]
        chat_message = ChatMessage(
            user_id=session.user_id,
            message=message,
            response=response,
            timestamp=datetime.now(),
            session_id=session_id
        )
        
        session.messages.append(chat_message)
        session.last_activity = datetime.now()
        return True
    
    def get_session_history(self, session_id: str) -> List[ChatMessage]:
        """獲取會話歷史"""
        if session_id not in self.sessions:
            return []
        
        return self.sessions[session_id].messages
    
    def cleanup_old_sessions(self, hours: int = 24):
        """清理舊會話"""
        from datetime import timedelta
        cutoff_time = datetime.now() - timedelta(hours=hours)
        
        sessions_to_remove = [
            session_id for session_id, session in self.sessions.items()
            if session.last_activity < cutoff_time
        ]
        
        for session_id in sessions_to_remove:
            del self.sessions[session_id]

# 全局會話管理器
chat_history = ChatHistory()