using Microsoft.AspNetCore.Mvc;
using Models;
using Neo4j.Driver;
using Services;
namespace API.Controllers;

[ApiController]
[Route("[controller]")]
public class OptionsController : ControllerBase
{
  private NeoService neoService;

  public OptionsController()
  {
    neoService = new NeoService();
  }

    [HttpGet("GetOptions")]
    public async Task<IActionResult> GetOptions()
    {
        await using var session =neoService._driver.AsyncSession();
        var options = await session.ExecuteReadAsync(
            async tx =>
            {
                var qLookingFor = "MATCH (l:LookingFor) RETURN l";
                var rLookingFor = await tx.RunAsync(qLookingFor);
                var lookingForRecords = await rLookingFor.ToListAsync();

                var qKids = "MATCH (k:Kids) RETURN k";
                var rKids = await tx.RunAsync(qKids);
                var kidsRecords = await rKids.ToListAsync();

                var qPets = "MATCH (p:Pets) RETURN p";
                var rPets = await tx.RunAsync(qPets);
                var petsRecords = await rPets.ToListAsync();

                var qDiet = "MATCH (d:Diet) RETURN d";
                var rDiet = await tx.RunAsync(qDiet);
                var dietRecords = await rDiet.ToListAsync();

                var response = new OptionsResponse{
                  LookingForOptions = lookingForRecords.Select(record => record["l"].As<INode>().Properties["value"].ToString()).ToList(),
                  PetsOptions = petsRecords.Select(record => record["p"].As<INode>().Properties["value"].ToString()).ToList(),
                  DietOptions = dietRecords.Select(record => record["d"].As<INode>().Properties["value"].ToString()).ToList(),
                  KidsOptions = kidsRecords.Select(record => record["k"].As<INode>().Properties["value"].ToString()).ToList()
                };

                return Ok(response);
            });
       return options;
    }
  [HttpGet("GetInterests")]
  public async Task<IActionResult> GetInterests()
  {
    await using var session =neoService._driver.AsyncSession();
        var options = await session.ExecuteReadAsync(
            async tx =>
            {
                var qInterets = "MATCH (i:Interest) RETURN i";
                var rInterests = await tx.RunAsync(qInterets);
                var interestRecords = await rInterests.ToListAsync();

                var response = new InterestsResponse{
                  InterestsOptions = interestRecords.Select(record => record["i"].As<INode>().Properties["value"].ToString()).ToList()
                };

                return Ok(response);
            });
            
       return options;
  }

[HttpGet("GetCities")]
  public async Task<IActionResult> GetCities()
  {
    await using var session =neoService._driver.AsyncSession();
        var options = await session.ExecuteReadAsync(
            async tx =>
            {
                var qCity = "MATCH (c:City) RETURN c";
                var rCity = await tx.RunAsync(qCity);
                var cityRecords = await rCity.ToListAsync();

                List<string> response = new List<string>();
                response = cityRecords.Select(record =>record["c"].As<INode>().Properties["value"].ToString()).ToList();
                return Ok(response);
            });
            
       return options;
  }
  
}