from flask import Blueprint, request, jsonify
import subprocess
import tempfile
import os

code_exec_bp = Blueprint("code_exec", __name__)

@code_exec_bp.route("/", methods=["POST"])
def execute_code():
    try:
        data = request.get_json()
        language = data.get("language")
        code = data.get("code")

        if not language or not code:
            return jsonify({"error": "Language and code are required"}), 400

        # Create temp file based on language
        if language == "python":
            suffix = ".py"
            command = ["python3"]
        elif language == "c":
            suffix = ".c"
            command = ["gcc", "-o", "main", "temp.c"]
        elif language == "cpp":
            suffix = ".cpp"
            command = ["g++", "-o", "main", "temp.cpp"]
        else:
            return jsonify({"error": f"Language '{language}' not supported"}), 400

        with tempfile.TemporaryDirectory() as tmpdir:
            filepath = os.path.join(tmpdir, f"temp{suffix}")
            with open(filepath, "w") as f:
                f.write(code)

            # Python direct run
            if language == "python":
                result = subprocess.run(
                    ["python3", filepath],
                    capture_output=True, text=True, timeout=5
                )
            else:
                # Compile
                compile_proc = subprocess.run(
                    command, cwd=tmpdir, capture_output=True, text=True, timeout=5
                )
                if compile_proc.returncode != 0:
                    return jsonify({"error": compile_proc.stderr}), 400

                # Execute compiled program
                exec_proc = subprocess.run(
                    ["./main"], cwd=tmpdir, capture_output=True, text=True, timeout=5
                )
                result = exec_proc

            return jsonify({
                "output": result.stdout,
                "error": result.stderr
            })

    except subprocess.TimeoutExpired:
        return jsonify({"error": "⏱️ Execution timed out"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
