using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Models;
using Services;

[ApiController]
[Route("[controller]")]
public class MatchController : ControllerBase
{

  private MatchService matchService;
  public MatchController()
  {
    matchService = new MatchService();
  }
  [HttpPut("SetPreferences/{userId}")]
  public async  Task<IActionResult> SetPreferences(int userId,PreferencesDTO pdto)
  {
    try
    { 
       await matchService.SetPreferences(userId,pdto);
       return Ok($"{userId} seted preferences");
    } 
    catch(Exception e)
    {
      return StatusCode(500,e.Message);
    }
  }

  [HttpGet("GetPotentialMatches/{userId}")]
  public async Task<IActionResult> GetPotentialMatches(int userId)
  {
    try 
    {
      var ids = await matchService.GetPotentialMatches(userId);
      return Ok(ids); 
    }
    catch(Exception e)
    {
      return StatusCode(500,e.Message);
    }
  }

  [HttpPost("DislikeUser/{userId}/{userId2}")]
  public async Task<IActionResult> DislikeUser(int userId,int userId2)
  {
    try
    {
      await matchService.DislikeUser(userId,userId2);
      return Ok($"{userId} disliked {userId2}");
    }
    catch(Exception e)
    {
      return StatusCode(500,e.Message);
    }
  }
  [HttpPost("LikeUser/{userId}/{userId2}")]
  public async Task<IActionResult> LikeUser(int userId,int userId2)
  {
    try
    {
      var status = await matchService.LikeUser(userId,userId2);
      return Ok(status);
    }
    catch(Exception e)
    {
      return StatusCode(500,e.Message);
    }
  }

  [HttpGet("GetAllMatchedMessages/{userId}")]
  public  IActionResult GetAllMAtchedMessages(int userId)
  {
    if(userId<0)
      return BadRequest("User id must be greater than 0");
    try
    {
      var message = matchService.GetAllMessages(userId);
      return Ok(message.Result);
    }catch(Exception e)
    {
      return StatusCode(500,e.Message);
    }
  }

  [HttpDelete("RemoveMatch/{userId1}/{userId2}")]
  public async Task<IActionResult> RemoveMatch(int userId1,int userId2)
  {
    if(userId1<0 || userId2 <0)
      return BadRequest("User id must be greater than 0");
    try
    {
      await matchService.DeleteMatch(userId1,userId2);
      return Ok("Match deleted!");
    }catch(Exception e)
    {
      return StatusCode(500,e.Message);
    }
  }

  [HttpGet("PreferencesExist/{userId}")]
  public async Task<IActionResult> PreferencesExist(int userId)
  {
    if(userId<0)
      return BadRequest("User id must be greater than 0");
    try
    {
      return Ok(await matchService.PreferencesExist(userId));
    }
    catch(Exception e)
    {
      return StatusCode(500,e.Message);
    }
  }
}
