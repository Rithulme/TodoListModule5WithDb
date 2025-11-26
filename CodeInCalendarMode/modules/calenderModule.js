function getHeader(month, year){
  const months = [
    "Januari", "Februari", "Maart", "April", "Mei", "Juni",
    "Juli", "Augustus", "September", "Oktober", "November", "December"
  ];

  // Convert 1–12 to index 0–11
  return months[month] + " " + year; 
}

function getFirstDayOfMonth(month, year){
  let firstDay = new Date(year, month, 1);

  //maandag eerste dag ipv zondag
  firstDayPosition = (firstDay.getDay() + 6) % 7;

  return firstDayPosition;
}

function getDaysInMonth(month, year) { //truc de 0-de dag van een maand wordt automatisch de laatste. Als we dan de dag vragen hebben we het nummer van de laatste dag
  return new Date(year, month, 0).getDate();
}

function getCalendarMonthStructure(month, year){
  let firstDayPosition = getFirstDayOfMonth(month, year);
  let daysInMonth = getDaysInMonth(month, year);
 
  let counter = 0
  let firstWeek = Array(7);
  let calendarStructure = {};

  for(let i = firstDayPosition; i < 7; i++)
  {
    counter++;
    firstWeek[i] = {};
    firstWeek[i].number = counter;
  }

  calendarStructure.layout = [firstWeek];
  calendarStructure.rows = 1;

  while(counter + 7 + 1 < daysInMonth)
  {
    calendarStructure.layout = addFullWeek(calendarStructure.layout, counter);
    counter = counter + 7; //counter wordt hierboven niet 'by reference' doorgegeven, dus ook hier nog verhogen
    calendarStructure.rows++;
  }

  let lastWeek = Array(7);
  let remainingDays = daysInMonth - counter - 1; //geen counter gebruiken in de for loop!!

  for(let i = 0; i < remainingDays; i++)
  {
    counter++;
    lastWeek[i] = {};
    lastWeek[i].number = counter; 
  }

  calendarStructure.layout.push(lastWeek);
  calendarStructure.rows++;

  return calendarStructure;
}

function addFullWeek(layout, counter){
  let week = Array(7);
  for(let i = 0; i < 7; i++)
  {
    counter++;
    week[i] = {};
    week[i].number = counter; 
  }

  layout.push(week);

  return layout;
}

function getButtonReferences(month, year){
  let returnData = {};
  if(month == 11){
    returnData.nextMonth = 0;
    returnData.previousMonth = 10;
    returnData.nextYear = year + 1;
    returnData.previousYear = year;
  }
  else if(month == 0){
    returnData.nextMonth = 1;
    returnData.previousMonth = 11;
    returnData.nextYear = year;
    returnData.previousYear = year - 1;
  }
  else{
    returnData.nextMonth = month + 1;
    returnData.previousMonth = month - 1;
    returnData.nextYear = year;
    returnData.previousYear = year;
  }

  return returnData;
}



module.exports = {
    getHeader,
    getCalendarMonthStructure,
    getButtonReferences
};