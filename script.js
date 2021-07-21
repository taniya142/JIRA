let addBtn = document.querySelector(".add");
let body = document.querySelector("body");

let grid = document.querySelector(".grid");

let colors = ["yellow", "green", "blue", "black"];

let allFilterChildren = document.querySelectorAll(".filter div");

for(let i=0;i<allFilterChildren.length;i++){
    allFilterChildren[i].addEventListener("click",function(e){
        if(e.currentTarget.classList.contains("color-selected")){
            e.currentTarget.classList.remove("color-selected");
            loadTasks();
            return;
        }
        else{
            e.currentTarget.classList.add("color-selected");
        }
        let filterColor = e.currentTarget.classList[0];
        loadTasks(filterColor)
    })
}

let delBtn = document.querySelector(".delete");

let deleteMode = false;

if(localStorage.getItem("AllTickets")==undefined){
    let allTickets = {};

    allTickets = JSON.stringify(allTickets);

    localStorage.setItem("AllTickets",allTickets)
}

loadTasks();

delBtn.addEventListener("click",function(e){
   if(e.currentTarget.classList.contains("delete-selected")){
       e.currentTarget.classList.remove("delete-selected");
       deleteMode = false;
   }else{
    e.currentTarget.classList.add("delete-selected");
    deleteMode = true;
   }


})

addBtn.addEventListener("click",function(){

    delBtn.classList.remove("delete-selected");
    deleteMode=false;

    let div = document.createElement("div");

    let preModal = document.querySelector(".modal");

    if (preModal != null) return;

    div.classList.add("modal");

    div.innerHTML=`
    <div class="task-section">
        <div class="task-inner-container" contenteditable="true"></div>
    </div>
    <div class="priority-section">
        <div class="priority-inner-container">
            <div class="modal-priority yellow"></div>
            <div class="modal-priority green"></div>
            <div class="modal-priority blue"></div>
            <div class="modal-priority black selected"></div>
        </div>
    </div>`

    let ticketColor = "black";

    let allModalPriority = div.querySelectorAll(".modal-priority");

    for (let i = 0; i < allModalPriority.length; i++) {
            allModalPriority[i].addEventListener("click", function (e) {

        for (let j = 0; j < allModalPriority.length; j++) {
            allModalPriority[j].classList.remove("selected");
         }

      e.currentTarget.classList.add("selected");
      ticketColor = e.currentTarget.classList[1];
    //   console.log(ticketColor);

    });
    }

    let taskInnerContainer = div.querySelector(".task-inner-container");

    taskInnerContainer.addEventListener("keydown",function(e){
        if(e.key=="Enter"){

            let id =uid();
            let task = e.currentTarget.innerText;


            let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

            let ticketObj = {
                color: ticketColor,
                taskValue:  task,
            };

            allTickets[id]=ticketObj;

            localStorage.setItem("AllTickets",JSON.stringify(allTickets));
            

            let ticketDiv = document.createElement("div");
            ticketDiv.classList.add("ticket");

            ticketDiv.setAttribute("data-id",id);


            ticketDiv.innerHTML = `<div data-id="${id}" class="ticket-color ${ticketColor}"></div>
            <div class="ticket-id">#${id}</div>
            <div data-id="${id}" class="actual-task" contenteditable="true">
            ${task}
            </div>`

            let ticketColorDiv = ticketDiv.querySelector(".ticket-color")

            let actualTaskDiv = ticketDiv.querySelector(".actual-task");
            actualTaskDiv.addEventListener("input",function(e){
                let updatedTask = e.currentTarget.innerText;

                let currTicketId = e.currentTarget.getAttribute("data-id");

                let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
                allTickets[currTicketId].taskValue=updatedTask;
                localStorage.setItem("AllTickets",JSON.stringify(allTickets));

            })

            

                ticketColorDiv.addEventListener("click",function(e){

                let currTicketId = e.currentTarget.getAttribute("data-id");


                let currColor = e.currentTarget.classList[1]
                let index = -1;
                for(let i=0;i<colors.length;i++){
                    if(colors[i]==currColor)
                        index=i;
                }
                index++;
                index=index%4;

                let newColor = colors[index];

                let allTickets = JSON.parse(localStorage.getItem("AllTickets"));            //get/fetch

                allTickets[currTicketId].color=newColor;                                    //updata

                localStorage.setItem("AllTickets",JSON.stringify(allTickets));              //save

                ticketColorDiv.classList.remove(currColor);
                ticketColorDiv.classList.add(newColor);
                
            })

            ticketDiv.addEventListener("click",function(e){
                if(deleteMode == true){

                    let currTickedId = e.currentTarget.getAttribute("data-id");

                    let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
                    delete allTickets[currTickedId];

                    localStorage.setItem("AllTickets",JSON.stringify(allTickets));

                    e.currentTarget.remove();
                }
            })

            grid.append(ticketDiv);

            div.remove();
        }
        else if(e.key==="Escape"){
            div.remove();
        }
    })

    body.append(div);
})

