from backend.models.user import User
from backend.utils.db import SessionLocal

db = SessionLocal()

def create_user(username, password):
    user = User(username=username, password=password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user_by_username(username):
    return db.query(User).filter(User.username == username).first()
