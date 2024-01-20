
const taskList = document.querySelector(".task-list");
function displayTask(){
    let temData = JSON.parse(localStorage.getItem("tasks"));
    taskList.innerHTML = "";
    if(temData.length > 0){
        for(let task of temData){
            task.missStatus = task.dueDate && task.dueTime ? checkMissStatus(task.id, task.dueDate, task.dueTime) : false;
            let duedate = task.dueDate && task.dueTime ? moment(task.dueDate+" "+task.dueTime).format("MMM Do YYYY, h:mm a"): "";
            const taskObject = `
            <div class="task">
                <div class="task-status">
                    <img id="${task.id}" onclick="changeStatus(this.id)" class="status-logo" 
                        src="${task.completeStatus ? "./images/completed.png" : task.missStatus ? "./images/miss.png" : "./images/pending.jpg"}"/>
                </div>
                <div class="task-info">
                    <div class="task-title">
                        <p>${task.task}</p>
                    </div>
                    <div class="task-controls" >
                        <p>Due ${duedate} </p>
                        <div>
                            <button id="${task.id}" onclick="editTask(this.id)"  class="edit btn">Edit</button>
                            <button id="${task.id}" onclick="deleteTask(this.id)"  class="delete btn">Delete</button>
                        </div>
                    </div>
                </div>
            </div>`;
            taskList.insertAdjacentHTML("beforeend", taskObject);
        }
    }else{
        const taskObject = `
            <div class="no-tasks">
                <p>There Are No Tasks</p>
            </div>
        `;
        taskList.insertAdjacentHTML("beforeend", taskObject);
    }
}
displayTask();


function addTask(){
    let temData = JSON.parse(localStorage.getItem("tasks"))
    let data = temData ? temData : [];
    let taskTitle = document.querySelector(".add-task-title");
    data.unshift(
        {
            id: data.length + 1,
            task: taskTitle.value ? taskTitle.value : "Task",
            dueDate: "",
            dueTime: "",
            completeStatus: false,
            missStatus: false
        }
    )
    localStorage.setItem("tasks", JSON.stringify(data));
    taskTitle.value = "";
    displayTask();
}

function deleteTask(id){
    let temData = JSON.parse(localStorage.getItem("tasks"));
    let data = temData ? temData : [];

    const newData = [];
    for(let task of data){
        if(task.id != id){
            newData.push(task);
        }
    }
    localStorage.setItem("tasks", JSON.stringify(newData));
    displayTask();
}


function changeStatus(id){
    let temData = JSON.parse(localStorage.getItem("tasks"));
    let data = temData ? temData : [];

    for(let task of data){
        if(task.id == id){
            if(!task.completeStatus){
                task.completeStatus = true;
            }
            else{
                task.completeStatus = false;
            }
        }
    }
    localStorage.setItem("tasks", JSON.stringify(data));
    displayTask();
}

function checkMissStatus(id, date, time){
    let result = false;
    if(date && time){
        let givenDateTime = moment(date + " " + time);
        const dateTimeNow = moment(new Date());
        result = (givenDateTime - dateTimeNow) < 0 ? true : false;
    }

    let temData = JSON.parse(localStorage.getItem("tasks"));
    let data = temData ? temData : [];

    for(let task of data){
        if(task.id == id){
            task.missStatus = result;
        }
    }
    localStorage.setItem("tasks", JSON.stringify(data));
    return result;
}

function editTask(id){
    let temData = JSON.parse(localStorage.getItem("tasks"));
    let data = temData ? temData : [];
    for(let task of data){
        if(task.id == id){
            document.querySelector(".edit-form").setAttribute("id", `${task.id}`);
            document.getElementById("title").value = task.task;
            document.getElementById("date-picker").value = task.dueDate ? task.dueDate : "";
            document.getElementById("time-picker").value = task.dueTime ? task.dueTime : "";
        }
    }
    document.querySelector(".hidden").setAttribute("class", "edit-container");
    document.querySelector(".cover-hidden").setAttribute("class", "cover");
}

const form = document.querySelector(".edit-form").addEventListener("submit", saveTask);
function saveTask(event){
    event.preventDefault();
    const id = event.target.id;
    let newTitle = event.target[0].value;
    let newDueDate = event.target[1].value;
    let newDueTime = event.target[2].value;
    const updatedTask = {
        id: id,
        task: newTitle,
        dueDate: newDueDate,
        dueTime: newDueTime,
        completeStatus: false,
        missStatus: false
    }

    let temData = JSON.parse(localStorage.getItem("tasks"));
    let data = temData ? temData : [];

    data = data.map((task)=>{
        if(task.id == id){
            return updatedTask;
        }
        return task
    })
    localStorage.setItem("tasks", JSON.stringify(data));

    document.querySelector(".edit-container").setAttribute("class", "hidden");
    document.querySelector(".cover").setAttribute("class", "cover-hidden");

    displayTask();
}

