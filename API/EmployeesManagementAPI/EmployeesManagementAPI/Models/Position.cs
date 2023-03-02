namespace EmployeesManagementAPI.Models
{
    public class Position
    {
        public Guid PositionID { get; set; }
        public string PositionCode { get; set; }
        public string PositionName { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifieldDate { get; set; }
        public string? ModifieldBy { get; set; }
    }
}
