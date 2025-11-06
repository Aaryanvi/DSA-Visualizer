from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from datetime import timedelta
from backend.utils.db import SessionLocal
from backend.models.user import User

auth_bp = Blueprint("auth", __name__)

# -----------------------------
# REGISTER
# -----------------------------
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    # Allow registration with either 'username' or 'email' field
    username = data.get("username") or data.get("email")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    db = SessionLocal()
    existing = db.query(User).filter(User.username == username).first()
    if existing:
        db.close()
        return jsonify({"error": "User already exists"}), 400

    new_user = User(username=username, password=password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    db.close()

    return jsonify({"message": "User registered successfully"}), 201


# -----------------------------
# LOGIN
# -----------------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    # ✅ Accept both 'email' and 'username'
    username = data.get("username") or data.get("email")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    db = SessionLocal()
    user = db.query(User).filter(User.username == username, User.password == password).first()
    db.close()

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    # Create JWT valid for 2 hours
    access_token = create_access_token(identity=user.id, expires_delta=timedelta(hours=2))

    return jsonify({
        "token": access_token,
        "username": user.username,
        "message": "Login successful"
    }), 200


# -----------------------------
# PROTECTED ROUTE (for testing)
# -----------------------------
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    db = SessionLocal()
    user = db.query(User).filter(User.id == user_id).first()
    db.close()

    return jsonify({"id": user.id, "username": user.username}), 200
