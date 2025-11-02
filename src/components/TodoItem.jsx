export default function TodoItem({ text, onDelete }) {
    return (
        <li className="todo-item">
            <span>{text}</span>
            <button onClick={onDelete}>✖</button>
        </li>
    );
}