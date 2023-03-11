using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Dapper;
using MySqlConnector;
using EmployeesManagementAPI.Models;
using EmployeesManagementAPI.Models.DTO;

/*
 GetbyID : 
	e01 : exception
	e02 : not found
Insert : 
	e01 : exception
	e02 : Trùng mã ID
	e03 : Không tạo đc (số dòng ảnh hưởng <=0)

Update : 
	e01 : exception
	e02 : không cập nhật được - không tìm thấy mã (số dòng ảnh hưởng <=0)
	e03 : Update đổi sang mã khác

Delete : 
	e01 : exception
	e02 : không xóa đc - không tìm thấy mã
*/

namespace EmployeesManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAllEmployees()
        {
            try
            {
                string connectionString = "Server=localhost;Port=3306;Database=cukcuk_employees_management;Uid=root;Pwd=25122002;";
                var mySQLConnection = new MySqlConnection(connectionString);
                string command = "SELECT * FROM employee e ORDER BY e.EmployeeCode DESC";
                var employees = mySQLConnection.Query<Employee>(command);

                if (employees != null)
                    return Ok(employees);
                else
                    return BadRequest("e02");
            }
            catch(Exception ex)
            {
                Console.Write(ex.ToString());
                return StatusCode(StatusCodes.Status400BadRequest, "e01");
            }
        }

        [HttpGet("filter")]
        public IActionResult PagingEmployeesAndFilter(
                [FromQuery] string? keyWord,
                [FromQuery] Guid? positionID,
                [FromQuery] Guid? departmentID,
                [FromQuery] int pageNumber=1,
                [FromQuery] int pageSize=10)
        {
            try
            {
                string connectionString = "Server=localhost;Port=3306;Database=cukcuk_employees_management;Uid=root;Pwd=25122002;";
                var mySQLConnection = new MySqlConnection(connectionString);

                //Ten stored procedure 
                var storedProcedureName = "Proc_Employee_GetPaging";

                // Chuan bi tham so dau vao cho stored prodecure
                var parametters = new DynamicParameters();
                parametters.Add("@v_Offset", (pageNumber - 1) * pageSize);
                parametters.Add("@v_Limit", pageSize);
                parametters.Add("@v_Sort", "ModifieldDate DESC");

                string whereCommand = string.Empty;
                List<string> orWhereCommand = new List<string>();
                List<string> andWhereCommand = new List<string>();

                if (keyWord != null)
                {
                    orWhereCommand.Add($"EmployeeCode LIKE '%{keyWord}%'");
                    orWhereCommand.Add($"EmployeeName LIKE '%{keyWord}%'");
                    orWhereCommand.Add($"PhoneNumber LIKE '%{keyWord}%'");
                }
                if (orWhereCommand.Count > 0)
                    whereCommand = $"({ string.Join(" OR ", orWhereCommand)})";

                if (positionID != null)
                {
                    andWhereCommand.Add($"PositionID = '{positionID}'");
                }
                if (departmentID != null)
                {
                    andWhereCommand.Add($"DepartmentID = '{departmentID}'");
                }
                if (andWhereCommand.Count > 0)
                {
                    if (whereCommand == string.Empty)
                        whereCommand += string.Join(" AND ", andWhereCommand);
                    else
                        whereCommand += $" AND {string.Join(" AND ", andWhereCommand)}";
                }
                parametters.Add("@v_Where", whereCommand);

                var multipleResults = mySQLConnection.QueryMultiple(storedProcedureName, parametters, commandType: System.Data.CommandType.StoredProcedure);

                if (multipleResults != null)
                {
                    return Ok(new GetPaging()
                    {
                        Data = multipleResults.Read<Employee>().ToList(),
                        TotalCount = multipleResults.Read<long>().FirstOrDefault()
                    });
                }
                else
                    return StatusCode(StatusCodes.Status400BadRequest, "e02");
            }
            catch (Exception ex)
            {
                Console.Write(ex.ToString());
                return StatusCode(StatusCodes.Status400BadRequest, ex.ToString());
            }
        }

        [HttpGet("{employeeID}")]
        public IActionResult GetEmployeeByID(Guid employeeID)
        {
            try
            {
                string connectionString = "Server=localhost;Port=3306;Database=cukcuk_employees_management;Uid=root;Pwd=25122002;";
                var mySQLConnection = new MySqlConnection(connectionString);
                string command = "SELECT * FROM cukcuk_employees_management.employee e WHERE EmployeeID = @employeeID";
                var parametters = new DynamicParameters();
                parametters.Add("@employeeID", employeeID);
                var employee = mySQLConnection.QueryFirstOrDefault<Employee>(command, parametters);

                if (employee != null)
                    return Ok(employee);
                else
                    return NotFound("e02");
            }
            catch (Exception ex)
            {
                Console.Write(ex.ToString());
                return StatusCode(StatusCodes.Status400BadRequest, "e01");
            }
        }

        [HttpGet("NewEmployeeCode")]
        public IActionResult GetNewEmployeeCode()
        {
            try
            {
                string connectionString = "Server=localhost;Port=3306;Database=cukcuk_employees_management;Uid=root;Pwd=25122002;";
                var mySQLConnection = new MySqlConnection(connectionString);
                string command = "SELECT MAX(EmployeeCode) FROM employee";
                var maxEmployeeCode = mySQLConnection.QueryFirstOrDefault<string>(command);

                if (maxEmployeeCode != null)
                {
                    int MaxNumber = int.Parse(maxEmployeeCode.Replace("NV", "")) + 1;
                    maxEmployeeCode = "NV" + MaxNumber;
                    return Ok(maxEmployeeCode);
                }
                else
                    return NotFound("e02");
            }
            catch (Exception ex)
            {
                Console.Write(ex.ToString());
                return StatusCode(StatusCodes.Status400BadRequest, "e01");
            }
        }

        [HttpPost]
        public IActionResult AddNewEmployee(Employee newEmployee)
        {
            try
            {
                string connectionString = "Server=localhost;Port=3306;Database=cukcuk_employees_management;Uid=root;Pwd=25122002;";
                var mySQLConnection = new MySqlConnection(connectionString);
                string command = "INSERT cukcuk_employees_management.employee(EmployeeID, EmployeeCode, EmployeeName, DateOfBirth, Gender, IdentityNumber, IdentityIssuedDate, IdentityIssuedPlace, Email, PhoneNumber, PositionID, PositionName, DepartmentID, DepartmentName, TaxCode, Salary, JoiningDate, WorkStatus, CreatedDate, CreatedBy, ModifieldDate, ModifieldBy)" +
                                 "VALUES (@EmployeeID, @EmployeeCode, @EmployeeName, @DateOfBirth, @Gender, @IdentityNumber, @IdentityIssuedDate, @IdentityIssuedPlace, @Email, @PhoneNumber, @PositionID, @PositionName, @DepartmentID, @DepartmentName, @TaxCode, @Salary, @JoiningDate, @WorkStatus, @CreatedDate, @CreatedBy, @ModifieldDate, @ModifieldBy)";
                var parametters = new DynamicParameters();
                newEmployee.EmployeeID = Guid.NewGuid();
                parametters.Add("@EmployeeID",          newEmployee.EmployeeID);
                parametters.Add("@EmployeeCode",        newEmployee.EmployeeCode);
                parametters.Add("@EmployeeName",        newEmployee.EmployeeName);
                parametters.Add("@DateOfBirth",         newEmployee.DateOfBirth);
                parametters.Add("@Gender",              newEmployee.Gender);
                parametters.Add("@IdentityNumber",      newEmployee.IdentityNumber);
                parametters.Add("@IdentityIssuedDate",  newEmployee.IdentityIssuedDate);
                parametters.Add("@IdentityIssuedPlace", newEmployee.IdentityIssuedPlace);
                parametters.Add("@Email",               newEmployee.Email);
                parametters.Add("@PhoneNumber",         newEmployee.PhoneNumber);
                parametters.Add("@PositionID",          newEmployee.PositionID);
                parametters.Add("@PositionName",        newEmployee.PositionName);
                parametters.Add("@DepartmentID",        newEmployee.DepartmentID);
                parametters.Add("@DepartmentName",      newEmployee.DepartmentName);
                parametters.Add("@TaxCode",             newEmployee.TaxCode);
                parametters.Add("@Salary",              newEmployee.Salary);
                parametters.Add("@JoiningDate",         newEmployee.JoiningDate);
                parametters.Add("@WorkStatus",          newEmployee.WorkStatus);
                newEmployee.CreatedBy = "Phạm Nguyễn Nguyên Hải";
                newEmployee.ModifieldBy = "Phạm Nguyễn Nguyên Hải";
                parametters.Add("@CreatedDate",         DateTime.Now);
                parametters.Add("@CreatedBy",           newEmployee.CreatedBy);
                parametters.Add("@ModifieldDate",       DateTime.Now);
                parametters.Add("@ModifieldBy",         newEmployee.ModifieldBy);

                var rowAffected =  mySQLConnection.Execute(command, parametters);

                if (rowAffected > 0)
                    return StatusCode(StatusCodes.Status201Created, newEmployee.EmployeeID);
                else
                    return StatusCode(StatusCodes.Status400BadRequest, "e03");
            }
            catch (MySqlException mysqlexception)
            {
                if(mysqlexception.ErrorCode == MySqlErrorCode.DuplicateKeyEntry)
                {
                    Console.Write("Trung Employee Code");
                    return StatusCode(StatusCodes.Status400BadRequest, "e02");
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e01");
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex.ToString());
                return StatusCode(StatusCodes.Status400BadRequest, "e01");
            }
        }

        [HttpPut("{employeeID}")]
        public IActionResult UpdateEmployee(Guid employeeID, Employee updateEmployee)
        {
            try
            {
                string connectionString = "Server=localhost;Port=3306;Database=cukcuk_employees_management;Uid=root;Pwd=25122002;";
                var mySQLConnection = new MySqlConnection(connectionString);
                string command = "UPDATE cukcuk_employees_management.employee " +
                                 "SET EmployeeID = @EmployeeID, " +
                                 "EmployeeCode = @EmployeeCode, " +
                                 "EmployeeName = @EmployeeName, " +
                                 "DateOfBirth = @DateOfBirth, " +
                                 "Gender = @Gender, " +
                                 "IdentityNumber = @IdentityNumber, " +
                                 "IdentityIssuedDate = @IdentityIssuedDate, " +
                                 "IdentityIssuedPlace = @IdentityIssuedPlace, " +
                                 "Email = @Email, " +
                                 "PhoneNumber = @PhoneNumber, " +
                                 "PositionID = @PositionID, " +
                                 "PositionName = @PositionName, " +
                                 "DepartmentID = @DepartmentID, " +
                                 "DepartmentName = @DepartmentName, " +
                                 "TaxCode = @TaxCode, " +
                                 "Salary = @Salary, " +
                                 "JoiningDate = @JoiningDate, " +
                                 "WorkStatus = @WorkStatus, " +
                                 "ModifieldDate = @ModifieldDate, " +
                                 "ModifieldBy = @ModifieldBy " +
                                 "WHERE EmployeeID = @employeeID";
                var parametters = new DynamicParameters();
                updateEmployee.EmployeeID = Guid.NewGuid();
                updateEmployee.ModifieldBy = "Phạm Nguyễn Nguyên Hải";
                parametters.Add("@EmployeeID",          updateEmployee.EmployeeID);
                parametters.Add("@EmployeeCode",        updateEmployee.EmployeeCode);
                parametters.Add("@EmployeeName",        updateEmployee.EmployeeName);
                parametters.Add("@DateOfBirth",         updateEmployee.DateOfBirth);
                parametters.Add("@Gender",              updateEmployee.Gender);
                parametters.Add("@IdentityNumber",      updateEmployee.IdentityNumber);
                parametters.Add("@IdentityIssuedDate",  updateEmployee.IdentityIssuedDate);
                parametters.Add("@IdentityIssuedPlace", updateEmployee.IdentityIssuedPlace);
                parametters.Add("@Email",               updateEmployee.Email);
                parametters.Add("@PhoneNumber",         updateEmployee.PhoneNumber);
                parametters.Add("@PositionID",          updateEmployee.PositionID);
                parametters.Add("@PositionName",        updateEmployee.PositionName);
                parametters.Add("@DepartmentID",        updateEmployee.DepartmentID);
                parametters.Add("@DepartmentName",      updateEmployee.DepartmentName);
                parametters.Add("@TaxCode",             updateEmployee.TaxCode);
                parametters.Add("@Salary",              updateEmployee.Salary);
                parametters.Add("@JoiningDate",         updateEmployee.JoiningDate);
                parametters.Add("@WorkStatus",          updateEmployee.WorkStatus);
                parametters.Add("@ModifieldDate",       DateTime.Now);
                parametters.Add("@ModifieldBy",         updateEmployee.ModifieldBy);
                parametters.Add("@employeeID",          employeeID);

                var rowAffected = mySQLConnection.Execute(command, parametters);
                if (rowAffected > 0)
                    return StatusCode(StatusCodes.Status200OK, updateEmployee.EmployeeID);
                else
                    return StatusCode(StatusCodes.Status404NotFound, "e02");
            }
            catch (MySqlException mysqlexception)
            {
                if (mysqlexception.ErrorCode == MySqlErrorCode.DuplicateKeyEntry)
                {
                    Console.Write("Khong duoc cap nhat sang ma khac");
                    return StatusCode(StatusCodes.Status400BadRequest, "e03");
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e01");
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex.ToString());
                return StatusCode(StatusCodes.Status400BadRequest, "e01");
            }
        }

        [HttpDelete("{employeeID}")]
        public IActionResult DeleteEmployeeById(Guid employeeID)
        {
            try
            {
                string connectionString = "Server=localhost;Port=3306;Database=cukcuk_employees_management;Uid=root;Pwd=25122002;";
                var mySQLConnection = new MySqlConnection(connectionString);
                string command = "DELETE FROM employee WHERE EmployeeID = @employeeID";

                var parametters = new DynamicParameters();
                parametters.Add("@employeeID", employeeID);

                var rowAffected = mySQLConnection.Execute(command, parametters);
                if (rowAffected > 0)
                    return StatusCode(StatusCodes.Status200OK);
                else
                    return StatusCode(StatusCodes.Status404NotFound, "e02");
            }
            catch (Exception ex)
            {
                Console.Write(ex.ToString());
                return StatusCode(StatusCodes.Status400BadRequest, "e01");
            }
        }
    }
}
