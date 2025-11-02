import { useState } from "react";
import "./App.css";
import TodoItem from "./components/TodoItem";

export default function App() {
    const [task, setTask] = useState("");
    const [tasks, setTasks] = useState([]);

    const addTask = () => {
        if (task.trim() === "") return;
        setTasks([...tasks, task]);
        setTask("");
    };

    const deleteTask = (index) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <img src="/logo.svg" alt="MindFlow Logo" className="logo" />
                <h1 className="brand-name">MindFlow</h1>
            </header>

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
                    <TodoItem key={i} text={t} onDelete={() => deleteTask(i)} />
                ))}
            </ul>
        </div>
    );
}