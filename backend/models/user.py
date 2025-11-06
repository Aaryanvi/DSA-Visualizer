from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from backend.utils.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)

    notebooks = relationship("Notebook", back_populates="user")
