import { useState, useEffect } from "react";
import "./App.css";
import TodoItem from "./components/TodoItem";
import { AnimatePresence } from "framer-motion";
import { AiOutlinePlus } from "react-icons/ai"

export default function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loaded, setLoaded] = useState(false); 

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

  const [filter, setFilter] = useState("all");

  const filteredTasks = tasks
    .map((t, originalIndex) => ({ ...t, originalIndex }))
    .filter(t => {
        if (filter === "all") return true;
        if (filter === "active") return !t.completed;
        if (filter === "completed") return t.completed;
  });

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

      <div className="filter-tabs flex gap-4 justify-center my-4">
        <button
          className={`tab-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          🔴 All
        </button>

        <button
          className={`tab-btn ${filter === "active" ? "active" :  ""}`}
          onClick={() => setFilter("active")}
        >
          🟡 Active
        </button>

        <button
          className={`tab-btn ${filter === "completed" ? "active" : ""}`}
          onClick={() => setFilter("completed")}
        >
          🟢 Completed
        </button>
      </div>

      <div className="input-section">
        <input
          type="text"
          placeholder="Add a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
        />

        <button className="icon-btn" onClick={addTask}>
          <AiOutlinePlus size={20} />
        </button>
      </div>

      <ul className="task-list max-h-[300px] overflow-y-auto pr-2">
        <AnimatePresence>
          {filteredTasks.map((t) => (
            <TodoItem
              key={t.originalIndex}
              text={t.text}
              completed={t.completed}
              onToggle={() => toggleTask(t.originalIndex)}
              onDelete={() => deleteTask(t.originalIndex)}
              onEdit={() => startEdit(t.originalIndex, t.text)}
              editing={editingIndex === t.originalIndex}
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