import { motion } from "framer-motion";
import { AiOutlineDelete, AiOutlineCheck } from "react-icons/ai";

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
            <div className="left-section">
                {completed ? (
                    <AiOutlineCheck className="check-icon" size={20} />
                ) : (
                    <div className="circle"></div>
                )}
                <span>{text}</span>
            </div>
            <button 
                className="delete-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
            >
                <AiOutlineDelete size={20}/>
            </button>
        </motion.li>
    );
}