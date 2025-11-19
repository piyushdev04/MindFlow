import { motion } from "framer-motion";
import { AiOutlineDelete, AiOutlineCheck } from "react-icons/ai";
import { LuPen } from "react-icons/lu";

export default function TodoItem({
    text,
    completed,
    onToggle,
    onDelete,
    onEdit,
    editing,
    editText,
    setEditText,
    saveEdit,
    cancelEdit,
}) {
    return (
        <motion.li
            className="todo-item flex items-center justify-between py-2 w-full"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
        >
            {editing ? (
                <input
                    className="border rounded px-2 py-1 text-sm flex-1 mr-3 min-w-0"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit();
                        if (e.key === "Escape") cancelEdit();
                    }}
                    autoFocus
                />
            ) : (
                <div
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0 overflow-hidden"
                    onClick={onToggle}
                >
                    {completed ? (
                        <AiOutlineCheck className="text-green-500" size={18} />
                    ) : (
                        <div className="w-4 h-4 rounded-full border flex-shrink-0"></div>
                    )}

                    <span
                        className={`text-sm truncate ${
                            completed ? "line-through opacity-50" : ""
                        }`}
                    >
                        {text}
                    </span>
                </div>
            )}

            <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                {editing ? (
                    <>
                        <button
                            onClick={saveEdit}
                            className="text-green-600 hover:opacity-70 text-sm"
                        >
                            ✓
                        </button>
                        <button
                            onClick={cancelEdit}
                            className="text-red-500 hover:opacity-70 text-sm"
                        >
                            ✕
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit();
                            }}
                            className="text-gray-500 hover:text-blue-500 transition-colors"

                        >
                            <LuPen size={16} />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                            className="text-gray-500 hover:text-red-500"
                        >
                            <AiOutlineDelete size={18} />
                        </button>
                    </>
                )}
            </div>
        </motion.li>
    );
}
