using Microsoft.AspNetCore.Mvc.TagHelpers;
using Models;
using Neo4j.Driver;

namespace Services 
{
  public class MatchService
  {

    private NeoService neoService;

    public MatchService()
    {
      neoService = new NeoService();
    }
    public async Task  SetPreferences(int userId,PreferencesDTO pdto)
    {
    var query =  @"MATCH (u:User)
                  WHERE ID(u) = $user
                  WITH u
                  MERGE (pk:Kids{value: $kids})
                  CREATE (u)-[:PREF_KIDS]->(pk)
                  WITH u
                  MERGE (pd:Diet{value:$diet})
                  CREATE (u)-[:PREF_DIET]->(pd)
                  WITH u
                  MERGE (pp:Pets{value:$pets})
                  CREATE (u)-[:PREF_PETS]->(pp)";
    var parameters = new 
    {
      user = userId,
      kids = pdto.Kids,
      diet = pdto.Diet,
      pets = pdto.Pets
    };

    using var session = neoService._driver.AsyncSession();
    await session.WriteTransactionAsync(async tx =>
    {
        await tx.RunAsync(query, parameters);
    });
  }

  public async Task<List<int>> GetPotentialMatches(int userId)
  {
    var query = @"
        MATCH (u:User)
        WHERE ID(u) = $userId
        WITH u
        MATCH (other:User)-[:LOOKING_FOR]->(l)<-[:LOOKING_FOR]-(u)
        WHERE u <> other AND NOT (u)-[:SEEN]->(other) AND NOT (u)-[:LIKES]->(other) AND NOT (u)-[:MATCHED]->(other)
        WITH DISTINCT other,
          CASE WHEN EXISTS((u)-[:PREF_PETS]->()<-[:PETS]-(other)) THEN 1 ELSE 0 END AS petsScore,
          CASE WHEN EXISTS((u)-[:PREF_DIET]->()<-[:DIET]-(other)) THEN 1 ELSE 0 END AS dietScore,
          CASE WHEN EXISTS((u)-[:PREF_KIDS]->()<-[:KIDS]-(other)) THEN 1 ELSE 0 END AS kidsScore
        WITH other, petsScore, dietScore, kidsScore,
          petsScore + dietScore + kidsScore AS totalScore
        RETURN id(other) as neoId
        ORDER BY totalScore DESC";
    
    using var session = neoService._driver.AsyncSession();
    var param = new {userId};
    var result = await session.RunAsync(query, param );
    var records = await result.ToListAsync();

    List<int> usersId = new List<int>();
    foreach(var record in records)
    {
      usersId.Add(record["neoId"].As<int>());
    }
    return usersId;
  }

  public async Task DislikeUser(int userId1,int userId2)
  {
    var query = @"
    MATCH (u1:User)
    WHERE id(u1) = $userId1
    MATCH (u2:User)
    WHERE id(u2) = $userId2
    CREATE (u1)-[:SEEN]->(u2)";

    var parameters = new {userId1,userId2};
    using var session = neoService._driver.AsyncSession();
    await session.ExecuteWriteAsync(async tx =>{
      var result = await tx.RunAsync(query,parameters);
    });
  }

  public async Task<string> LikeUser(int userId1,int userId2)
  {
    var query = @"
    MATCH (u1:User)
    WHERE ID(u1) = $userId1
    MATCH (u2:User)
    WHERE ID(u2) = $userId2
    OPTIONAL MATCH (u2)-[reverseLike:LIKES]->(u1)
    DELETE reverseLike

    WITH u1, u2, reverseLike
    FOREACH(ignore IN CASE WHEN reverseLike IS NOT NULL THEN [1] ELSE [] END |
      CREATE (u1)-[:MATCHED]->(u2)
      CREATE (u2)-[:MATCHED]->(u1)
    )
    WITH u1, u2, reverseLike
    FOREACH(ignore IN CASE WHEN reverseLike IS NULL THEN [1] ELSE [] END |
    CREATE (u1)-[:LIKES]->(u2)
    )
    WITH CASE WHEN reverseLike IS NOT NULL THEN 'Yes' ELSE 'No' END as status

    RETURN status";

    var parameters = new {userId1,userId2};

    using var session = neoService._driver.AsyncSession();
    var s = await session.ExecuteWriteAsync(async tx => {
      var result = await tx.RunAsync(query, parameters);
      var record = await result.SingleAsync();
      return record["status"].As<string>();
  });
    return s;
  }

  public async Task<List<MessageDTO>> GetAllMessages(int userId)
  {
    var query = @"
        MATCH (u1:User)-[:MATCHED]->(matchedU:User)
        WHERE ID(u1) = $userId
        RETURN COLLECT({ ID: ID(matchedU), Message: matchedU.message }) AS matchedMessages";

    using var session = neoService._driver.AsyncSession();
    var result = await session.RunAsync(query, new { userId });
    var record = await result.SingleAsync();

    var messagesList = record["matchedMessages"].As<List<Dictionary<string, object>>>();

    var messages = messagesList.Select(messageData =>
    {
        var messageDTO = new MessageDTO
        {
            ID = (int)(long)messageData["ID"],
            Message = messageData["Message"]?.ToString()
        };
        return messageDTO;
    }).ToList();

    return messages;
    
  }

  public async Task DeleteMatch(int user1,int user2)
  {
    var query = @"
      MATCH (u1:User)
      WHERE id(u1) = $user1
      MATCH (u2:User)
      WHERE id(u2) = $user2
      MATCH (u1)-[m1:MATCHED]->(u2) 
      MATCH (u2)-[m2:MATCHED]->(u1)
      CREATE (u1)-[:SEEN]->(u2)
      DELETE m1,m2";
    using var session = neoService._driver.AsyncSession();
    var result = await session.RunAsync(query, new { user1,user2 });
  }

  public async Task<bool> PreferencesExist(int userId)
  {
    var query = @"
      MATCH (u:User)
      WHERE ID(u) = $userId
      MATCH (u)-[:PREF_DIET]->(d:Diet)
      MATCH (u)-[:PREF_KIDS]->(k:Kids)
      MATCH (u)-[:PREF_PETS]->(p:Pets)
      WITH COUNT(d)+COUNT(k)+COUNT(p) as relationshipCount
      RETURN relationshipCount = 3 AS hasAll";

    using var session = neoService._driver.AsyncSession();
    var result = await session.RunAsync(query, new { userId });
    var record = await result.SingleAsync();
    return record["hasAll"].As<bool>();


  }
  
}
}