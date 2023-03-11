namespace EmployeesManagementAPI.Models.DTO
{
    public class GetPaging
    {
        public List<Employee> Data { get; set; }
        public long TotalCount { get; set; }
    }
}
