const express = require('express');
const calModule = require('./modules/calenderModule');
const dbFunct = require('./modules/dbFunctions.js');

const app = new express();

app.set('view engine', 'ejs');
app.use(express.json()); 
app.use(express.urlencoded());

dbFunct.createDatabaseIfNotExists();

// let currentTime = new Date();
// console.log(currentTime)
// let currentMonth = calModule.getMonthName(currentTime.getMonth());
// console.log(currentMonth);

// let calendarStructure = calModule.getCalendarMonthStructure(10,2025);
// console.log(calendarStructure);

app.get("/", (req, res) =>{
    let dateToday = new Date();

    let calendarStructure = calModule.getCalendarMonthStructure(dateToday.getMonth(), dateToday.getFullYear());
    let todos = dbFunct.loadTodosByDate(dateToday.getMonth() + 1);
    

    for(let i = 0; i < calendarStructure.rows; i++){
        console.log(calendarStructure.layout[i]);
        for(let j = 0; j < 7; j++){            
            if(j in calendarStructure.layout[i])
            {
                let todosOnDate = getTodosOnDate(calendarStructure.layout[i][j].number, todos);
                calendarStructure.layout[i][j].todos = todosOnDate;

                console.log(calendarStructure.layout[i][j]);
            }            
        }
    }
    console.log(calendarStructure);
    res.render("index", {layout: calendarStructure.layout, nextMonth: 12, nextYear: 2025 });
});

app.get("/gotoDate", (req, res) =>{
    let month = req.query.month - 1;
    let year = req.query.year - 1;

    let calendarStructure = calModule.getCalendarMonthStructure(month, year);
    let todos = dbFunct.loadTodosByDate(req.query.month);
    

    for(let i = 0; i < calendarStructure.rows; i++){
        console.log(calendarStructure.layout[i]);
        for(let j = 0; j < 7; j++){            
            if(j in calendarStructure.layout[i])
            {
                let todosOnDate = getTodosOnDate(calendarStructure.layout[i][j].number, todos);
                calendarStructure.layout[i][j].todos = todosOnDate;

                console.log(calendarStructure.layout[i][j]);
            }            
        }
    }
    console.log(calendarStructure);
    res.render("index", {layout: calendarStructure.layout });
});

app.get("/delete", (req,res) => {
    let idToDelete = req.query.identificatie;
    dbFunct.deleteTodoInDB(idToDelete);
    res.redirect("/");
});

app.post("/submit-edit", (req,res) => {
    let todoToModify = {};
    todoToModify.naam = req.body.nameField;  
    todoToModify.taak = req.body.taskField;
    todoToModify.datum = req.body.dateField;
    todoToModify.id = req.body.idField;

    dbFunct.updateTodoInDB(todoToModify.id, todoToModify);
    res.redirect("/");
});

app.post("/submit-form" , (req, res) => {
    let newTodo = {};
    newTodo.naam = req.body.nameField;  
    newTodo.taak = req.body.taskField;
    newTodo.datum = req.body.dateField;

    dbFunct.insertTodoIntoDB(newTodo);

    res.redirect("/");
});

app.listen(3000, "0.0.0.0", () => {
    console.log("Server running");    
});

function getTodosOnDate(number,todos){
    let returnArray = Array();
    for(let i = 0; i < todos.length; i++){
        let datum = new Date(todos[i].datum);
        //console.log("datum is:" + datum);
        if(datum.getDate() == number)
        {
            returnArray.push(todos[i]);
        }
    }

    return returnArray;
}