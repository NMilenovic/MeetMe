import { MatchPage } from "./MatchPage.js";
import { MessagesPage } from "./MessagesPage.js";
import { PreferencesPage } from "./PreferencesPage.js";
import { ProfilePage } from "./ProfilePage.js";

export class NavBar{
  constructor(kont,currentId)
  {
    this.kont = kont;
    this.currentId = currentId;
    this.pages = ["Match","Prefereneces","Meet","You"];
  }

  Draw(host)
  {
    this.pages.forEach(page => {

      let button = document.createElement("button");
      let icon = document.createElement("i");
    
    // Add Font Awesome class based on the page
    switch (page) {
      case "Match":
        icon.classList.add("fas", "fa-heart","fa-2xl");
        break;
      case "Prefereneces":
        icon.classList.add("fas", "fa-gears","fa-2xl");
        break;
      case "Meet":
        icon.classList.add("fas", "fa-at","fa-2xl");
        break;
      case "You":
        icon.classList.add("fas", "fa-user","fa-2xl");
        break;
      default:
        // Default icon class (you can customize this)
        icon.classList.add("fas", "fa-question","fa-2xl");
    }
      button.appendChild(icon);
      button.onclick = (ev) =>{this[page]();} 
      
      if(page === "You"){
        button.innerHTML += "About "+page;
      }
      else{
        button.innerHTML +=page;
      }
      button.className = "navBtn";
      host.appendChild(button);
    });
  }

  Match()
  {
    var m = new MatchPage(this.kont,this.currentId);
    m.Draw()
  }
  Prefereneces()
  {
    var pref = new PreferencesPage(this.kont,this.currentId);
    pref.Draw();
  }
  Meet()
  {
   var mes = new MessagesPage(this.kont,this.currentId);
   mes.Draw();
  }
  You()
  {
    var pro = new ProfilePage(this.kont,this.currentId);
    pro.Draw();
  }
  

}