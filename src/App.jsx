import { useState, useEffect } from "react";
import "./App.css";
import TodoItem from "./components/TodoItem";
import { AnimatePresence } from "framer-motion";
import { AiOutlinePlus } from "react-icons/ai"

export default function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loaded, setLoaded] = useState(false); 

  // Load tasks from localStorage once
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setTasks(parsed);
      } catch (err) {
        console.error("Error parsing saved tasks:", err);
      }
    }
    setLoaded(true);
  }, []);

  // Save only after loaded
  useEffect(() => {
    if (loaded) {
      console.log("Saving tasks:", tasks);
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, loaded]);

  const addTask = () => {
    if (!task.trim()) return;
    const newTask = { text: task, completed: false };
    console.log("Adding task:", newTask);
    setTasks((prev) => [...prev, newTask]);
    setTask("");
  };

  const deleteTask = (index) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleTask = (index) => {
    setTasks((prev) =>
      prev.map((t, i) =>
        i === index ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");
  
  const startEdit = (index, text) => {
    setEditingIndex(index);
    setEditText(text);
  };

  const saveEdit = () => {
    if (!editText.trim()) return;
    setTasks(prev =>
      prev.map((t, i) => 
        i === editingIndex ? { ...t, text: editText } : t
      )
    );
    setEditingIndex(null);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditText("");
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle("light");
    document.documentElement.classList.toggle("dark");
  };

return (
  <div className="min-h-screen w-full flex flex-col">
    
    <button
      onClick={toggleTheme}
      className="theme-toggle appearance-none fixed top-6 right-6 w-6 h-6 p-0 rounded-full border border-gray-400 hover:border-[#0099ff] bg-transparent transition"
    ></button>

    <header className="global-header">
      <img src="/logo.svg" alt="MindFlow Logo" className="logo" />
      <span className="brand-name">MindFlow</span>
    </header>

    <div className="app-container w-full max-w-3xl mx-auto px-6 mt-10">
      <h1 className="title">do it now!</h1>
    
      <div className="input-section">
        <input
          type="text"
          placeholder="Add a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button className="icon-btn" onClick={addTask}>
          <AiOutlinePlus size={20} />
        </button>
      </div>

      <ul className="task-list max-h-[300px] overflow-y-auto pr-2">
        <AnimatePresence>
          {tasks.map((t, i) => (
            <TodoItem
              key={t.text + i}
              text={t.text}
              completed={t.completed}
              onToggle={() => toggleTask(i)}
              onDelete={() => deleteTask(i)}
              onEdit={() => startEdit(i, t.text)}
              editing={editingIndex === i}
              editText={editText}
              setEditText={setEditText}
              saveEdit={saveEdit}
              cancelEdit={cancelEdit}
            />
          ))}
        </AnimatePresence>
      </ul>

      <p className="task-counter">
        {completedCount} of {totalCount} tasks completed
      </p>

      <button className="clear-btn" onClick={clearCompleted}>
        Clear Completed
      </button>
    </div>

  </div>
);
}