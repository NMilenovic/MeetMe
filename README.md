Za pokretanje aplikacije neophodno je:

- dotnet 8.0 (Za pokretanje API-a).
- Neo4j Driver, zavisnost za Neo4j dotnet client.
- Neo4j Community-5.15  Self-Managed baza podataka.
- Live server ekstenzija za Visual Studio Code (za hostovanje frontend aplikacije).


Pokretanje:
- Pokrenuti Neo4j instancu, aplikacija komunicira sa njom na portu 7687.  
- SAMO PRILIKOM PRVOG POKRETANJA: U Neo4j konzoli na lokaciji http://localhost:7474 izvršiti query iz fajla InitalData.txt
- Na lokaciji "./API/" izvršiti komandu "dotnet watch run" za startovanje API-a.
- Pokrenuti live server.

