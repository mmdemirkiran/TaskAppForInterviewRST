using System.Collections.Generic;
using System.Threading.Tasks;
using TaskApp1.Models;

namespace TaskApp1.Business
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskModel>> GetAllTasksAsync();
        Task<TaskModel?> GetTaskByIdAsync(int id);
        Task<TaskModel> CreateTaskAsync(TaskModel task);
        Task<bool> UpdateTaskAsync(int id, TaskModel task);
        Task<bool> DeleteTaskAsync(int id);
    }
}
