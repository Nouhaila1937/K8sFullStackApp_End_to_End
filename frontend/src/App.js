import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Plus, Check, Circle } from "lucide-react";
import "./App.css";

const apiUrl = "http://localhost:3000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(apiUrl);
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      alert("Erreur de connexion au backend. Vérifiez que le serveur est démarré sur le port 3000.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;
    
    try {
      await axios.post(apiUrl, { title: newTask, completed: false });
      setNewTask("");
      fetchTasks(); // Recharger la liste depuis la BD
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Erreur lors de l'ajout de la tâche");
    }
  };

  const toggleTask = async (id) => {
    try {
      const task = tasks.find(t => t._id === id);
      await axios.put(`${apiUrl}/${id}`, { completed: !task.completed });
      fetchTasks(); // Recharger depuis la BD
    } catch (error) {
      console.error("Error toggling task:", error);
      alert("Erreur lors de la mise à jour");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      fetchTasks(); // Recharger depuis la BD
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const activeCount = tasks.length - completedCount;

  return (
    <div className="app-container">
      <div className="app-wrapper">
        {/* Header */}
        <div className="header">
          <h1 className="title">✨ Task Manager</h1>
          <p className="subtitle">Gérez vos tâches avec style</p>
        </div>

        {/* Main Card */}
        <div className="main-card">
          {/* Input Section */}
          <div className="input-section">
            <div className="input-group">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ajouter une nouvelle tâche..."
                className="task-input"
              />
              <button onClick={addTask} className="add-button">
                <Plus size={20} />
                Ajouter
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-section">
            <div className="stats-content">
              <div className="stats-info">
                <span className="stat-item">
                  <span className="stat-number active">{activeCount}</span> active{activeCount !== 1 ? 's' : ''}
                </span>
                <span className="stat-item">
                  <span className="stat-number completed">{completedCount}</span> terminée{completedCount !== 1 ? 's' : ''}
                </span>
              </div>
              
              {/* Filter Buttons */}
              <div className="filter-buttons">
                {["all", "active", "completed"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`filter-btn ${filter === f ? 'active' : ''}`}
                  >
                    {f === "all" ? "Toutes" : f === "active" ? "Actives" : "Terminées"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <div className="tasks-section">
            {isLoading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Chargement...</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <p className="empty-text">
                  {filter === "all" 
                    ? "Aucune tâche pour le moment"
                    : filter === "active"
                    ? "Aucune tâche active"
                    : "Aucune tâche terminée"}
                </p>
                <p className="empty-subtext">
                  Ajoutez votre première tâche ci-dessus
                </p>
              </div>
            ) : (
              <ul className="tasks-list">
                {filteredTasks.map((task) => (
                  <li key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTask(task._id)}
                      className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                    >
                      {task.completed ? (
                        <Check size={16} className="check-icon" />
                      ) : (
                        <Circle size={16} className="circle-icon" />
                      )}
                    </button>

                    {/* Task Title */}
                    <span
                      onClick={() => toggleTask(task._id)}
                      className="task-title"
                    >
                      {task.title}
                    </span>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task._id);
                      }}
                      className="delete-button"
                    >
                      <Trash2 size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {tasks.length > 0 && (
            <div className="footer-section">
              <p className="progress-text">
                {completedCount === tasks.length && tasks.length > 0
                  ? "🎉 Toutes les tâches sont terminées ! Bravo !"
                  : `${Math.round((completedCount / tasks.length) * 100)}% complété`}
              </p>
              {tasks.length > 0 && (
                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${(completedCount / tasks.length) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="footer-info">
          <p>Fait avec ❤️ pour Kubernetes Full Stack Project</p>
        </div>
      </div>
    </div>
  );
}

export default App;