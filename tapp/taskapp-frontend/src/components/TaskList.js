import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const TaskList = () => {
  const [tasks, setTasks] = useState([]); // Mevcut görevler
  const [newTask, setNewTask] = useState({ title: "", description: "" }); // Yeni görev formu
  const { token, logout } = useContext(AuthContext); // Kullanıcı token bilgisi ve logout fonksiyonu

  const [editingTask, setEditingTask] = useState(null); // Düzenlenen görev bilgisi

  // Görevleri backend'den çek
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("https://localhost:7175/api/tasks", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Token'i header'a ekle
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            alert("Session expired. Please log in again.");
            logout(); // Token geçersizse çıkış yap
          } else {
            console.error("Failed to fetch tasks. Status:", response.status);
          }
          return;
        }

        const data = await response.json();
        setTasks(data); // Görevleri state'e ekle
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [token, logout]);

  // Yeni görev ekleme veya düzenleme kaydetme
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.description) {
      alert("Title and Description are required!");
      return;
    }

    if (editingTask) {
      // Düzenleme modu
      try {
        const response = await fetch(`https://localhost:7175/api/tasks/${editingTask.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newTask),
        });

        if (response.ok) {
          const updatedTask = await response.json();
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            )
          );
          setEditingTask(null); // Düzenleme modundan çık
          setNewTask({ title: "", description: "" }); // Formu sıfırla
          alert("Task successfully updated!");
        } else {
          console.error("Failed to update task");
          alert("Failed to update task!");
        }
      } catch (error) {
        console.error("Error updating task:", error);
        alert("An error occurred while updating the task.");
      }
    } else {
      // Yeni görev ekleme
      try {
        const response = await fetch("https://localhost:7175/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newTask),
        });

        if (response.ok) {
          const createdTask = await response.json();
          setTasks((prevTasks) => [...prevTasks, createdTask]);
          setNewTask({ title: "", description: "" }); // Formu sıfırla
          alert("Task successfully added!");
        } else {
          console.error("Failed to add task");
          alert("Failed to add task!");
        }
      } catch (error) {
        console.error("Error adding task:", error);
        alert("An error occurred while adding the task.");
      }
    }
  };

  // Düzenleme işlemini başlat
  const startEditing = (task) => {
    setEditingTask(task); // Düzenlenecek görevi seç
    setNewTask({ title: task.title, description: task.description }); // Mevcut verileri forma doldur
  };

  // Görev silme
  const deleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`https://localhost:7175/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert("Session expired. Please log in again.");
          logout(); // Token geçersizse çıkış yap
        } else {
          console.error("Failed to delete task. Status:", response.status);
        }
        return;
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      alert("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("An error occurred while deleting the task.");
    }
  };

  return (
    <div className="tasklist-container">
      <h1>Task List</h1>

      {/* Yeni Görev Ekleme veya Düzenleme Formu */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <textarea
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        ></textarea>
        <button type="submit">{editingTask ? "Save Changes" : "Add Task"}</button>
      </form>

      {/* Görevler Tablosu */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>
                <button onClick={() => startEditing(task)}>Edit</button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
