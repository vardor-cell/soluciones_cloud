import React, { useEffect, useState, useContext } from 'react';
import Task from './Task';
import axiosInstance from './axiosConfig'
import { GlobalContext } from './GlobalContext';
import { useNavigate} from 'react-router-dom'

const TaskList = () => {

    const {token,idUser} = useContext(GlobalContext);
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [reRender, setRerender] = useState(false);

    const navigate = useNavigate();

    const [newTask, setNewTask] = useState({
        texto_tarea: '',
        fecha_creacion: '',
        fecha_tentativa_finalizacion: '',
        estado: 'Pending',
        id_usuario: '',
        id_categoria: ''
    });

    useEffect(() => {
        // This function will run when the component mounts

        const fetchData = async () => {
            try {
                
                const response = await axiosInstance.get(`/usuarios/${idUser}/tareas`, {headers : { 'Authorization': token}});
                setTasks(response.data);

                const response1 = await axiosInstance.get(`/categorias`, {headers : { 'Authorization': token}});
                setCategories(response1.data);
                
                console.log("CATEGORIAS");
                console.log(response1.data);

            } catch (error) {
                console.error('Error fetching data:', error);
                if(error.response.status == 401){
                    navigate("/");
                }
            }
        };
        
        fetchData();

    }, [reRender]); // The empty array means this effect runs only once (on mount)

    const updateTask = async (updatedTask) => {

        try {   
            
            const response = await axiosInstance.put(`/tareas/${updatedTask.id}`, 
                {
                    texto_tarea: updatedTask.texto_tarea,
                    estado :  updatedTask.estado
                }
                ,
            {
                headers: {
                    Authorization: token
                }
            }
            );

            if (response.status == 200){ 
                setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
            }
        }
        catch (error) {

            console.error('Error updating data:', error);
            if(error.response.status == 401){
                navigate("/");
            }
        
        }
    };

    const deleteTask = async (id) => {

        try {   
            
            const response = await axiosInstance.delete(`/tareas/${id}`, 

            {
                headers: {
                    Authorization: token
                }
            }
            );

            if (response.status == 200){ 
                setTasks(tasks.filter(task => task.id !== id));
            }
        }
        catch (error) {

            console.error('Error deleting data:', error);
            if(error.response.status == 401){
                navigate("/");
            }
        
        }

        
    };

    const addTask = async () => {

        const filteredCategories = categories.find(category => category.nombre === newTask.categoria);

        console.log(categories);
        console.log(newTask.categoria);
        console.log(filteredCategories);

        if (newTask.texto_tarea.trim()) {
            
        try {   
            
            const response = await axiosInstance.post(`/tareas`, 

                { ...newTask, id_categoria: filteredCategories.id, fecha_creacion: new Date().toISOString().split('T')[0] }
                ,
            {
                headers: {
                    Authorization: token
                }
            }
            );

            if (response.status == 200){ 
                setNewTask({
                    texto_tarea: '',
                    fecha_creacion: '',
                    fecha_tentativa_finalizacion: '',
                    estado: 'Pending',
                    id_usuario: '',
                    id_categoria: ''
                });

                reRender === false ? setRerender(true) :setRerender(false);
            }
        }
        catch (error) {

            console.error('Error creating data:', error);
            if(error.response.status == 401){
                navigate("/");
            }
        }
    };
    }

    const handleChange = (e) => {
        const { name, value, id} = e.target;

        setNewTask({ ...newTask, [name]: value, ["id_usuario"]: idUser});

            
    };

    return (
        <div className="task-list">
            <div className="new-task">
                <input
                    type="text"
                    name="texto_tarea"
                    value={newTask.texto_tarea}
                    onChange={handleChange}
                    placeholder="New Task"
                />
                <input
                    type="date"
                    name="fecha_tentativa_finalizacion"
                    value={newTask.fecha_tentativa_finalizacion}
                    onChange={handleChange}
                />
                <select
                    name="estado"
                    value={newTask.estado}
                    onChange={handleChange}
                >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>

                </select>
                <select
                    name="categoria"
                    value={newTask.categoria}
                    onChange={handleChange}
                >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                            <option  value={category.name}>
                                {category.nombre}
                            </option>
                        ))}

                </select>
                <button onClick={addTask}>Add Task</button>
            </div>
            {tasks.map(task => (
                <Task key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
            ))}
        </div>
    );
};

export default TaskList;
