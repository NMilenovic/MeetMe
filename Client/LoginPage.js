import { MatchPage } from "./MatchPage.js";
import { PreferencesPage } from "./PreferencesPage.js";

export class LoginPage{
  constructor(host)
  {
    this.kont = host;
  }

  Draw()
  {
    while(this.kont.firstChild)
      this.kont.removeChild(this.kont.firstChild);

    let div = document.createElement("div");
    div.classList = "BackgroundImage LoginPage";
    this.kont.appendChild(div);

    let centeredDiv = document.createElement("div");
    centeredDiv.className = "centeredDiv";
    div.appendChild(centeredDiv);

    let row = document.createElement("div");
    row.classList = "centeredRow titleRow";
    centeredDiv.appendChild(row);
    let l = document.createElement("label");
    l.innerHTML = "Email"
    row.appendChild(l);

    let input = document.createElement("input");
    input.className = "formInput";
    centeredDiv.appendChild(input);

    row = document.createElement("div");
    row.classList = "centeredRow titleRow";
    centeredDiv.appendChild(row);
    l = document.createElement("label");
    l.innerHTML = "Password"
    row.appendChild(l);

    let passInput = document.createElement("input");
    passInput.type = "password";
    passInput.className = "formInput";
    centeredDiv.appendChild(passInput);

    let button = document.createElement("button");
    button.innerHTML = "Login";
    button.className = "BtnIndex";
    button.onclick = (ev) =>{this.LoginFetch(input.value,passInput.value)}
    centeredDiv.appendChild(button)
  }

  LoginFetch(email,password)
  {
    fetch("http://localhost:5062/User/Login/"+email+"/"+password)
    .then(p =>{
        p.json().then(userId =>{
          fetch("http://localhost:5062/Match/PreferencesExist/"+userId)
          .then(res =>{
            res.json().then(check =>{
              if(check)
              {
                let m = new MatchPage(this.kont,userId);
                m.Draw();
              }
              else 
              {
                let p = new PreferencesPage(this.kont,userId);
                p.DrawFirstTime();
              }
            })
          });
        });
    })
  }
}