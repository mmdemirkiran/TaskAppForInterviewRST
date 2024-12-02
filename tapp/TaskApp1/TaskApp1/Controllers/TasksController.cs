using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskApp1.Data;
using TaskApp1.Models;

namespace TaskApp1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Tüm işlemler için yetkilendirme gereksinimi
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TasksController(AppDbContext context)
        {
            _context = context;
        }

        // Tüm görevleri getir
        [HttpGet]
        public async Task<IActionResult> GetTasks()
        {
            try
            {
                var tasks = await _context.Tasks.ToListAsync();
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching tasks.", details = ex.Message });
            }
        }

        // ID'ye göre görev getir
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTaskById(int id)
        {
            try
            {
                var task = await _context.Tasks.FindAsync(id);
                if (task == null)
                {
                    return NotFound(new { message = $"Task with ID {id} not found." });
                }
                return Ok(task);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching the task.", details = ex.Message });
            }
        }

        // Yeni görev oluştur
        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] TaskModel task)
        {
            if (task == null || string.IsNullOrEmpty(task.Title))
            {
                return BadRequest(new { message = "Task data is invalid. Title is required." });
            }

            try
            {
                task.CreatedAt = DateTime.UtcNow;
                _context.Tasks.Add(task);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetTaskById), new { id = task.Id }, task);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the task.", details = ex.Message });
            }
        }

        // Görev güncelle
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskModel task)
        {
            if (task == null || string.IsNullOrEmpty(task.Title))
            {
                return BadRequest(new { message = "Task data is invalid. Title is required." });
            }

            try
            {
                var existingTask = await _context.Tasks.FindAsync(id);
                if (existingTask == null)
                {
                    return NotFound(new { message = $"Task with ID {id} not found." });
                }

                existingTask.Title = task.Title;
                existingTask.Description = task.Description;
                await _context.SaveChangesAsync();

                return Ok(existingTask);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the task.", details = ex.Message });
            }
        }

        // Görev sil
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            try
            {
                var task = await _context.Tasks.FindAsync(id);
                if (task == null)
                {
                    return NotFound(new { message = $"Task with ID {id} not found." });
                }

                _context.Tasks.Remove(task);
                await _context.SaveChangesAsync();

                return Ok(new { message = $"Task with ID {id} deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the task.", details = ex.Message });
            }
        }
    }
}
