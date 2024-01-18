import { NavBar } from "./NavBar.js";

export class MessagesPage{
  constructor(kont,userId)
  {
    this.kont = kont;
    this.userId = userId;
  }

  async Draw()
  {
    while(this.kont.firstChild)
      this.kont.removeChild(this.kont.firstChild);

    let div = document.createElement("div");
    div.className = "messagesPage";
    this.kont.appendChild(div);

    let navDiv = document.createElement("div");
    navDiv.className = "navDiv";
    div.appendChild(navDiv);
    let navBar = new NavBar(this.kont,this.userId);
    navBar.Draw(navDiv)

    let messagesDiv = document.createElement("div");
    messagesDiv.className = "messagesDiv";
    div.appendChild(messagesDiv);

    fetch("http://localhost:5062/Match/GetAllMatchedMessages/"+this.userId)
    .then(p =>{
      p.json().then(messagesList =>{
        console.log(messagesList);
        messagesList.forEach(entry =>{
          fetch("http://localhost:5062/User/GetUserById/"+entry.id)
          .then(p =>{
            p.json().then(user =>{
              let divForMessage = document.createElement("div");
              divForMessage.className = "divForMessage";
              messagesDiv.appendChild(divForMessage);

              let l = document.createElement("label")
              l.innerHTML =user.name+" "+user.surname+": Meet me @"+entry.message;
              divForMessage.appendChild(l);

              let removeBtn = document.createElement("button");
              let i = document.createElement("i");
              i.classList =  "fa-solid fa-trash";
              removeBtn.appendChild(i);
              removeBtn.className = "rmvBtn";
              divForMessage.appendChild(removeBtn);
              removeBtn.onclick = (ev) =>{this.RemoveMatch(entry.id,divForMessage);}
            });
          });
        })
      });
    });
  }

  RemoveMatch(match,host)
  {
    fetch("http://localhost:5062/Match/RemoveMatch/"+this.userId+"/"+match,{
      method:"delete",
      headers:{"content-type":"application/json"}
    })
    .then(p =>{
      host.remove();
    })
  }
}