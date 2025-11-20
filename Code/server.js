const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const dbFunct = require("./modules/dbFunctions.js");
// import { v4 as uuidv4 } from 'uuid';
// import express from 'express';

const app = express();
app.set('view engine', 'ejs');
app.use(express.json()); //middleware to parse JSON body
app.use(express.urlencoded()); //middleware to parse URL-encoded body

dbFunct.createDatabaseIfNotExists();

let todoLijst = dbFunct.loadTodos();

console.log(todoLijst);

app.get("/", (req, res) =>{
    let namen = generateColumnNames(todoLijst);
    res.render("layoutColumns", {namen: namen, taken: todoLijst });
})

app.get("/grid", (req, res) =>{
    //res.send({ taken: taken });
    let data = getNext7Dates();
    data.push("Later");
    data.push("Te laat");
    let modifiedTodoList = modifyDates(todoLijst);
    res.render("layoutGrid", {Data: data,  taken: modifiedTodoList });
})

app.get("/addTodo" , (req, res) => {
    res.render("nieuweTaakForm");
})

app.get("/delete", (req,res) =>{
    let todoTeVewijderenId = req.query.identificatie;
    //let index = todoData.todoLijst.findIndex(todo => todo.id == todoTeVewijderenId);
    dbFunct.deleteTodoInDB(todoTeVewijderenId);
    todoLijst = dbFunct.loadTodos();

    res.redirect("/" + req.query.returnLocation);
})

app.post("/submit", (req, res) => {
    let newId = uuidv4();
    console.log(!req.body.datumVeld.includes('undefined'));

    let nieuweDatum = "";
    //Naar Belgisch formaat en vermijden dat er undefined in staat
    if (req.body.datumVeld && 
        req.body.datumVeld !== 'undefined-undefined-' && 
        req.body.datumVeld.split('-').length === 3)
    {
        let datumSplit = req.body.datumVeld.split("-");
        nieuweDatum = `${datumSplit[2]}-${datumSplit[1]}-${datumSplit[0]}`;
    }    
    
    let newTodo = {"naam": req.body.naamVeld, "taak": req.body.taakVeld, "datum": nieuweDatum, "id": newId};
    console.log(newTodo);
    dbFunct.insertTodoIntoDB(newTodo);
    todoLijst = dbFunct.loadTodos();

    res.redirect('/');    
})

app.post("/updateTodoName", (req, res) =>{
    console.log("updating data");
    let todo = todoLijst.find(todo => todo.id == req.body.id);
    todo.naam = req.body.naam;
    dbFunct.updateTodoInDB(todo.id, todo);

    res.json({ success: true });
});

app.post("/updateTodoDate", (req, res) =>{
    console.log("updating data");
    let todo = todoLijst.find(todo => todo.id == req.body.id);
    todo.datum = req.body.datum;
    dbFunct.updateTodoInDB(todo.id, todo);
   
    res.json({ success: true });
});

app.listen(3000, "0.0.0.0", () => {
    console.log("Server running");    
})

function modifyDates(todolijst)
{
    let clonedList = structuredClone(todolijst);
    clonedList.forEach(todo => {
        const isoFormatDate = todo.datum.split("-").reverse().join("-");
        const dateObject = new Date(isoFormatDate);

        const today = new Date();
        today.setHours(0,0,0,0); //enkel het datum gedeelte
        let eindeWeek = new Date(today);
        eindeWeek.setDate(today.getDate() + 7);

        if(dateObject < today){
            todo.datum = "Te laat";
        }
        else if(dateObject > eindeWeek){
            todo.datum = "Later";
        }
    });

    return clonedList;
}

function generateColumnNames(todolijst)
{
    let columnNames = [];
    todolijst.forEach(taak => {
        if(!columnNames.some(columnName => columnName == taak.naam) && !(taak.naam == "")){
            columnNames.push(taak.naam);
        }
    });

    return columnNames;    
}

function getNext7Dates() {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    const day = String(nextDate.getDate()).padStart(2, '0');
    const month = String(nextDate.getMonth() + 1).padStart(2, '0');
    const year = nextDate.getFullYear();
    dates.push(`${day}-${month}-${year}`);
  }

  return dates;
}

function getTodos(){
    let jsonString = fs.readFileSync('todos.json');
    return JSON.parse(jsonString);
}

function saveTodos(){
    let jsonString = JSON.stringify(todoData);
    fs.writeFileSync("todos.json", jsonString, "utf-8");
}