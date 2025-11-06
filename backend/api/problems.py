from flask import Blueprint, request, jsonify
from backend.utils.db import SessionLocal
from backend.models.problem import Problem

problems_bp = Blueprint("problems", __name__)

# GET all problems
@problems_bp.route("/", methods=["GET"])
def get_problems():
    db = SessionLocal()
    problems = db.query(Problem).all()
    db.close()
    return jsonify([
        {
            "id": p.id,
            "title": p.title,
            "description": p.description,
            "difficulty": p.difficulty,
            "category": p.category,
        } for p in problems
    ])

# GET single problem
@problems_bp.route("/<int:problem_id>", methods=["GET"])
def get_problem(problem_id):
    db = SessionLocal()
    problem = db.query(Problem).filter(Problem.id == problem_id).first()
    db.close()
    if problem:
        return jsonify({
            "id": problem.id,
            "title": problem.title,
            "description": problem.description,
            "difficulty": problem.difficulty,
            "category": problem.category,
        })
    return jsonify({"error": "Problem not found"}), 404

# POST create a new problem
@problems_bp.route("/", methods=["POST"])
def create_problem():
    data = request.get_json()
    db = SessionLocal()
    new_problem = Problem(
        title=data.get("title"),
        description=data.get("description"),
        difficulty=data.get("difficulty"),
        category=data.get("category"),
    )
    db.add(new_problem)
    db.commit()
    db.refresh(new_problem)
    db.close()
    return jsonify({
        "message": "Problem created successfully",
        "problem": {
            "id": new_problem.id,
            "title": new_problem.title,
            "description": new_problem.description,
            "difficulty": new_problem.difficulty,
            "category": new_problem.category,
        }
    }), 201
