from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.orm import Session
from backend.utils.db import SessionLocal
from backend.models.notebook import Notebook

notebook_bp = Blueprint("notebook", __name__)

# -------------------------------
# GET all notebooks
# -------------------------------
@notebook_bp.route("/", methods=["GET"])
@jwt_required()
def get_notebooks():
    user_id = get_jwt_identity()
    db: Session = SessionLocal()
    notebooks = db.query(Notebook).filter(Notebook.user_id == user_id).all()
    db.close()

    return jsonify([
        {
            "id": nb.id,
            "title": nb.title,
            "content": nb.content,
            "code": nb.code,
            "problem_title": nb.problem_title,
            "created_at": nb.created_at.isoformat()
        }
        for nb in notebooks
    ]), 200


# -------------------------------
# CREATE new notebook
# -------------------------------
@notebook_bp.route("/", methods=["POST"])
@jwt_required()
def create_notebook():
    data = request.get_json()
    user_id = get_jwt_identity()

    db: Session = SessionLocal()
    new_notebook = Notebook(
        title=data.get("title"),
        content=data.get("content"),
        code=data.get("code"),
        problem_title=data.get("problem_title"),
        user_id=user_id
    )
    db.add(new_notebook)
    db.commit()
    db.refresh(new_notebook)
    db.close()

    return jsonify({
        "message": "Notebook created successfully",
        "data": {
            "id": new_notebook.id,
            "title": new_notebook.title,
            "content": new_notebook.content,
            "code": new_notebook.code,
            "problem_title": new_notebook.problem_title,
            "created_at": new_notebook.created_at.isoformat()
        }
    }), 201
