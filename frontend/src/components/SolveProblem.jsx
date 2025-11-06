import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import "./SolveProblem.css";

export default function SolveProblem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(`# Write your ${language} solution here\n`);
  const [output, setOutput] = useState("");
  const [saveMsg, setSaveMsg] = useState("");

  // ✅ Expanded Problem Database
  const problems = {
    1: {
      title: "Two Sum",
      description:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      exampleInput: "nums = [2,7,11,15], target = 9",
      exampleOutput: "[0,1]",
    },
    2: {
      title: "Reverse Linked List",
      description: "Reverse a singly linked list and return the reversed list.",
      exampleInput: "1 -> 2 -> 3 -> 4 -> 5",
      exampleOutput: "5 -> 4 -> 3 -> 2 -> 1",
    },
    3: {
      title: "Binary Tree Inorder Traversal",
      description:
        "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
      exampleInput: "Input: [1,null,2,3]",
      // NOTE: store expected output in consistent simple form
      exampleOutput: "[1,3,2]",
    },
    4: {
      title: "LRU Cache",
      description:
        "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
      exampleInput:
        "Input: LRUCache cache = new LRUCache(2); cache.put(1,1); cache.put(2,2); cache.get(1);",
      exampleOutput: "1, -1, 3",
    },
    5: {
      title: "Merge Intervals",
      description:
        "Given an array of intervals, merge all overlapping intervals and return an array of the non-overlapping intervals.",
      exampleInput: "Input: [[1,3],[2,6],[8,10],[15,18]]",
      exampleOutput: "[[1,6],[8,10],[15,18]]",
    },
  };

  const problem = problems[id];
  if (!problem) {
    return (
      <div className="solve-page">
        <button className="back-btn" onClick={() => navigate("/practice")}>
          ← Back
        </button>
        <h2>❌ Problem not found!</h2>
      </div>
    );
  }

  // Helper: normalize raw output string for comparison
  const normalize = (s) => {
    if (s === null || s === undefined) return "";
    let str = String(s);

    // Remove common human labels like "Output:", "Expected:", "Result:"
    str = str.replace(/\b(Output|Expected|Result)\s*:\s*/gi, "");

    // Remove leading/trailing whitespace and collapse multiple spaces/newlines into single space
    str = str.trim().replace(/\s+/g, " ");

    return str;
  };

  // Helper: try JSON parse (useful for arrays/objects), otherwise return null
  const tryJSON = (s) => {
    try {
      // Replace single quotes with double quotes if it looks like python-style repr
      const candidate = s.replace(/'/g, '"');
      return JSON.parse(candidate);
    } catch (e) {
      return null;
    }
  };

  // Deep compare two parsed structures (arrays/objects/numbers/strings)
  const deepEqual = (a, b) => {
    // simple equality
    if (a === b) return true;
    // both arrays
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!deepEqual(a[i], b[i])) return false;
      }
      return true;
    }
    // both objects
    if (
      a &&
      b &&
      typeof a === "object" &&
      typeof b === "object" &&
      !Array.isArray(a) &&
      !Array.isArray(b)
    ) {
      const ka = Object.keys(a).sort();
      const kb = Object.keys(b).sort();
      if (ka.length !== kb.length) return false;
      for (let k of ka) {
        if (!deepEqual(a[k], b[k])) return false;
      }
      return true;
    }
    // fallback
    return false;
  };

  // Run code via backend (/exec)
  const runBackendCode = async () => {
    setOutput("⏳ Running your code...");
    try {
      const res = await fetch("http://localhost:5000/api/exec/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
      });

      const data = await res.json();
      if (data.error) {
        setOutput("❌ Error:\n" + data.error);
        return { ok: false, output: null, error: data.error };
      } else if (data.output) {
        setOutput("✅ Output:\n" + data.output);
        return { ok: true, output: data.output };
      } else {
        setOutput("⚙️ Code executed but no output produced.");
        return { ok: true, output: "" };
      }
    } catch (err) {
      setOutput("❌ Failed to connect to backend: " + err.message);
      return { ok: false, output: null, error: err.message };
    }
  };

  const handleRun = () => {
    setOutput("");
    runBackendCode();
  };

  // Improved submit: runs code, then compares normalized/parsed outputs
  const handleSubmit = async () => {
    setOutput("⏳ Running your code and checking correctness...");
    try {
      const execResult = await runBackendCode();
      if (!execResult.ok) return; // runBackendCode already set output with error

      const rawUserOutput = execResult.output ?? "";
      const rawExpected = problem.exampleOutput ?? "";

      // debug logs - helpful to inspect exact strings (open devtools console)
      console.log("RAW user output:", JSON.stringify(rawUserOutput));
      console.log("RAW expected output:", JSON.stringify(rawExpected));

      const userNorm = normalize(rawUserOutput);
      const expectedNorm = normalize(rawExpected);

      // Try parse both as JSON-like structures
      const userParsed = tryJSON(userNorm);
      const expectedParsed = tryJSON(expectedNorm);

      let isCorrect = false;
      if (userParsed !== null && expectedParsed !== null) {
        // Compare parsed structures deeply
        isCorrect = deepEqual(userParsed, expectedParsed);
      } else {
        // Fallback: compare normalized strings (case-sensitive)
        if (userNorm === expectedNorm) isCorrect = true;
        else {
          // Final fallback: ignore spaces, commas spacing differences (loose compare)
          const loose = (s) => s.replace(/\s+/g, "").replace(/,+/g, ",");
          if (loose(userNorm) === loose(expectedNorm)) isCorrect = true;
        }
      }

      if (isCorrect) {
        setOutput(`✅ Correct Output! 🎉\n${rawUserOutput}`);
      } else {
        // Show detailed feedback
        setOutput(
          `❌ Wrong Output!\nExpected: ${rawExpected}\nGot: ${rawUserOutput}\n\n(If you think this is wrong, check formatting, extra prints, or trailing newlines.)`
        );
      }
    } catch (err) {
      setOutput("❌ Submission error: " + err.message);
    }
  };

  // Save to Notebook (POST /notebook)
  const handleSaveToNotebook = async () => {
    setSaveMsg("💾 Saving...");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setSaveMsg("⚠️ Please log in to save your notebook!");
        return;
      }

      const res = await fetch("http://localhost:5000/api/notebook/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: problem.title,
          content: `Language: ${language}\n\n${code}`,
          code: code,
          problem_title: problem.title,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSaveMsg("✅ Saved to notebook successfully!");
        console.log("Notebook saved:", data.data);
      } else {
        setSaveMsg(
          "❌ " + (data.error || data.message || "Failed to save notebook.")
        );
        console.error("Notebook save failed:", data);
      }
    } catch (err) {
      setSaveMsg("❌ Error saving notebook: " + err.message);
      console.error("Save error:", err);
    }
  };

  return (
    <div className="solve-page">
      <div className="solve-header">
        <button className="back-btn" onClick={() => navigate("/practice")}>
          ← Back
        </button>
        <h1 className="solve-title">{problem.title}</h1>
      </div>

      <div className="solve-container">
        {/* Left: Problem Description */}
        <div className="problem-section">
          <h2>Description</h2>
          <p>{problem.description}</p>
          <div className="example-box">
            <p>
              <strong>Example Input:</strong> {problem.exampleInput}
            </p>
            <p>
              <strong>Example Output:</strong> {problem.exampleOutput}
            </p>
          </div>
        </div>

        {/* Right: Code Editor */}
        <div className="editor-section">
          <div className="editor-header">
            <h3>💻 Code Editor</h3>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setCode(`# Write your ${e.target.value} solution here\n`);
                setOutput("");
              }}
              className="lang-select"
            >
              <option value="python">Python</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
            </select>
          </div>

          <Editor
            height="60vh"
            theme="vs-dark"
            language={
              language === "python" ? "python" : language === "cpp" ? "cpp" : "c"
            }
            value={code}
            onChange={(value) => setCode(value)}
            className="code-editor"
          />

          <div className="editor-buttons">
            <button className="run-btn" onClick={handleRun}>
              ▶ Run
            </button>
            <button className="submit-btn" onClick={handleSubmit}>
              🚀 Submit
            </button>
            <button className="save-btn" onClick={handleSaveToNotebook}>
              💾 Save to Notebook
            </button>
          </div>

          {output && (
            <div className="output-box">
              <h4>🧾 Console Output:</h4>
              <pre>{output}</pre>
            </div>
          )}

          {saveMsg && (
            <div className="save-msg">
              <p>{saveMsg}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
