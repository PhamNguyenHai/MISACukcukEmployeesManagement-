using EmployeesManagementAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Dapper;

namespace EmployeesManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PositionsController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAllPositions()
        {
            try
            {
                string ConnectionString = "Server=localhost;Port=3306;Database=cukcuk_employees_management;Uid=root;Pwd=25122002;";
                var MySQLConnection = new MySqlConnection(ConnectionString);
                string Command = "SELECT * FROM cukcuk_employees_management.positions p ORDER BY p.PositionCode";
                var positions = MySQLConnection.Query<Position>(Command);

                if (positions != null)
                    return Ok(positions);
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
