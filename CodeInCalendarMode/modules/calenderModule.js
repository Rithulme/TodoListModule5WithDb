function getMonthName(num) {
  const months = [
    "Januari", "Februari", "Maart", "April", "Mei", "Juni",
    "Juli", "Augustus", "September", "Oktober", "November", "December"
  ];

  // Convert 1–12 to index 0–11
  return months[num] || null; 
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

module.exports = {
    getMonthName,
    getCalendarMonthStructure
};