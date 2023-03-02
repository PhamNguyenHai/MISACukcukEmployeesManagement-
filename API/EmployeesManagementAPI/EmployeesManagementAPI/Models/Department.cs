namespace EmployeesManagementAPI.Models
{
    public class Department
    {
        public Guid DepartmentID { get; set; }
        public string DepartmentCode { get; set; }
        public string DepartmentName { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifieldDate { get; set; }
        public string? ModifieldBy { get; set; }
    }
}
