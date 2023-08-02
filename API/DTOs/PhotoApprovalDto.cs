namespace API.DTOs
{
    public class PhotoApprovalDto
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string username { get; set; }
        public bool IsApproved { get; set; }
    }
}