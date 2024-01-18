namespace Models
{
  public class RegisterDTO{
    public string Email { get; set; }
    public string Password { get; set; }
    public string Gender {get;set;}
    public string Name { get; set; }
    public string Surname { get; set; }
    public int Age { get; set; }
    public string City { get; set; }
    public string LookingFor { get; set; }
    public string Kids { get; set; }  
    public string Pets { get; set; }
    public string Diet { get; set; }
    public List<string> Interests { get; set; }
    public string Message {get;set;}
  }
}