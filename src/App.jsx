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

  return (
    <>
      <header className="global-header">
        <img src="/logo.svg" alt="MindFlow Logo" className="logo" />
        <span className="brand-name">MindFlow</span>
      </header>

      <div className="app-container">
        <h1 className="title">To-Do App</h1>

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

        <ul className="task-list">
          <AnimatePresence>
            {tasks.map((t, i) => (
              <TodoItem
                key={t.text + i}
                text={t.text}
                completed={t.completed}
                onToggle={() => toggleTask(i)}
                onDelete={() => deleteTask(i)}
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
    </>
  );
}