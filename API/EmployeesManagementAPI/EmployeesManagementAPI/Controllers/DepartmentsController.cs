using EmployeesManagementAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Dapper;

namespace EmployeesManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentsController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAllDepartments()
        {
            try
            {
                string ConnectionString = "Server=localhost;Port=3306;Database=cukcuk_employees_management;Uid=root;Pwd=25122002;";
                var MySQLConnection = new MySqlConnection(ConnectionString);
                string Command = "SELECT * FROM cukcuk_employees_management.department d ORDER BY d.DepartmentCode";
                var departments = MySQLConnection.Query<Department>(Command);

                if (departments != null)
                    return Ok(departments);
                else
                    return BadRequest("e02");
            }
            catch (Exception ex)
            {
                Console.Write(ex.ToString());
                return StatusCode(StatusCodes.Status500InternalServerError, "e01");
            }
        }
    }
}
