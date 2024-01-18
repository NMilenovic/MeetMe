//Draw za crtanje forme
//Fetch za logovanje

import { LoginPage } from "./LoginPage.js";
import { RegisterDTO } from "./RegisterDTO.js";

//Kad se fetcuje treba se otvori medjustrana za login
export class RegisterPage{
  constructor(host)
  {
    this.kont = host;
    this.cities = [];
    this.optionsDiet = [];
    this.optionsKids = [];
    this.optionsPets = [];
    this.optionsLookingFor = [];
    this.allInterests = [];
  }

  async Draw(){
    await this.GetData();

    while(this.kont.firstChild)
      this.kont.removeChild(this.kont.firstChild);

    let div = document.createElement("div");
    div.className = "BackgroundImage RegisterPage";
    this.kont.appendChild(div);

    let credentialDiv = document.createElement("div");
    credentialDiv.className = "credentialDiv";
    div.appendChild(credentialDiv);

    //Email
    let row = document.createElement("div");
    row.className = "row";
    credentialDiv.appendChild(row);
    let label = document.createElement("label");
    let input = document.createElement("input");
    input.className = "selEmail";
    input.placeholder = "Your email";
    row.appendChild(input);

    //Password
    row = document.createElement("div");
    row.className = "row";
    credentialDiv.appendChild(row);
    input = document.createElement("input");
    input.type = "password";
    input.className = "selPassword";
    input.placeholder = "Your password";
    row.appendChild(input);


    let aboutMeDiv = document.createElement("div");
    aboutMeDiv.className = "aboutMeDiv";
    div.appendChild(aboutMeDiv);

    let aboutMeLeftHalf = document.createElement("div");
    aboutMeLeftHalf.className = "aboutMeLeftHalf";
    aboutMeDiv.appendChild(aboutMeLeftHalf);

    let aboutMeRightHalf = document.createElement("div");
    aboutMeRightHalf.className = "aboutMeRightHalf";
    aboutMeDiv.appendChild(aboutMeRightHalf);
    //Gender
    label = document.createElement("label");
    label.innerHTML = "Gender: ";
    aboutMeRightHalf.appendChild(label);

    let select = document.createElement("select");
    select.className = "selGender";
    let op = document.createElement("option");
    op.innerHTML = "M";
    op.value = "M";
    select.appendChild(op);

    op = document.createElement("option");
    op.innerHTML = "F";
    op.value = "F";
    select.appendChild(op);
    aboutMeRightHalf.appendChild(select);

    //Name
    row = document.createElement("div");
    row.className = "row";
    aboutMeLeftHalf.appendChild(row);
    input = document.createElement("input");
    input.className = "selName";
    input.placeholder = "Your first name";
    row.appendChild(input);

    //Surname
    row = document.createElement("div");
    row.className = "row";
    aboutMeLeftHalf.appendChild(row);
    input = document.createElement("input");
    input.className = "selSurname";
    input.placeholder = "Your last name";
    row.appendChild(input); 

    //Age
    row = document.createElement("div");
    row.className = "row";
    aboutMeLeftHalf.appendChild(row);
    input = document.createElement("input");
    input.className = "selAge";
    input.placeholder = "Your age";
    row.appendChild(input);

    //Cities
    label = document.createElement("label");
    label.innerHTML = "From: ";
    aboutMeRightHalf.appendChild(label);

    select = document.createElement("select");
    select.className = "selCity";
    this.cities.forEach(city =>{
      op = document.createElement("option");
      op.value = city;
      op.innerHTML = city;
      select.appendChild(op);
    });
    aboutMeRightHalf.appendChild(select);

    let prefDiv = document.createElement("div")
    prefDiv.className = "prefDiv";
    div.appendChild(prefDiv);
    //Looking for
    row = document.createElement("div");
    row.className = "row";
    prefDiv.appendChild(row);
    label = document.createElement("label");
    label.innerHTML = "Looking for: ";
    row.appendChild(label);

    select = document.createElement("select");
    select.className = "selLookingFor";
    this.optionsLookingFor.forEach(lf =>{
      op = document.createElement("option");
      op.value = lf;
      op.innerHTML = lf;
      select.appendChild(op);
    });
    row.appendChild(select);

    //Kids
    row = document.createElement("div");
    row.className = "row";
    prefDiv.appendChild(row);
    label = document.createElement("label");
    label.innerHTML = "Kids status: ";
    row.appendChild(label);

    select = document.createElement("select");
    select.className = "selKids";
    this.optionsKids.forEach(kid =>{
      op = document.createElement("option");
      op.value = kid;
      op.innerHTML = kid;
      select.appendChild(op);
    });
    row.appendChild(select);

    //Pets
    row = document.createElement("div");
    row.className = "row";
    prefDiv.appendChild(row);
    label = document.createElement("label");
    label.innerHTML = "Pets status: ";
    row.appendChild(label);

    select = document.createElement("select");
    select.className = "selPets";
    this.optionsPets.forEach(pet =>{
      op = document.createElement("option");
      op.value = pet;
      op.innerHTML = pet;
      select.appendChild(op);
    });
    row.appendChild(select);

    //Diet
    row = document.createElement("div");
    row.className = "row";
    prefDiv.appendChild(row);
    label = document.createElement("label");
    label.innerHTML = "Your diet: ";
    row.appendChild(label);

    select = document.createElement("select");
    select.className = "selDiet";
    this.optionsDiet.forEach(diet =>{
      op = document.createElement("option");
      op.value = diet;
      op.innerHTML = diet;
      select.appendChild(op);
    });
    row.appendChild(select);

    let interestDiv = document.createElement("div");
    interestDiv.className = "interestDiv";
    div.appendChild(interestDiv);
    //Interests
    let checkboxDiv = document.createElement("div");
    checkboxDiv.className = "checkboxDiv";
    interestDiv.appendChild(checkboxDiv);

    label = document.createElement("label");
    label.innerHTML = "Interested in";
    checkboxDiv.appendChild(label);

    this.allInterests.forEach(interest =>{
      row = document.createElement("div");
      row.className = "checkboxEntry";
      checkboxDiv.appendChild(row);

      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "interest";
      checkbox.value = interest;  

      label = document.createElement("label");
      label.innerHTML = interest;

      row.appendChild(label);
      row.appendChild(checkbox);
    }); 

    //Instagram
    row = document.createElement("div");
    row.className = "instaDiv";
    div.appendChild(row);
    let icon = document.createElement("i");
    icon.classList = "icon fa-brands fa-instagram fa-lg";
    row.appendChild(icon);
    input = document.createElement("input");
    input.placeholder = "Your instagram username";
    input.className = "selInsta";
    row.appendChild(input);

    row = document.createElement("div");
    row.className = "regBtn";
    div.appendChild(row);
    let btn = document.createElement("button");
    btn.innerHTML = "Register";
    btn.className = "BtnIndex";
    btn.onclick = (ev) =>{this.Register()}
    row.appendChild(btn);
    

  }



