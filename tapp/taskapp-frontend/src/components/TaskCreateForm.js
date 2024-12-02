import React, { useState, useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import axios from "../services/axiosconfig";
import { useNavigate } from 'react-router-dom';

const TaskCreateForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const { addTask } = useContext(TaskContext);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const newTask = { title, description };
        axios.post('/Tasks', newTask)
            .then(response => {
                addTask(response.data);
                navigate('/');
            })
            .catch(error => console.error('Error creating task:', error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Create Task</h1>
            <label>Title:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <label>Description:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            <button type="submit">Create</button>
        </form>
    );
};

export default TaskCreateForm;
