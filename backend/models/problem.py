from sqlalchemy import Column, Integer, String
from backend.utils.db import Base

class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)  # Easy, Medium, Hard
    category = Column(String, nullable=False)  # Array, Tree, etc.
