import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // ✅ NEW — for navigation
import "./practice.css";

export default function Practice() {
  const [problems, setProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  const navigate = useNavigate(); // ✅ initialize navigation hook

  useEffect(() => {
    // Later, replace this with API call to backend `/problems`
    setProblems([
      { id: 1, title: "Two Sum", difficulty: "Easy", status: "Solved" },
      { id: 2, title: "Reverse Linked List", difficulty: "Medium", status: "Unsolved" },
      { id: 3, title: "Binary Tree Inorder Traversal", difficulty: "Easy", status: "Solved" },
      { id: 4, title: "LRU Cache", difficulty: "Hard", status: "Unsolved" },
      { id: 5, title: "Merge Intervals", difficulty: "Medium", status: "Unsolved" },
    ]);
  }, []);

  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All" || p.difficulty === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="practice-page">
      <div className="practice-header">
        <h1>Practice Problems</h1>
        <p>Sharpen your skills with real DSA challenges</p>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search problems..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <table className="problem-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Difficulty</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProblems.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.title}</td>
              <td className={`difficulty ${p.difficulty.toLowerCase()}`}>{p.difficulty}</td>
              <td className={`status ${p.status.toLowerCase()}`}>{p.status}</td>
              <td>
                {/* ✅ Replace Link with onClick navigation */}
                <button
                  className="solve-btn"
                  onClick={() => navigate(`/solve/${p.id}`)}
                >
                  Solve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
