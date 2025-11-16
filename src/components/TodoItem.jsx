import { motion } from "framer-motion";

export default function TodoItem({ text, completed, onToggle, onDelete }) {
    return (
        <motion.li 
            className={`todo-item ${completed ? "completed" : ""}`}
            onClick={onToggle}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
        >
            <span>{text}</span>
            <button 
                className="delete-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
            >
                ✖
            </button>
        </motion.li>
    );
}