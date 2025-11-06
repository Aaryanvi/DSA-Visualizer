import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/register";
import Dashboard from "./pages/Dashboard";
import Practice from "./pages/Practice";
import NotebookPage from "./pages/NotebookPage";
import Home from "./pages/Home";
import Visualize from "./pages/Visualize";
import SolveProblem from "./components/SolveProblem";
function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Practice" element={<Practice />} />
        <Route path="/notebooks" element={<NotebookPage />} />
        <Route path="/Visualize" element={<Visualize />} />
        <Route path="/solve/:id" element={<SolveProblem />} />
      </Routes>
  );
}

export default App;
