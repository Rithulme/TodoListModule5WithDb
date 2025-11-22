const express = require('express');
const calModule = require('./modules/calenderModule');

const app = new express();

app.set('view engine', 'ejs');
app.use(express.json()); 
app.use(express.urlencoded());

// let currentTime = new Date();
// console.log(currentTime)
// let currentMonth = calModule.getMonthName(currentTime.getMonth());
// console.log(currentMonth);

// let calendarStructure = calModule.getCalendarMonthStructure(10,2025);
// console.log(calendarStructure);

app.get("/", (req, res) =>{
    let calendarStructure = calModule.getCalendarMonthStructure(10,2025);
    res.render("CalendarView", {layout: calendarStructure.layout });
});

app.listen(3000, "0.0.0.0", () => {
    console.log("Server running");    
})