  async GetData(){
    var optionsRes = await fetch("http://localhost:5062/Options/GetOptions");
    var options = await optionsRes.json();

    this.optionsDiet = options.dietOptions;
    this.optionsKids = options.kidsOptions;
    this.optionsPets = options.petsOptions;
    this.optionsLookingFor = options.lookingForOptions;

    var interestsRes = await fetch("http://localhost:5062/Options/GetInterests");
    var json = await interestsRes.json();

    this.allInterests = json.interestsOptions;

    var citiesRes = await fetch("http://localhost:5062/Options/GetCities");
    this.cities = await citiesRes.json();
  }

  Register()
  {
    let email = document.querySelector(".selEmail").value;
    let pass = document.querySelector(".selPassword").value;
    let gender = document.querySelector(".selGender").value;
    let name = document.querySelector(".selName").value;
    let surname = document.querySelector(".selSurname").value;
    let age = Number(document.querySelector(".selAge").value);
    let city = document.querySelector(".selCity").value;
    let lookingFor = document.querySelector(".selLookingFor").value;
    let kid = document.querySelector(".selKids").value;
    let pet = document.querySelector(".selPets").value;
    let diet = document.querySelector(".selDiet").value;
    let checkedBoxes = [];
    document.querySelectorAll('input[name=interest]:checked').forEach(checkbox =>{
      checkedBoxes.push(checkbox.value);
    });
    console.log(checkedBoxes);
    let message = document.querySelector(".selInsta").value;

    if(email === "" || pass === "" || name === "null" || surname === "" || age === "" || message === "" )
    {
      alert("Please enter all informations!")
      return;
    }

    if(isNaN(age))
    {
      alert("Age must be a number!");
      return;

    }
    if(age < 18)
    {
      alert("You must be over 18 to use this application.");
      return;
    }
    if(checkedBoxes.length == 0)
    {
      alert("You have to chose at least 1 interest!")
      return;
    }

    let rtdo = new RegisterDTO(email,pass,gender,name,surname,age,city,lookingFor,kid,pet,diet,checkedBoxes,message);
    fetch("http://localhost:5062/User/Register",{
      method: "post",
      headers: {"content-type":"application/json"},
      body: JSON.stringify(rtdo)
    })
    .then(p =>{
      var l = new LoginPage(this.kont);
      l.Draw();
    });
  }
}