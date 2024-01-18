import { MatchPage } from "./MatchPage.js";
import { NavBar } from "./NavBar.js";
import { PreferencesDTO } from "./PreferencesDTO.js";

export class PreferencesPage{
  constructor(host,userId)
  {
    this.kont = host,
    this.userId = userId
    
    this.optionsKids = [];
    this.optionsDiet = [];
    this.optionsPets = [];

    this.allInterests = [];

    //Users
    this.uKids;
    this.uDiet;
    this.uPets;
    this.uInterests = [];
  }

  async Draw()
  {
    await this.GetData();

    while(this.kont.firstChild)
    this.kont.removeChild(this.kont.firstChild);

    let div = document.createElement("div");
    div.className = "kont";
    this.kont.appendChild(div);

    let navDiv = document.createElement("div");
    navDiv.className = "navDiv";
    div.appendChild(navDiv);
    let navBar = new NavBar(this.kont,this.userId);
    navBar.Draw(navDiv)

    let preferencesDiv = document.createElement("div");
    preferencesDiv.className = "preferencesDiv";
    div.appendChild(preferencesDiv);

    this.DrawForm(preferencesDiv,false);
  }

  async DrawFirstTime()
  {
    await this.GetOptions();
    while(this.kont.firstChild)
    this.kont.removeChild(this.kont.firstChild);

    let div = document.createElement("div");
    div.className = "kont";
    this.kont.appendChild(div);
    let preferencesDiv = document.createElement("div");
    preferencesDiv.className = "preferencesDiv";
    div.appendChild(preferencesDiv);

    this.DrawForm(preferencesDiv,true);

  }

  async GetOptions()
  {
    var optionsRes = await fetch("http://localhost:5062/Options/GetOptions");
    var options = await optionsRes.json();

    this.optionsDiet = options.dietOptions;
    this.optionsKids = options.kidsOptions;
    this.optionsPets = options.petsOptions;

    var interestsRes = await fetch("http://localhost:5062/Options/GetInterests");
    var json = await interestsRes.json();

    this.allInterests = json.interestsOptions;

  }

  async GetData()
  {
    var optionsRes = await fetch("http://localhost:5062/Options/GetOptions");
    var options = await optionsRes.json();

    this.optionsDiet = options.dietOptions;
    this.optionsKids = options.kidsOptions;
    this.optionsPets = options.petsOptions;

    var interestsRes = await fetch("http://localhost:5062/Options/GetInterests");
    var json = await interestsRes.json();

    this.allInterests = json.interestsOptions;

    var userOptionsPref = await fetch("http://localhost:5062/User/GetPreferences/"+this.userId)
    var preferences = await userOptionsPref.json();

    this.uDiet = preferences.diet;
    this.uKids = preferences.kids;
    this.uPets = preferences.pets;

    var userInterestsRes = await fetch("http://localhost:5062/User/GetInterests/"+this.userId);
    this.uInterests = await userInterestsRes.json();
    
  }

