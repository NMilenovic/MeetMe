import { LoginPage } from "./LoginPage.js";
import { RegisterPage } from "./RegisterPage.js";

export class IndexPage
{
  constructor(host)
  {
    this.kont = host;
  }

  Draw()
  {
    while(this.kont.firstChild)
      this.kont.removeChild(this.kont.firstChild);

    let div = document.createElement("div");
    div.className = "BackgroundImage";
    this.kont.appendChild(div);

    let row = document.createElement("div");
    row.className = "TitleLab";
    div.appendChild(row);
    let lab = document.createElement("label");
    lab.innerHTML = "MEET ME!";
    row.appendChild(lab);
    

    row = document.createElement("div");
    row.className = "BtnLoginDiv";
    div.appendChild(row);
    let btn = document.createElement("button");
    btn.innerHTML = "Login";
    btn.className = "BtnIndex";
    btn.onclick = (ev) =>{
      let loginPage = new LoginPage(this.kont);
      loginPage.Draw();
    }
    row.appendChild(btn);

    row = document.createElement("div");
    row.className = "BtnRegisterDiv";
    div.appendChild(row);
    btn = document.createElement("button");
    btn.innerHTML = "Register";
    btn.className = "BtnIndex";
    btn.onclick = (ev) =>{
      let registerPage = new RegisterPage(this.kont);
      registerPage.Draw();
    }
    row.appendChild(btn);
  }
}