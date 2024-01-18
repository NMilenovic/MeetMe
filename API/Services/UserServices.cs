using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Models;
using Neo4j.Driver;

namespace Services
{
  public class UserService
  {
    private NeoService neoService;

    public UserService(){
      neoService = new NeoService();
    }

    private string ShaEncoding(string pass)
    {
        var sha = SHA256.Create();
        var strByte = Encoding.UTF8.GetBytes(pass);
        byte[] passHash = sha.ComputeHash(strByte); 
        var str = Encoding.UTF8.GetString(passHash);

        return str;

    }
    public async Task Register(RegisterDTO rdto)
    {
      var str = ShaEncoding(rdto.Password);
      await using var session = neoService._driver.AsyncSession();

      var existingUserQuerry = "MATCH (u:User {email: $email}) RETURN u";
      var existingUserParams = new {email = rdto.Email};

      var existingUserCurrsor = await session.RunAsync(existingUserQuerry,existingUserParams);
      var existingUserRecord = await existingUserCurrsor.ToListAsync();
      if(existingUserRecord.Count != 0)
        throw new Exception("User already exist!");
      
      await session.ExecuteWriteAsync(async tx =>{
        var createUserQuery = @"
        CREATE (u:User {
          email: $email,
          password: $hashedPassword,
          gender: $gender, 
          name: $name,
          surname: $surname,
          age: $age,
          message: $message
        })
        WITH u
        MERGE (c:City {value:$city})
        CREATE (u)-[:LIVES_IN]->(c)
        WITH u
        MERGE (lf:LookingFor {value: $lookingFor})
        CREATE (u)-[:LOOKING_FOR]->(lf)
        WITH u
        MERGE (k:Kids {value:$kids})
        CREATE (u)-[:KIDS]->(k)
        WITH u
        MERGE (p:Pets {value:$pets})
        CREATE (u)-[:PETS]->(p)
        WITH u
        MERGE (d:Diet {value:$diet})
        CREATE (u)-[:DIET]->(d)
        WITH u
        UNWIND $interests AS interest
        MERGE (i:Interest {value: interest})
        CREATE (u)-[:INTERESTED_IN]->(i)
        RETURN id(u) as userId"; 


        var parameters = new 
        {
          email = rdto.Email,
          hashedPassword = str, 
          gender = rdto.Gender,
          name = rdto.Name,
          surname = rdto.Surname,
          age = rdto.Age,
          city = rdto.City,
          lookingFor = rdto.LookingFor,
          message = rdto.Message,
          kids = rdto.Kids,
          pets = rdto.Pets,
          diet = rdto.Diet,
          interests = rdto.Interests,
        };

        var cursor = await tx.RunAsync(createUserQuery,parameters);
      });
    }
  
    public async Task<string> Login(LoginDTO ldto)
    {
      var str = ShaEncoding(ldto.Password);
      await using var session = neoService._driver.AsyncSession();
      var loginQuery = "MATCH (u:User {email: $email, password:$password}) RETURN id(u) as userId";
      var loginParms = new {email = ldto.Email, password = str};

      var loginCursor = await session.RunAsync(loginQuery,loginParms);
      var loginRecord = await loginCursor.ToListAsync();

      if(loginRecord.Count != 1)
        throw new Exception("User dosent exist!");
      var userId = loginRecord[0]["userId"].As<string>();
      return userId;
    } 

    public async Task ChangeMessage(int userid,string newMessage)
    {
      var query = @"
        MATCH (u:User)
        WHERE id(u) = $userId
        SET u.Message = $newMessage";
      
      var parameters = new
      {
        userId = userid,
        newMessage
      };

      using var session = neoService._driver.AsyncSession();
      await session.ExecuteWriteAsync(async tx =>{
        await tx.RunAsync(query,parameters);
      });
    }

