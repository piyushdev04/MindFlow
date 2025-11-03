import { useState } from "react";
import "./App.css";
import TodoItem from "./components/TodoItem";

export default function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (task.trim() === "") return;
    setTasks([...tasks, { text: task, completed: false }]);
    setTask("");
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const toggleTask = (index) => {
    setTasks(
      tasks.map((t, i) =>
        i === index ? { ...t, completed: !t.completed } : t
      )
    );
  };

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
          <button onClick={addTask}>Add</button>
        </div>

        <ul className="task-list">
          {tasks.map((t, i) => (
            <TodoItem
              key={i}
              text={t.text}
              completed={t.completed}
              onToggle={() => toggleTask(i)}
              onDelete={() => deleteTask(i)}
            />
          ))}
        </ul>
      </div>
    </>
  );
}