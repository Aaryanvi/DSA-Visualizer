import React, { useState } from "react";
import axios from "axios";
import "./codeEditor.css";

export default function CodeEditor({ problem }) {
  const [code, setCode] = useState("// Write your code here");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running your code...");

    try {
      const res = await axios.post("http://localhost:5000/api/run_code", {
        code,
        language: "python", // later you can add dropdown for C++, JS, etc.
      });
      setOutput(res.data.output);
    } catch (err) {
      setOutput("❌ Error while running code. Check backend connection.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="editor-wrapper">
      <textarea
        className="code-editor"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      ></textarea>

      <div className="editor-buttons">
        <button onClick={runCode} disabled={isRunning}>
          {isRunning ? "Running..." : "Run Code"}
        </button>
      </div>

      <div className="output-box">
        <h4>Output:</h4>
        <pre>{output}</pre>
      </div>
    </div>
  );
}
