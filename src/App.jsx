import { useState, useEffect } from "react";
import "./App.css";
import TodoItem from "./components/TodoItem";
import { AnimatePresence } from "framer-motion";
import { AiOutlinePlus } from "react-icons/ai"

import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { 
  SortableContext, 
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

export default function App() {
  const [task, setTask] = useState("");
  
  const [tasks, setTasks] = useState([]);
  const [loaded, setLoaded] = useState(false); 
  
  const [activeId, setActiveId] = useState(null); 

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
            const tasksWithIds = parsed.map(t => t.id ? t : ({...t, id: generateId()}));
            setTasks(tasksWithIds);
        }
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
    const newTask = { id: generateId(), text: task, completed: false };
    setTasks((prev) => [...prev, newTask]);
    setTask("");
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  
  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (!editText.trim()) return;
    setTasks(prev =>
      prev.map((t) => 
        t.id === editingId ? { ...t, text: editText } : t
      )
    );
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle("light");
    document.documentElement.classList.toggle("dark");
  };

  const [filter, setFilter] = useState("all");

  const filteredTasks = tasks
    .filter(t => {
        if (filter === "all") return true;
        if (filter === "active") return !t.completed;
        if (filter === "completed") return t.completed;
        return true;
    });

  const filteredTaskIds = filteredTasks.map(t => t.id);
  
  const activeTask = tasks.find(t => t.id === activeId);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event) {
    const {active, over} = event;

    if (active.id !== over.id) {
      setTasks((tasks) => {
        const oldIndex = tasks.findIndex(t => t.id === active.id);
        const newIndex = tasks.findIndex(t => t.id === over.id);
        return arrayMove(tasks, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  }


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
          className={`tab-btn ${filter === "active" ? "active" : ""}`}
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
        
        <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter} 
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
          <SortableContext 
              items={filteredTaskIds} 
              strategy={verticalListSortingStrategy}
          >
            <AnimatePresence>
              {filteredTasks.map((t) => (
                <TodoItem
                  key={t.id} 
                  id={t.id} 
                  text={t.text}
                  completed={t.completed}
                  onToggle={() => toggleTask(t.id)}
                  onDelete={() => deleteTask(t.id)}
                  onEdit={() => startEdit(t.id, t.text)}
                  editing={editingId === t.id}
                  editText={editText}
                  setEditText={setEditText}
                  saveEdit={saveEdit}
                  cancelEdit={cancelEdit}
                />
              ))}
            </AnimatePresence>
          </SortableContext>
        
        <DragOverlay>
        {activeTask ? (
            <TodoItem 
                id={activeTask.id}
                text={activeTask.text}
                completed={activeTask.completed}
                style={{ 
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    transform: 'rotate(0.5deg)',
                    opacity: 0.95,
                    backgroundColor: document.documentElement.classList.contains("light") ? '#ffffff' : '#101010',
                    color: document.documentElement.classList.contains("light") ? '#333' : '#e0e0e0',
                    border: '1px solid ' + (document.documentElement.classList.contains("light") ? '#e5e5e5' : '#222222')
                }}
            />
        ) : null}
    </DragOverlay>

      </DndContext>
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