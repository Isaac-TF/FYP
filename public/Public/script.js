function getNavigation() {
  const start = document.getElementById('startDropdown').value.toLowerCase();
  const destination = document.getElementById('locationDropdown').value.toLowerCase();
  let message = '';
  if (!start || !destination) {
    message = "Please select both a starting point and destination.";
  } else if (start === 'block a') {
    if (destination.includes('ai')) message = "From Block A entrance, go left to reach AI Lab 1.";
    else if (destination.includes('spatial')) message = "Go left past AI Lab to reach Spatial Lab.";
    else message = "Block A route not mapped.";
  } else if (start === 'block b') {
    if (destination.includes('tutorial 1')) message = "Tutorial Room 1 is on the right from Block B entrance.";
    if (destination.includes('tutorial 2')) message = "Tutorial Room 2 is on the right from Block B entrance.";
    else if (destination.includes('tutorial 15')) message = "Tutorial Room 15 is on the left from Block B entrance.";
    else message = "Block B route not mapped.";
  }
  document.getElementById('response').innerText = message;
  if ('speechSynthesis' in window) speechSynthesis.speak(new SpeechSynthesisUtterance(message));
}

document.getElementById('timetableForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const subject = document.getElementById('subject').value;
  const location = document.getElementById('location').value;
  const time = document.getElementById('classTime').value;
  const entry = { subject, location, time };
  const current = JSON.parse(localStorage.getItem('timetable') || '[]');
  current.push(entry);
  localStorage.setItem('timetable', JSON.stringify(current));
  renderTimetable();
  this.reset();
});

function renderTimetable() {
  const tableBody = document.querySelector('#classTable tbody');
  tableBody.innerHTML = '';
  const classes = JSON.parse(localStorage.getItem('timetable') || '[]');
  classes.forEach(c => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${c.subject}</td>
      <td>${c.location}</td>
      <td>${new Date(c.time).toLocaleString()}</td>
    `;
    tableBody.appendChild(row);
  });
}

function sendChat() {
  const input = document.getElementById('chatInput').value.toLowerCase();
  const classes = JSON.parse(localStorage.getItem('timetable') || '[]');
  let reply = 'Sorry, I couldn’t find that.';
  if (input.includes('next class') && classes.length) {
    const upcoming = classes.sort((a, b) => new Date(a.time) - new Date(b.time))[0];
    reply = `Your next class is ${upcoming.subject} at ${upcoming.location} on ${new Date(upcoming.time).toLocaleString()}`;
  } else {
    for (const c of classes) {
      if (input.includes(c.subject.toLowerCase())) {
        reply = `${c.subject} is held at ${c.location} on ${new Date(c.time).toLocaleString()}`;
        break;
      }
    }
  }
  document.getElementById('chatReply').innerText = reply;
  if ('speechSynthesis' in window) {
    const voiceReply = new SpeechSynthesisUtterance(reply);
    speechSynthesis.speak(voiceReply);
  }
}

window.onload = renderTimetable;