  DrawForm(host,firstTime)
  {
    let centeredDiv = document.createElement("div");
    centeredDiv.className = "sTitle";
    host.appendChild(centeredDiv);

    let l = document.createElement("label");
    l.innerHTML = "Change your match preferences";
    centeredDiv.appendChild(l);

    //Kids
    let row = document.createElement("div");
    row.className = "prefEntry";
    host.appendChild(row);

    l = document.createElement("label");
    l.innerHTML = "Kids: ";
    row.appendChild(l);

    let select = document.createElement("select");
    select.id = "Kids";
    row.appendChild(select);

    let option;
    this.optionsKids.forEach(kid =>{
      option = document.createElement("option");
      option.innerHTML = kid;
      option.value = kid;

      if(this.uKids)
      {
        if(kid == this.uKids)
        option.selected = true;
      }
      
      select.appendChild(option);
    });
    
    //Pets
    row = document.createElement("div");
    row.className = "prefEntry";
    host.appendChild(row);

    l = document.createElement("label");
    l.innerHTML = "Pets: ";
    row.appendChild(l);

    select = document.createElement("select");
    select.id = "Pets";
    row.appendChild(select);

    this.optionsPets.forEach(pet =>{
      option = document.createElement("option");
      option.innerHTML = pet;
      option.value = pet;

      if(this.uPets)
      {
        if(pet == this.uPets)
        option.selected = true;
      }
     

      select.appendChild(option);
    });
    //Diet
    row = document.createElement("div");
    row.className = "prefEntry";
    host.appendChild(row);

    l = document.createElement("label");
    l.innerHTML = "Diet: ";
    row.appendChild(l);

    select = document.createElement("select");
    select.id = "Diet";
    row.appendChild(select);

    this.optionsDiet.forEach(diet =>{
      option = document.createElement("option");
      option.innerHTML = diet;
      option.value = diet;

      if(this.uDiet)
      {
        if(diet == this.uDiet)
        option.selected = true;
      }
      
      select.appendChild(option);
    });

    
    centeredDiv = document.createElement("div");
    centeredDiv.className = "centeredRow";
    host.appendChild(centeredDiv);

    if(firstTime == false)
    {
      l = document.createElement("label");
      l.innerHTML = "Your interests";
      centeredDiv.appendChild(l);  
    }
  
    if(firstTime == false)
    {
    //Interests
    let checkboxDiv = document.createElement("div");
    host.appendChild(checkboxDiv);

    this.allInterests.forEach(interest =>{
      row = document.createElement("div");
      row.className = "row";
      checkboxDiv.appendChild(row);

      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "interest";
      checkbox.value = interest;


      if(this.uInterests.includes(interest))
      {
        checkbox.checked = true;
      }

      l = document.createElement("label");
      l.innerHTML = interest;

      row.appendChild(checkbox);
      row.appendChild(l);
      
    }); 
    }

    //Button
    row = document.createElement("div");
    row.className = "rowForButtons";
    host.appendChild(row);
    let changeBtn = document.createElement("button");

    if(firstTime == false)
    {
     
      changeBtn.innerHTML = "Change preferences";
      changeBtn.classList = "bigButton likeButton"
      row.appendChild(changeBtn); 
      changeBtn.onclick = (ev) => {
        let k = document.querySelector("#Kids");
        let p = document.querySelector("#Pets");
        let d = document.querySelector("#Diet");
        let preferences = new PreferencesDTO(k.value,d.value,p.value);
      this.ChangePreferences(preferences);
      }
    }
    else
    {
      changeBtn.innerHTML = "Set preferences";
      changeBtn.classList = "bigButton likeButton";
      row.appendChild(changeBtn); 
      changeBtn.onclick = (ev) => {
        let k = document.querySelector("#Kids");
        let p = document.querySelector("#Pets");
        let d = document.querySelector("#Diet");
        let preferences = new PreferencesDTO(k.value,d.value,p.value);
      this.SetPreferences(preferences);
      }
    }
    
  }

  ChangePreferences(preferences)
  {
    //Treba mi i looking for
    fetch("http://localhost:5062/User/ChangePreferences/"+this.userId,{
      method: "put",
      headers: {"content-type":"application/json"},
      body: JSON.stringify(preferences)
    })
    .then(p =>{
      let interests = [];
      document.querySelectorAll('input[name=interest]:checked').forEach(interest =>{
        interests.push(String(interest.value));
      })
      fetch("http://localhost:5062/User/PutInterests/"+this.userId,{
        method: "put",
        headers: {"content-type":"application/json"},
        body: JSON.stringify(interests)
      }).then(r =>{
        let prefPage = new PreferencesPage(this.kont,this.userId);
        prefPage.Draw();
      })
    });
    //Loading
  }

  SetPreferences(preferences)
  {
    fetch("http://localhost:5062/Match/SetPreferences/"+this.userId,{
      method: "put",
      headers: {"content-type":"application/json"},
      body: JSON.stringify(preferences)
    })
    .then(p =>{
      let m = new MatchPage(this.kont,this.userId);
      m.Draw();
    })
  }

}