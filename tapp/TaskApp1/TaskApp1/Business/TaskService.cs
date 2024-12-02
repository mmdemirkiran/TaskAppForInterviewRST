using TaskApp1.Data;
using TaskApp1.Models;

namespace TaskApp1.Business
{
    public class TaskService : ITaskService
    {
        private readonly IRepository<TaskModel> _repository;

        public TaskService(IRepository<TaskModel> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<TaskModel>> GetAllTasksAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<TaskModel?> GetTaskByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<TaskModel> CreateTaskAsync(TaskModel task)
        {
            return await _repository.CreateAsync(task);
        }

        public async Task<bool> UpdateTaskAsync(int id, TaskModel task)
        {
            return await _repository.UpdateAsync(id, task);
        }

        public async Task<bool> DeleteTaskAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }
    }
}