    public async Task<User> ReturnUserById(int userId)
    {
       var query = @"
            MATCH (u:User)
            WHERE ID(u) = $userId
            MATCH (u)-[:LIVES_IN]->(city:City)
            MATCH (u)-[:KIDS]->(kids:Kids)
            MATCH (u)-[:PETS]->(pets:Pets)
            MATCH (u)-[:DIET]->(diet:Diet)
            MATCH (u)-[:LOOKING_FOR]->(lf:LookingFor)
            OPTIONAL MATCH (u)-[:INTERESTED_IN]->(interest:Interest)
            RETURN 
                u.gender AS gender,
                u.name AS name, 
                u.surname AS surname, 
                u.age AS age, 
                u.message AS message,
                kids.value AS kids, 
                pets.value AS pets, 
                diet.value AS diet,
                city.value AS city,
                lf.value AS lookingFor,
                COLLECT(DISTINCT interest.value) AS interests";
            
      var parameters = new {userId};

      using var session = neoService._driver.AsyncSession();
      var result = await session.RunAsync(query,parameters);
      var record = await result.SingleAsync();

      var user = new User{
        Gender = record["gender"].As<string>(),
        LookingFor = record["lookingFor"].As<string>(),
        Name = record["name"].As<string>(),
        Surname =  record["surname"].As<string>(),
        Age  =  record["age"].As<int>(),
        Kids = record["kids"].As<string>(),
        Pets =  record["pets"].As<string>(),
        Diet =  record["diet"].As<string>(),
        City = record["city"].As<string>(),
        Interests =  record["interests"].As<List<string>>(),
        Message = record["message"].As<string>()
      };

      return user;
    }

    public async Task<string> GetMessageByUserId(int userId)
    {
      var query = @"
      MATCH (u:User)
      WHERE id(u) = $userId
      RETURN u.message as message";

      using var session = neoService._driver.AsyncSession();
      var result = await session.RunAsync(query,new {userId});
      var record = await result.SingleAsync();

      var ret =record["message"].As<string>();
      return ret;
    }

    public async Task<PreferencesDTO> GetPreferences(int userId)
    {
      var query = @"
      MATCH (u:User)-[:LOOKING_FOR]->(lf:LookingFor)
      MATCH (u:User)-[:PREF_KIDS]->(kids:Kids)
      MATCH (u:User)-[:PREF_PETS]->(pets:Pets)
      MATCH (u:User)-[:PREF_DIET]->(diet:Diet)
      WHERE ID(u) = $userId
      RETURN 
        lf.value AS lookingFor,
        kids.value AS kids, 
        pets.value AS pets, 
        diet.value AS diet;
      ";
      var parameters = new {userId};
      using var session = neoService._driver.AsyncSession();
      var result = await session.RunAsync(query,parameters);
      var record = await result.SingleAsync();

      var pdto = new PreferencesDTO{
        LookingFor = record["lookingFor"].As<string>(),
        Kids = record["kids"].As<string>(),
        Diet = record["diet"].As<string>(),
        Pets = record["pets"].As<string>()
      };

      return pdto;
    }

    public async Task<List<string>> GetInterests(int userId)
    {
      var query = @"
        MATCH (u:User)-[:INTERESTED_IN]->(i:Interest)
        WHERE id(u) = $userId
        RETURN COLLECT(i.value) as interests";
      var parameters = new {userId};
      using var session = neoService._driver.AsyncSession();
      var result = await session.RunAsync(query,parameters);
      var record = await result.SingleAsync();
      return record["interests"].As<List<string>>();
    }

    public async Task PutInterests(int userId,List<string> interests)
    {
      var query = @"
      MATCH (u:User)-[old:INTERESTED_IN]->()
      WHERE ID(u) = $userId
      DELETE old
      WITH u
      UNWIND $interests AS  interest
      MATCH (node:Interest { value: interest })
      MERGE (u)-[:INTERESTED_IN]->(node)";

      var parameters = new {userId, interests};
      using var session = neoService._driver.AsyncSession();
      var result = await session.RunAsync(query,parameters);
    }

    public async Task ChangePreferences(OptionsDTO odto,long userId)
    {
      var query = @"
        MATCH (u:User)-[oDiet:PREF_DIET]->(),
        (u)-[oKids:PREF_KIDS]->(),
        (u)-[oPets:PREF_PETS]->(),
        (k:Kids {value: $kids}),
        (d:Diet {value: $diet}),
        (p:Pets {value: $pets})
        WHERE ID(u)= $userId
        DELETE oDiet,oKids,oPets
        WITH u,d,k,p
        MERGE (u)-[:PREF_DIET]->(d)
        MERGE (u)-[:PREF_KIDS]->(k)
        MERGE (u)-[:PREF_PETS]->(p);
        ";

      var parameters = new {userId, diet = odto.Diet, kids = odto.Kids, pets = odto.Pets};

      using var session = neoService._driver.AsyncSession();
      var result = await session.RunAsync(query,parameters);
    }
  }
}