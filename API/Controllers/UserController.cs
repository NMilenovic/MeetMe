using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration.UserSecrets;
using Models;
using Services;

namespace API.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
  private NeoService neoService;
  private UserService userService;

  public UserController()
  {
    neoService = new NeoService();
    userService = new UserService();
  }
  [HttpPost("Register")]
  public async Task<IActionResult> Register(RegisterDTO rdto)
  {
    try
    {
      await userService.Register(rdto);
      return Ok("User is created!");
    }
    catch(Exception e)
    {
      return StatusCode(500,e.StackTrace);
    }
  }

  [HttpGet("Login/{email}/{password}")]
  public IActionResult Login(string email, string password)
  {
    try
    {
      LoginDTO ldto = new LoginDTO {Email = email, Password = password};
      var userId = userService.Login(ldto);
      return Ok(userId.Result);
    }
    catch(Exception e)
    {
      return StatusCode(500,e.Message);
    }
  }

  [HttpPut("PutMessage/{userId}/{message}")]
  public async Task<IActionResult> PutMessage(int userId,string message)
  {
    if(String.IsNullOrWhiteSpace(message))
      return BadRequest("Message lenght cant be empty.");
    if(message.Length > 50)
      return BadRequest("Messege lenght cant be longer than 50");
    try
    {
       await userService.ChangeMessage(userId,message);
       return Ok("User changed a message");

    }
    catch(Exception e)
    {
      return StatusCode(500,e.Message);
    }
  }

  [HttpGet("GetUserById/{userId}")]
  public IActionResult GetUserById(int userId)
  {
    if(userId<0)
      return BadRequest("User id must be greater than 0");
    try
    {
      var user = userService.ReturnUserById(userId);
      return Ok(user.Result);
    }catch(Exception e)
    {
      return StatusCode(500,e.Message);
    }
  }

  [HttpGet("GetMessageByUserId/{userId}")]
  public IActionResult GetMessageByUserId(int userId)
  {
    if(userId<0)
      return BadRequest("User id must be greater than 0");
    try
    {
      var message = userService.GetMessageByUserId(userId);
      return Ok(message.Result);
    }catch(Exception e)
    {
      return StatusCode(500,e.Message);
    }
  }

  [HttpGet("GetPreferences/{userId}")]
  public IActionResult GetPreferences(int userId)
  {
    if(userId<0)
      return BadRequest("User id must be greater than 0");
    try 
    {
      var pref = userService.GetPreferences(userId);
      return Ok(pref.Result);
    }catch(Exception e)
    {
      return StatusCode(500,e.Message);
    }
  }

  [HttpGet("GetInterests/{userId}")]
  public IActionResult GetInterests(int userId)
  {
     if(userId<0)
      return BadRequest("User id must be greater than 0");
    try 
    {
      var pref = userService.GetInterests(userId);
      return Ok(pref.Result);
    }catch(Exception e)
    {
      return StatusCode(500,e.Message);
    }
  }

  [HttpPut("PutInterests/{userId}")]
  public  async Task<IActionResult> PutInterests([FromBody]List<string> interests,int userId)
  {
    if(userId<0)
      return BadRequest("User id must be greater than 0");
    if(interests.Count == 0)
      return BadRequest("Must have at least 1 interest");
    try 
    {
      await userService.PutInterests(userId,interests);
      return Ok("New interests set");
    }
    catch(Exception e)
    {
      return StatusCode(500,e.Message);
    }
  }

  [HttpPut("ChangePreferences/{userId}")]
  public async Task<IActionResult> ChangePreferences([FromBody]OptionsDTO odto,long userId)
  {
    if(userId < 0)
      return BadRequest("User ID cant be less than 0");
    try
    {
      await userService.ChangePreferences(odto,userId);
      return Ok("Changed preferences of user");
    }
    catch(Exception e)
    {
      return StatusCode(500,e.Message);
    }
  }
}

