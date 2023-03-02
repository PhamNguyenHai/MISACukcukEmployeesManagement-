using EmployeesManagementAPI.Models;
using System.Reflection;

namespace EmployeesManagementAPI.Models
{
    public class Employee
    {
        public Guid EmployeeID { get; set; }
        public string EmployeeCode { get; set; }
        public string  EmployeeName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public int? Gender { get; set; }
        public string IdentityNumber { get; set; }
        public DateTime? IdentityIssuedDate { get; set; }
        public string? IdentityIssuedPlace { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public Guid? PositionID { get; set; }
        public string? PositionName { get; set; }
        public Guid? DepartmentID { get; set; }
        public string? DepartmentName { get; set; }
        public string? TaxCode { get; set; }
        public double? Salary { get; set; }
        public DateTime? JoiningDate { get; set; }
        public int? WorkStatus { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifieldDate { get; set; }
        public string? ModifieldBy { get; set; }
    }
}
