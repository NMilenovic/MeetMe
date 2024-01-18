import { NavBar } from "./NavBar.js";

export class MatchPage{
  constructor(kont,userId)
  {
    this.kont = kont;
    this.userId = userId;
    this.potentialMatchesId = [];
    this.potentialMatches = [];
  }

  async Draw()
  {
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

    let matchDiv = document.createElement("div");
    matchDiv.className = "matchDiv";
    div.appendChild(matchDiv);

    //50 po pozivu na backend da stavima
    try {
      let response = await fetch(
        "http://localhost:5062/Match/GetPotentialMatches/" + this.userId
      );
      let pMatches = await response.json();
      this.potentialMatchesId = pMatches;
      
      for (let userId of pMatches) 
      {
        let userResponse = await fetch(
          "http://localhost:5062/User/GetUserById/" + userId
        );
        let user = await userResponse.json();
        this.potentialMatches.push(user);
      };

    } catch (error) {
      console.error("Error fetching data:", error);
    }

    this.DrawMatch(matchDiv)



  }

  DrawMatch(host)
  {
    while(host.firstChild)
      host.removeChild(host.firstChild);

    if(!this.potentialMatches[0])
      return;

    let centeredRow = document.createElement("div");
    centeredRow.classList = "centeredRow title";
    host.appendChild(centeredRow);

    let l = document.createElement("label");
    l.innerHTML = this.potentialMatches[0].name+" "+this.potentialMatches[0].surname;
    centeredRow.appendChild(l);
    let top = document.createElement("div");
    top.className = "top";
    host.appendChild(top);
    let leftTop = document.createElement("div");
    leftTop.className = "leftTop";
    top.appendChild(leftTop);

    let rightTop = document.createElement("div");
    rightTop.className = "rightTop";
    top.appendChild(rightTop);
    //Age
    let row = document.createElement("div");
    row.className = "row";
    leftTop.appendChild(row);

    l = document.createElement("label");
    l.innerHTML = "Age: "+this.potentialMatches[0].age;
    row.appendChild(l);

    //Gender
    row = document.createElement("div");
    row.className = "row";
    leftTop.appendChild(row);

    l = document.createElement("label");
    l.innerHTML = "Gender: "+this.potentialMatches[0].gender; 
    row.appendChild(l);
    //City
    row = document.createElement("div");
    row.className = "row";
    leftTop.appendChild(row);

    l = document.createElement("label");
    l.innerHTML = "City: "+this.potentialMatches[0].city;
    row.appendChild(l);

    //Diet
    row = document.createElement("div");
    row.className = "row";
    rightTop.appendChild(row);

    l = document.createElement("label");
    l.innerHTML = "Diet: "+this.potentialMatches[0].diet;
    row.appendChild(l);

    //Kids
    row = document.createElement("div");
    row.className = "row";
    rightTop.appendChild(row);

    l = document.createElement("label");
    l.innerHTML = "Kids: "+this.potentialMatches[0].kids;
    row.appendChild(l);

    //Pets
    row = document.createElement("div");
    row.className = "row";
    rightTop.appendChild(row);

    l = document.createElement("label");
    l.innerHTML = "Pets: "+this.potentialMatches[0].pets;
    row.appendChild(l);

    let bottom = document.createElement("div");
    bottom.className = "bottom";
    host.appendChild(bottom);

    //Interests
    row = document.createElement("div");
    row.className = "centeredRow";
    bottom.appendChild(row);

    l = document.createElement("label");
    l.innerHTML = "Interests:";
    row.appendChild(l);

    let interestsDiv = document.createElement("div");
    interestsDiv.className = "interestsDiv";
    bottom.appendChild(interestsDiv);

    let intDiv;
    let intLab;
    this.potentialMatches[0].interests.forEach(interest =>{
      intDiv = document.createElement("div");
      intDiv.className = "intDiv";

      intLab = document.createElement("label");
      intLab.innerHTML = interest;
      intDiv.appendChild(intLab);
      interestsDiv.appendChild(intDiv);
    });

    let rowForButtons = document.createElement("div");
    rowForButtons.className = "rowForButtons";
    host.appendChild(rowForButtons);

    let button = document.createElement("button");
    button.innerHTML = "Skip";
    button.classList = "bigButton skipButton"
    button.onclick = (ev) =>{this.Skip(host)}
    rowForButtons.appendChild(button);
    
    button = document.createElement("button");
    button.innerHTML = "Like";
    button.classList = "bigButton likeButton"
    button.onclick = (ev) =>{this.Like(host)}
    rowForButtons.appendChild(button);
  }

  Skip(host)
  {
    fetch("http://localhost:5062/Match/DislikeUser/"+this.userId+"/"+this.potentialMatchesId[0],{
      method: "post",
      headers: {"Content-Type":"application/json"}
    })
    .then(p =>{
      this.potentialMatchesId.shift();
      this.potentialMatches.shift();
      this.DrawMatch(host);
    })
  }

  Like(host)
  {
    fetch("http://localhost:5062/Match/LikeUser/"+this.userId+"/"+this.potentialMatchesId[0],{
      method: "post",
      headers: {"Content-Type":"application/json"}
    })
    .then(p =>{
      
      p.text().then(match =>{
        console.log(match);
        if(match == "Yes")
        {
          
          alert("ITS A MATCH!");
        }
        this.potentialMatchesId.shift();
        this.potentialMatches.shift();
        this.DrawMatch(host);
      })
    })
  }

}