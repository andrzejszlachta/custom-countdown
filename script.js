const submitBtn = document.getElementById('submit');
const resetBtn = document.getElementById('reset');
const newCountdown = document.getElementById('newCountdown');

const titleInput = document.getElementById('title');
const dateInput = document.getElementById('date');

const mainScreen = document.getElementById('inputs-container');
const countdownScreen = document.getElementById('countdown-container');
const completeScreen = document.getElementById('complete-container');

const countdownHeading = document.getElementById('countdown-heading');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

const completeTitle = document.getElementById('complete-title');
const completeDate = document.getElementById('complete-date');

let title, date;

// flash red border on incorrect input
function flashInput(element) {
  element.style.boxShadow = '0px 0px 0px 2px #f00';
  setTimeout(() => {
    element.style.boxShadow = '';
  }, 1000);
}

// check if inputs are correct
function validateInputs() {
  let isInvalid = false;
  if (!titleInput.value.length) {
    flashInput(titleInput)
    isInvalid = true;
  }
  if (!dateInput.value.length) {
    flashInput(dateInput)
    isInvalid = true;
  }
  return isInvalid
}

// if timer hit zero - switch to complete screen
function completeCountdown() {
  countdownScreen.hidden = true;
  completeScreen.hidden = false;
  completeTitle.textContent = titleInput.value;
  completeDate.textContent = dateInput.value.replace("T", " ");
  localStorage.removeItem('countdownTitle');
  localStorage.removeItem('countdownDate');
  title = null;
  date = null;
};

// update DOM timer
function updateTimer(leftTime) {
  const days = Math.floor(leftTime / (3600000 * 24));
  const hours = Math.floor((leftTime - (days * 3600000 * 24)) / 3600000);
  const minutes = Math.floor((leftTime - ((days * 3600000 * 24) + (hours * 3600000))) / 60000);
  const seconds = Math.floor((leftTime - ((days * 3600000 * 24) + (hours * 3600000) + (minutes * 60000))) / 1000);
  daysEl.textContent = days;
  hoursEl.textContent = hours;
  minutesEl.textContent = minutes;
  secondsEl.textContent = seconds;
}

let stopCountdown = false;

// start countdown
function startCountdown() {
  mainScreen.hidden = true;
  countdownScreen.hidden = false;
  title = localStorage.getItem('countdownTitle');
  date = localStorage.getItem('countdownDate');
  countdownHeading.textContent = title.length >= 30 ? title.slice(0, 30) : title;
  const dateMS = new Date(date);
  const targetDate = dateMS.getTime();
  // update countdown timer
  updateTimer(targetDate - Date.now());
  const updateCountdown = setInterval(() => {
    const nowDate = Date.now();
    const leftTime = targetDate - nowDate;
    // finish countdown
    if (leftTime < 1000)  {
      clearInterval(updateCountdown)
      completeCountdown();
    }
    // stop countdown if click reset button
    if (stopCountdown) clearInterval(updateCountdown);
    updateTimer(leftTime)
  }, 1000);
}

// trigger countdown
function triggerCountdown(e) {
  e.preventDefault();
  stopCountdown = false;
  const isInvalid = validateInputs();
  if (isInvalid) return;
  title = titleInput.value;
  date = dateInput.value;
  localStorage.setItem('countdownTitle', titleInput.value);
  localStorage.setItem('countdownDate', dateInput.value);
  startCountdown();
}

// reset countdown
function resetCountdown() {
  countdownScreen.hidden = true;
  completeScreen.hidden = true;
  mainScreen.hidden = false;
  stopCountdown = true;
  titleInput.value = null;
  dateInput.value = null;
  title = null;
  date = null;
  localStorage.removeItem('countdownTitle');
  localStorage.removeItem('countdownDate');
}

// start countdown on page load if already stored locally
function checkCountdown() {
  title = localStorage.getItem('countdownTitle');
  date = localStorage.getItem('countdownDate');
  if (title && date) startCountdown();
}

// on load
checkCountdown();

// event listeners
submitBtn.addEventListener('click', triggerCountdown);
resetBtn.addEventListener('click', resetCountdown);
newCountdown.addEventListener('click', resetCountdown);