//----------------------------------------------------------------------------------------------------------------------------------------

function loadTasks(color) {
    let ticketsOnUi = document.querySelectorAll(".ticket");
  
    for (let i = 0; i < ticketsOnUi.length; i++) {
      ticketsOnUi[i].remove();
    }
  
    //1- fetch alltickets data
  
    let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
  
    //2- create ticket UI for each ticket obj
    //3- attach required listeners
    //4- add tickets in the grid section of ui
  
    for (x in allTickets) {
      let currTicketId = x;
      let singleTicketObj = allTickets[x]; //pink
  
      //passed color was black
      if (color) {
        if (color != singleTicketObj.color) continue;
      }
  
      let ticketDiv = document.createElement("div");
      ticketDiv.classList.add("ticket");
  
      ticketDiv.setAttribute("data-id", currTicketId);
  
      ticketDiv.innerHTML = ` <div data-id="${currTicketId}" class="ticket-color ${singleTicketObj.color}"></div>
        <div class="ticket-id">
          #${currTicketId}
        </div>
        <div data-id="${currTicketId}" class="actual-task" contenteditable="true">
          ${singleTicketObj.taskValue}
        </div>`;
  
      let ticketColorDiv = ticketDiv.querySelector(".ticket-color");
  
      let actualTaskDiv = ticketDiv.querySelector(".actual-task");
  
      actualTaskDiv.addEventListener("input", function (e) {
        let updatedTask = e.currentTarget.innerText;
  
        let currTicketId = e.currentTarget.getAttribute("data-id");
        let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
  
        allTickets[currTicketId].taskValue = updatedTask;
  
        localStorage.setItem("AllTickets", JSON.stringify(allTickets));
      });
  
      ticketColorDiv.addEventListener("click", function (e) {
        // let colors = ["pink", "blue", "green", "black"];
  
        let currTicketId = e.currentTarget.getAttribute("data-id");
  
        let currColor = e.currentTarget.classList[1]; //green
  
        let index = -1;
        for (let i = 0; i < colors.length; i++) {
          if (colors[i] == currColor) index = i;
        }
  
        index++;
        index = index % 4;
  
        let newColor = colors[index];
  
        //1- all tickets lana ; 2- update krna ; 3- wapis save krna
  
        let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
  
        allTickets[currTicketId].color = newColor;
  
        localStorage.setItem("AllTickets", JSON.stringify(allTickets));
  
        ticketColorDiv.classList.remove(currColor);
        ticketColorDiv.classList.add(newColor);
      });
  
      ticketDiv.addEventListener("click", function (e) {
        if (deleteMode) {
          let currTicketId = e.currentTarget.getAttribute("data-id");
  
          e.currentTarget.remove();
  
          let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
  
          delete allTickets[currTicketId];
  
          localStorage.setItem("AllTickets", JSON.stringify(allTickets));
        }
      });
  
      grid.append(ticketDiv);
    }
  }