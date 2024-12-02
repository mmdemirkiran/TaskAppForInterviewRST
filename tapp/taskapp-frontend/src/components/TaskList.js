import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";



const TaskList = () => {
  const [tasks, setTasks] = useState([]); // Mevcut görevler
  const [newTask, setNewTask] = useState({ title: "", description: "" }); // Yeni görev formu
  const { token, logout } = useContext(AuthContext); // Kullanıcı token bilgisi ve logout fonksiyonu

  const [sortOption, setSortOption] = useState(""); // Sıralama seçeneği

  // Görevleri backend'den çek
  useEffect(() => {
    const fetchTasks = async () => {
      console.log("Token:", token); // Token'in doğruluğunu kontrol edin

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

  // Yeni görev ekleme
  const addTask = async (e) => {
    e.preventDefault(); // Sayfanın yenilenmesini engeller
    if (!newTask.title || !newTask.description) {
      alert("Title and Description are required!"); // Boş alan kontrolü
      return;
    }

    try {
      const response = await fetch("https://localhost:7175/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Token'i gönder
        },
        body: JSON.stringify(newTask), // Görevi backend'e gönder
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert("Session expired. Please log in again.");
          logout(); // Token geçersizse çıkış yap
        } else {
          console.error("Failed to add task. Status:", response.status);
          alert("Failed to add task!");
        }
        return;
      }

      const createdTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, createdTask]); // Yeni görevi listeye ekle
      setNewTask({ title: "", description: "" }); // Formu sıfırla
      alert("Task successfully added!");
    } catch (error) {
      console.error("Error adding task:", error);
      alert("An error occurred while adding the task.");
    }
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

  // Görevleri sıralama
  const sortTasks = (option) => {
    let sortedTasks = [...tasks];
    if (option === "title") {
      sortedTasks.sort((a, b) => a.title.localeCompare(b.title)); // A-Z sıralama
    } else if (option === "date") {
      sortedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Yeni -> Eski sıralama
    }
    setTasks(sortedTasks);
    setSortOption(option);
  };

  return (
    <div className="tasklist-container">
      <h1>Task List</h1>

      {/* Sıralama Seçenekleri */}
      <div className="sort-container">
        <button onClick={() => sortTasks("title")}>Sort by Title (A-Z)</button>
        <button onClick={() => sortTasks("date")}>Sort by Date (New to Old)</button>
      </div>

      {/* Yeni Görev Ekleme Formu */}
      <form onSubmit={addTask}>
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
        <button type="submit">Add Task</button>
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
                <button onClick={() => alert(`Editing Task: ${task.id}`)}>Edit</button>
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
