const scheduleTime = "2026-08-29T06:40";
const scheduleDate = new Date(scheduleTime).toISOString();
console.log(scheduleDate);
const dateObj = new Date(scheduleDate);
const pad = (n) => n.toString().padStart(2, '0');
const formattedSchedule = `${dateObj.getFullYear()}-${pad(dateObj.getMonth()+1)}-${pad(dateObj.getDate())} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:${pad(dateObj.getSeconds())}`;
console.log(formattedSchedule);
