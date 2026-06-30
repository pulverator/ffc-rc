const countdownRoot = document.querySelector("[data-target-date]");
const targetDate = new Date(
  countdownRoot?.dataset.targetDate || "2026-09-12T00:00:00+02:00"
);

const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");

function updateCountdown() {
  const now = new Date();
  const rawDifference = targetDate - now;
  const isExpired = rawDifference < 0;
  const difference = Math.abs(rawDifference);

  const totalSeconds = Math.floor(difference / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  document.body.classList.toggle("is-expired", isExpired);

  daysElement.textContent = isExpired ? `−${days}` : days;
  hoursElement.textContent = String(hours).padStart(2, "0");
  minutesElement.textContent = String(minutes).padStart(2, "0");
  secondsElement.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);
