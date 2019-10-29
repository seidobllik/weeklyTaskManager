
let peopleJSON = '{ "people" : [' +
                '{ "name":"Tom" , "tasks":["fix stuff","this is a really long task. It has a ton of information in it. What\'s the container gonna do?"]},' +
                '{ "name":"Sam" , "tasks":["clean dishes", "do homework"]},' +
                '{ "name":"Devin" , "tasks":["walk dogs"]},' +
                '{ "name":"Juan" , "tasks":["clean patio"]},' +
                '{ "name":"Double-click people to delete" , "tasks":["all tasks of deleted person will also be deleted.", "drag and drop tasks to reassign them."]}' +
                ']}';

let peopleJSON2 = '{ "people" : []}';

function setDate() {
    let monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
                    'October', 'November', 'December'];
    let daysList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let d = new Date();
    let year = d.getFullYear();
    let month = monthsList[d.getMonth()];
    let day = d.getDate();
    let dotw = daysList[d.getDay()];
    let today = dotw + " " + [month] + " " + day + ", " + year;
    let startD = new Date(Number(d));
    startD.setDate(startD.getDate() - (d.getDay() == 1 ? 0 : (d.getDay() === 0 ? 6 : d.getDay() - 1)));
    let endD = new Date(Number(startD));
    endD.setDate(startD.getDate() + 6);
    let rangeString = monthsList[startD.getMonth()] + " " + startD.getDate() + " - " + monthsList[endD.getMonth()] + " " + endD.getDate();
    document.getElementById("today").innerHTML = today;
    document.getElementById("date").innerHTML = rangeString;
}

function newTask() {
    let p = "";
    do {
        p = prompt("Person Name:", "");
    } while (document.getElementById(p) === null && p !== "" && p !== null);
    if (p === "" || p === null) {
        return;
    }  
    let t = prompt("Enter task:", "");
    if (t === "" || t === null) {return;}
    let people = JSON.parse(peopleJSON);
    for (let i=0; i<people.people.length; i++) {
        if (people.people[i].name == p) {
            people.people[i].tasks.push(t);
            peopleJSON = JSON.stringify(people);
            buildPage();
            return;
        }
    }
}

function buildTask(owner, task, taskNumber) {
    let taskInfoDiv = document.createElement("div");
    taskInfoDiv.setAttribute("class", "taskInfoDiv");
    taskInfoDiv.textContent = task;
    let taskItemBtnDiv = document.createElement("div");
    taskItemBtnDiv.setAttribute("class", "itemBtnDiv");
    let taskItemBtn = document.createElement("button");
    taskItemBtn.setAttribute("onclick", "deleteTask(" + taskNumber + ")");
    taskItemBtn.innerHTML = "X";//"&#x1f58a";
    let listItem = document.createElement("li");
    listItem.setAttribute("id", "task-" + taskNumber);
    listItem.setAttribute("draggable", "true");
    listItem.setAttribute("ondragstart", "drag(event)");
    taskItemBtnDiv.appendChild(taskItemBtn);
    listItem.appendChild(taskInfoDiv);
    listItem.appendChild(taskItemBtnDiv);
    document.getElementById(owner).appendChild(listItem);
}

function deleteTask(taskNumber) {
    if (!confirm("Are you sure you want to delete this task?")) {return;}
    let task = document.getElementById("task-" + taskNumber).textContent.slice(0, -1);
    let people = JSON.parse(peopleJSON);
    for (let i=0; i<people.people.length; i++) {
        for (let j=0; j<people.people[i].tasks.length; j++) {
            if (people.people[i].tasks[j] == task) {
                people.people[i].tasks.splice(j, 1);
                peopleJSON = JSON.stringify(people);
                buildPage();
                return;
            }
        }
    }
}

function newPerson() {
    let p = prompt("Enter new name:", "");
    if (p !== "" && p !== null) {
        let people = JSON.parse(peopleJSON);
        for (let i=0; i<people.people.length; i++) {
            if (people.people[i].name == p) {
                alert("Person not created. Cannot have duplicate names!");
                return;
            }
        } 
        people = JSON.parse(peopleJSON);
        people.people.push({"name":p, "tasks": []});
        peopleJSON = JSON.stringify(people);
        buildPage();
    }
}

function buildPerson(name) {
    let nameHeader = document.createElement("h3");
    nameHeader.setAttribute("class", "name");
    nameHeader.innerHTML = name;
    let ulist = document.createElement("ul");
    ulist.setAttribute("class", "task");
    ulist.setAttribute("id", name);
    ulist.setAttribute("ondrop", "drop(event)");
    ulist.setAttribute("ondragover", "allowDrop(event)");
    let personDiv = document.createElement("div");
    personDiv.setAttribute("class", "person");
    personDiv.setAttribute("ondblclick", "deletePerson('" + name + "')");
    personDiv.appendChild(nameHeader);
    personDiv.appendChild(ulist);
    document.getElementById("article").appendChild(personDiv);
}

function deletePerson(name) {
    if (!confirm("Are you sure you want to delete " + name + "? All tasks for that person will also be deleted!")) {return;}
    let people = JSON.parse(peopleJSON);
    for (let i=0; i<people.people.length; i++) {
        if (people.people[i].name == name) {
            people.people.splice(i, 1);
            peopleJSON = JSON.stringify(people);
            buildPage();
            return;
        }
    }
}

function buildPage() {
    let initialTaskCount = 0;
    setDate();
    document.getElementById("article").innerHTML = "";
    let people = JSON.parse(peopleJSON);
    for (let i=0; i<people.people.length; i++) {
        buildPerson(people.people[i].name);
        for (let j=0; j<people.people[i].tasks.length; j++) {
            buildTask(people.people[i].name, people.people[i].tasks[j], (initialTaskCount).toString());
            initialTaskCount++;
        }
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    let task = ev.target.id;
    let origin = ev.target.parentElement.id;
    ev.dataTransfer.setData("text", [task, origin]);
}

function drop(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text").split(",");
    let taskNumber = data[0];
    let origin = data[1];

    // Remove the task from the old owner.
    if (ev.target.className == "task") {
        let t = document.getElementById(taskNumber).textContent.slice(0, -1);
        let p = ev.target.id;
        let people = JSON.parse(peopleJSON);
        for (let i=0; i<people.people.length; i++) {
            if (people.people[i].name == origin) {
                for (let j=0; j<people.people[i].tasks.length; j++) {
                    if (people.people[i].tasks[j] == t) {
                        people.people[i].tasks.splice(j, 1);
                        break;
                    }
                }
            }
        }
        // Add the task to the new owner.
        for (let i=0; i<people.people.length; i++) {
            if (people.people[i].name == p) {
                people.people[i].tasks.push(t);
                peopleJSON = JSON.stringify(people);
                break;
            }
        }
    }
    buildPage();
}
