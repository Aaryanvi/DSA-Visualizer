import React, { useState } from "react";
import "./visualize.css";

export default function Visualize() {
  const [nodes, setNodes] = useState([]);
  const [dataStructure, setDataStructure] = useState("linkedlist");
  const [listType, setListType] = useState("singly");
  const [position, setPosition] = useState("");
  const [value, setValue] = useState("");
  const [pseudocode, setPseudocode] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(null);

  const pseudocodeSnippets = {
    insert: [
      "1. Create a new node",
      "2. If list is empty → new node becomes head",
      "3. Traverse to (pos - 1)",
      "4. Point newNode.next → current.next",
      "5. current.next → newNode",
    ],
    delete: [
      "1. If list is empty → return",
      "2. Traverse to (pos - 1)",
      "3. temp = current.next",
      "4. current.next = temp.next",
      "5. Free temp node",
    ],
    stackPush: ["1. Create a new node", "2. newNode.next → top", "3. top → newNode"],
    stackPop: ["1. If stack empty → return", "2. temp = top", "3. top = top.next", "4. Free temp node"],
    queueEnqueue: [
      "1. Create a new node",
      "2. If queue empty → front = rear = newNode",
      "3. rear.next → newNode",
      "4. rear → newNode",
    ],
    queueDequeue: ["1. If queue empty → return", "2. temp = front", "3. front → front.next", "4. Free temp node"],
  };

  // ---------- INSERT ----------
  const handleInsert = () => {
    if (!value) return;
    const newNode = { id: Date.now(), value };
    let newNodes = [...nodes];

    if (dataStructure === "linkedlist") {
      let pos = parseInt(position);
      if (isNaN(pos) || pos < 0 || pos > newNodes.length) pos = newNodes.length;
      newNodes.splice(pos, 0, newNode);
      setPseudocode(pseudocodeSnippets.insert);
      setHighlightIndex(pos);
    } else if (dataStructure === "stack") {
      newNodes.unshift(newNode);
      setPseudocode(pseudocodeSnippets.stackPush);
      setHighlightIndex(0);
    } else if (dataStructure === "queue") {
      newNodes.push(newNode);
      setPseudocode(pseudocodeSnippets.queueEnqueue);
      setHighlightIndex(newNodes.length - 1);
    }

    setNodes(newNodes);
    setTimeout(() => setHighlightIndex(null), 1000);
    setValue("");
    setPosition("");
  };

  // ---------- DELETE ----------
  const handleDelete = () => {
    if (nodes.length === 0) return;
    let newNodes = [...nodes];
    let index = 0;

    if (dataStructure === "linkedlist") {
      let pos = parseInt(position);
      if (isNaN(pos) || pos < 0 || pos >= newNodes.length) pos = newNodes.length - 1;
      newNodes.splice(pos, 1);
      index = pos;
      setPseudocode(pseudocodeSnippets.delete);
    } else if (dataStructure === "stack") {
      newNodes.shift();
      index = 0;
      setPseudocode(pseudocodeSnippets.stackPop);
    } else if (dataStructure === "queue") {
      newNodes.shift();
      index = 0;
      setPseudocode(pseudocodeSnippets.queueDequeue);
    }

    setNodes(newNodes);
    setHighlightIndex(index);
    setTimeout(() => setHighlightIndex(null), 1000);
    setPosition("");
  };

  // ---------- RESET ----------
  const handleReset = () => {
    setNodes([]);
    setPseudocode([]);
    setHighlightIndex(null);
  };

  return (
    <div className="visualize-container">
      <h1 className="title">🔗 Data Structure Visualization</h1>

      <div className="controls">
        <select value={dataStructure} onChange={(e) => setDataStructure(e.target.value)}>
          <option value="linkedlist">Linked List</option>
          <option value="stack">Stack</option>
          <option value="queue">Queue</option>
        </select>

        {dataStructure === "linkedlist" && (
          <select value={listType} onChange={(e) => setListType(e.target.value)}>
            <option value="singly">Singly</option>
            <option value="doubly">Doubly</option>
            <option value="circular">Circular</option>
          </select>
        )}

        {(dataStructure === "linkedlist" || dataStructure === "queue") && (
          <input
            type="number"
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        )}

        <input
          type="number"
          placeholder="Node Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <button onClick={handleInsert}>Insert</button>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={handleReset}>Reset</button>
      </div>

      <div className="pseudocode-panel">
        <h3>Pseudocode</h3>
        <pre>
          {pseudocode.map((line, i) => (
            <div
              key={i}
              className={`code-line ${
                highlightIndex !== null && i === (highlightIndex % pseudocode.length)
                  ? "highlight-line"
                  : ""
              }`}
            >
              {line}
            </div>
          ))}
        </pre>
      </div>

      {/* Visualization */}
      <div
        className={`list-area ${
          dataStructure === "stack"
            ? "stack"
            : dataStructure === "queue"
            ? "queue"
            : ""
        }`}
      >
        {dataStructure === "stack" && nodes.length > 0 && (
          <div className="pointer top-pointer">
            ↑<br />TOP
          </div>
        )}

        {dataStructure === "queue" && nodes.length > 0 && (
          <>
            <div className="pointer front-pointer">
              FRONT<br />↓
            </div>
            <div className="pointer rear-pointer">
              REAR<br />↓
            </div>
          </>
        )}

        {nodes.map((node, index) => (
          <React.Fragment key={node.id}>
            <div className={`node ${highlightIndex === index ? "highlight" : ""}`}>
              {node.value}
            </div>
            {index < nodes.length - 1 && dataStructure === "linkedlist" && (
              <span className="arrow">→</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
