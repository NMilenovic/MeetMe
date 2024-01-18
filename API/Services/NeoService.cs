using Neo4j.Driver;

namespace Services
{
  public class NeoService
  {
    public IDriver _driver;

    public NeoService()
    {
      _driver = GraphDatabase.Driver("bolt://localhost:7687",AuthTokens.Basic("neo4j","password"));
    }

    public void Dispose()
    {
        _driver?.Dispose();
    }
  }
}