import React, { useEffect, useState } from "react";
import { getNotebooks, createNotebook } from "../services/apiClient";
import "./NoteBook.css";  

export default function NotebookPage() {
  const [notebooks, setNotebooks] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [code, setCode] = useState("");
  const [problemTitle, setProblemTitle] = useState("");
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    fetchNotebooks();
  }, []);

  const fetchNotebooks = async () => {
    try {
      const res = await getNotebooks();
      setNotebooks(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load notebooks");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createNotebook({ title, content, code, problem_title: problemTitle });
      setTitle("");
      setContent("");
      setCode("");
      setProblemTitle("");
      fetchNotebooks();
    } catch (err) {
      console.error(err);
      alert("Failed to create notebook");
    }
  };

  return (
    <div className="notebook-container">
      <div className="max-w-4xl mx-auto">
        <div className="notebook-header">
          <h2>Your Notebooks</h2>
        </div>

        {/* Notebook List */}
        <div className="space-y-4 mb-8">
          {notebooks.map((nb) => (
            <div
              key={nb.id}
              className="notebook-card"
            >
              <h3>{nb.title}</h3>
              <p>{nb.content}</p>
              <p className="created-at">Created on: {new Date(nb.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Create Notebook */}
        <div className="create-notebook">
          <h3>Create New Notebook</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <input
              type="text"
              placeholder="Notebook Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Linked Problem Title (optional)"
              value={problemTitle}
              onChange={(e) => setProblemTitle(e.target.value)}
            />
            <textarea
              placeholder="Content / Explanation"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <textarea
              placeholder="Code Snippet (optional)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows="5"
            />
            <button
              type="submit"
            >
              Save Notebook
            </button>
          </form>

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
