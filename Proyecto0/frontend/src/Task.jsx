import React, { useState } from 'react';

const Task = ({ task, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState(task);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        onUpdate(editedTask);
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedTask({ ...editedTask, [name]: value });
    };

    return (
        <div className="task">
            {isEditing ? (
                <>
                    <input
                        type="text"
                        name="texto_tarea"
                        value={editedTask.texto_tarea}
                        onChange={handleChange}
                    />
                    <input
                        type="date"
                        name="fecha_tentativa_finalizacion"
                        value={editedTask.fecha_tentativa_finalizacion}
                        onChange={handleChange}
                    />
                    <select
                        name="estado"
                        value={editedTask.estado}
                        onChange={handleChange}
                    >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <button onClick={handleSave}>Save</button>
                </>
            ) : (
                <>
                    <h3>{task.texto_tarea}</h3>
                    <p>Fecha de Creación: {task.fecha_creacion}</p>
                    <p>Fecha Tentativa de Finalización: {task.fecha_tentativa_finalizacion}</p>
                    <p>Estado: {task.estado}</p>
                    <p>ID Usuario: {task.id_usuario}</p>
                    <p>ID Categoría: {task.id_categoria}</p>
                    <button onClick={handleEdit}>Edit</button>
                </>
            )}
            <button onClick={() => onDelete(task.id)}>Delete</button>
        </div>
    );
};

export default Task;
