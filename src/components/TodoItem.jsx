export default function TodoItem({ text, completed, onToggle, onDelete }) {
    return (
        <li 
            className={`todo-item ${completed ? "completed" : ""}`}
            onClick={onToggle}
        >
            <span>{text}</span>
            <button 
                className="delete-btn"
                onClick={(e) => {
                    e.stopPropagation(); // prevent toggling when delete is clicked
                    onDelete();
                }}
            >
                ✖
            </button>
        </li>
    );
}