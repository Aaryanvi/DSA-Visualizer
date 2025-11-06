from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from backend.api.auth import auth_bp
from backend.api.notebook import notebook_bp
from backend.api.problems import problems_bp
from backend.api.code_exec import code_exec_bp
from backend.utils.db import Base, engine
from backend.models import user, problem, notebook

# Create database tables
Base.metadata.create_all(bind=engine)

app = Flask(__name__)

# ✅ Correct, complete CORS setup
CORS(
    app,
    supports_credentials=True,
    resources={r"/api/*": {"origins": "http://localhost:5173"}},
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"]
)

# ✅ Add manual after_request safety net (important!)
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    return response

# JWT config
app.config["JWT_SECRET_KEY"] = "super-secret-key"
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(notebook_bp, url_prefix="/api/notebook")
app.register_blueprint(problems_bp, url_prefix="/api/problems")
app.register_blueprint(code_exec_bp, url_prefix="/api/exec")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
