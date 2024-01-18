import { NavBar } from "./NavBar.js";
import { User } from "./User.js";

export class ProfilePage{
  constructor(host,userId)
  {
    this.kont = host;
    this.userId = userId;
    this.user;
  }

  async Draw()
  {
   await this.GetUser();  

   this.DrawForm();



  }
  async GetUser()
  {
   const response = await fetch("http://localhost:5062/User/GetUserById/" + this.userId);

   try 
   {
    const user = await response.json();
    this.user = new User(
      user.gender,
        user.name,
        user.surname,
        user.age,
        user.city,
        user.lookingFor,
        user.kids,
        user.pets,
        user.diet,
        user.interests,
        user.message);
      }
     catch(error){
      console.error("Error parsing JSON",error);
    }
  }
  DrawForm()
  {
    while(this.kont.firstChild)
      this.kont.removeChild(this.kont.firstChild);

    let profilePage = document.createElement("div");
    profilePage.className = "ProfilePage";
    this.kont.appendChild(profilePage);

    let navDiv = document.createElement("div");
    navDiv.className = "navDiv";
    profilePage.appendChild(navDiv);
    let navBar = new NavBar(this.kont,this.userId);
    navBar.Draw(navDiv)

    let profileDiv = document.createElement("div");
    profileDiv.className = "ProfileDiv";
    profilePage.appendChild(profileDiv);
    
    let topDiv = document.createElement("div");
    topDiv.className = "topDiv";
    profileDiv.appendChild(topDiv);

    let topLeft = document.createElement("div");
    topLeft.className = "column";
    topDiv.appendChild(topLeft);

    let topRight = document.createElement("div");
    topRight.className = "column";
    topDiv.appendChild(topRight);

    //Name
    let row = document.createElement("div");
    row.className = "simpleRow";
    topLeft.appendChild(row);
    let l = document.createElement("label");
    l.innerHTML = "First name: "+this.user.name;
    row.appendChild(l);
    //Surname
    row = document.createElement("div");
    row.className = "simpleRow";
    topLeft.appendChild(row);
    l = document.createElement("label");
    l.innerHTML = "Last name: "+this.user.surname;
    row.appendChild(l);
    //Gender
    row = document.createElement("div");
    row.className = "simpleRow";
    topLeft.appendChild(row);
    l = document.createElement("label");
    l.innerHTML = "Gender: "+this.user.gender;
    row.appendChild(l);
    //Age
    row = document.createElement("div");
    row.className = "simpleRow";
    topLeft.appendChild(row);
    l = document.createElement("label");
    l.innerHTML = "Age: "+this.user.age;
    row.appendChild(l);
    //LookingFor
    row = document.createElement("div");
    row.className = "simpleRow";
    topLeft.appendChild(row);
    l = document.createElement("label");
    l.innerHTML = "Looking for: "+this.user.lookingFor;
    row.appendChild(l);

    //Desna strana
    //Kids
    row = document.createElement("div");
    row.className = "simpleRow";
    topRight.appendChild(row);
    l = document.createElement("label");
    l.innerHTML = "Kids: "+this.user.kids;
    row.appendChild(l);
    //Pets
    row = document.createElement("div");
    row.className = "simpleRow";
    topRight.appendChild(row);
    l = document.createElement("label");
    l.innerHTML = "Pets: "+this.user.pets;
    row.appendChild(l);
    //Diet
    row = document.createElement("div");
    row.className = "simpleRow";
    topRight.appendChild(row);
    l = document.createElement("label");
    l.innerHTML = "Diet: "+this.user.diet;
    row.appendChild(l);
    //Instagram
    row = document.createElement("div");
    row.className = "simpleRow";
    topRight.appendChild(row);
    l = document.createElement("label");
    l.innerHTML = "Instagram: "+this.user.message;
    row.appendChild(l);

    let bottomDiv = document.createElement("div");
    bottomDiv.className = "bottomDiv";
    profileDiv.appendChild(bottomDiv);

    let lab = document.createElement("label");
    lab.innerHTML = "Interested in";
    bottomDiv.appendChild(lab);

    let interestesDiv = document.createElement("div");
    interestesDiv.className = "interestesDiv";
    bottomDiv.appendChild(interestesDiv);

    this.user.interests.forEach(interest =>{
      l = document.createElement("label");
      l.innerHTML = interest;
      interestesDiv.appendChild(l);
    })

    

    
  }


}