import React, { useState } from 'react';
import axios from "../services/axiosconfig";
import '../styles/TaskEditForm.css';

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTask = { title, description };

    // API'ye POST isteği gönder
    axios.post('/Tasks', newTask)
      .then((response) => {
        onTaskAdded(response.data); // Yeni görevi parent bileşene bildir
        setTitle(''); // Formu temizle
        setDescription('');
      })
      .catch((error) => {
        console.error('Error adding task:', error);
        alert('Failed to add task.');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
