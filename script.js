/* ================= PAGE NAVIGATION ================= */

function goToLogin() {
  const landing = document.getElementById("landingPage");
  const loginPage = document.getElementById("loginPage");

  if (!landing || !loginPage) return;

  landing.style.display = "none";
  loginPage.style.display = "flex";
}

/* ================= AUTH (DEMO) ================= */

function signup() {
  localStorage.setItem("ecoUserEmail", email.value);
  localStorage.setItem("ecoUserPassword", password.value);
  message.innerText = "Signup successful. Please login.";
}

function login() {
  if (
    email.value === localStorage.getItem("ecoUserEmail") &&
    password.value === localStorage.getItem("ecoUserPassword")
  ) {
    window.location.href = "dashboard.html";
  } else {
    message.innerText = "Invalid credentials";
  }
}

/* ================= LOCATION (FIXED) ================= */

function requestLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const loc = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude
      };
      localStorage.setItem("userLocation", JSON.stringify(loc));
      alert("Location saved ✔");
    },
    () => {
      alert("Location permission denied");
    }
  );
}

/* ================= ROUTE MEMORY ================= */

function saveRoute() {
  const fromInput = document.getElementById("fromPlace");
  const toInput = document.getElementById("toPlace");
  const distanceInput = document.getElementById("distance");

  if (!fromInput || !toInput || !distanceInput) return;

  const from = fromInput.value.trim();
  const to = toInput.value.trim();
  const distance = distanceInput.value;

  if (!from || !to || !distance) {
    if (distanceMsg) distanceMsg.innerText = "Fill all travel fields";
    return;
  }

  let routes = JSON.parse(localStorage.getItem("routes")) || [];

  const exists = routes.some(
    r => r.from.toLowerCase() === from.toLowerCase() &&
         r.to.toLowerCase() === to.toLowerCase()
  );

  if (!exists) {
    routes.push({ from, to, distance });
    localStorage.setItem("routes", JSON.stringify(routes));
  }

  if (distanceMsg) distanceMsg.innerText = "Route saved ✓";
}

/* ================= ROUTE AUTO-FILL ================= */

function setupRouteAutofill() {
  const fromInput = document.getElementById("fromPlace");
  const toInput = document.getElementById("toPlace");
  const distanceInput = document.getElementById("distance");

  if (!fromInput || !toInput || !distanceInput) return;

  function autofill() {
    const from = fromInput.value.trim().toLowerCase();
    const to = toInput.value.trim().toLowerCase();

    const routes = JSON.parse(localStorage.getItem("routes")) || [];
    const match = routes.find(
      r => r.from.toLowerCase() === from &&
           r.to.toLowerCase() === to
    );

    if (match) {
      distanceInput.value = match.distance;
      if (distanceMsg) distanceMsg.innerText = "Distance auto-filled ✓";
    }
  }

  fromInput.addEventListener("blur", autofill);
  toInput.addEventListener("blur", autofill);
}

/* ================= VEHICLE IMAGE + TIP ================= */

document.addEventListener("DOMContentLoaded", () => {
  setupRouteAutofill();

  const transportSelect = document.getElementById("transport");
  if (!transportSelect) return;

  transportSelect.addEventListener("change", () => {
    const img = document.getElementById("vehicleImage");
    const tip = document.getElementById("vehicleTip");

    const map = {
      walk: ["847969", "Best choice! Zero emissions 🌱"],
      cycle: ["3068735", "Healthy & eco-friendly 🚴"],
      bike: ["1048313", "Moderate emissions ⚠️"],
      car: ["741407", "High emissions 🚨"],
      bus: ["61212", "Shared travel is better 🚌"]
    };

    if (map[transportSelect.value]) {
      img.src =
        "https://cdn-icons-png.flaticon.com/512/" +
        map[transportSelect.value][0] + ".png";
      tip.innerText = map[transportSelect.value][1];
    }
  });
});

/* ================= ECO CALCULATION ================= */

let streakCount = Number(localStorage.getItem("streak")) || 0;
let bestStreakCount = Number(localStorage.getItem("bestStreak")) || 0;
let totalDaysCount = Number(localStorage.getItem("totalDays")) || 0;

function calculateEco() {
  const veg = +document.getElementById("veg")?.value || 0;
  const nonveg = +document.getElementById("nonveg")?.value || 0;
  const light = +document.getElementById("light")?.value || 0;
  const fan = +document.getElementById("fan")?.value || 0;
  const ac = +document.getElementById("ac")?.value || 0;

  const transport = document.getElementById("transport")?.value;
  const vehicle = document.getElementById("vehicle")?.value;

  let ecoPoints = 100;

  ecoPoints += veg * 5;
  ecoPoints -= nonveg * 8;
  ecoPoints -= light * 1;
  ecoPoints -= fan * 2;
  ecoPoints -= ac * 10;

  if (transport === "walk" || transport === "cycle") ecoPoints += 20;
  if (transport === "bike") ecoPoints -= 5;
  if (transport === "car") ecoPoints -= 20;
  if (transport === "bus") ecoPoints -= 8;

  if (vehicle === "electric") ecoPoints += 10;
  if (vehicle === "petrol") ecoPoints -= 10;

  ecoPoints = Math.max(0, Math.min(100, ecoPoints));

  localStorage.setItem("ecoPoints", ecoPoints);

  streakCount++;
  bestStreakCount = Math.max(bestStreakCount, streakCount);
  totalDaysCount++;

  localStorage.setItem("streak", streakCount);
  localStorage.setItem("bestStreak", bestStreakCount);
  localStorage.setItem("totalDays", totalDaysCount);

  window.location.href = "dashboard.html";
}

/* ================= DASHBOARD LOAD ================= */

document.addEventListener("DOMContentLoaded", () => {
  const ecoResultEl = document.getElementById("ecoResult");
  if (!ecoResultEl) return;

  const eco = Number(localStorage.getItem("ecoPoints")) || 0;
  ecoResultEl.innerText = eco;

  const ecoLevelEl = document.getElementById("ecoLevel");
  const ecoBar = document.getElementById("ecoBar");

  let text = "", cls = "";

  if (eco < 40) { text = "❌ Not Eco-Friendly"; cls = "eco-bad"; }
  else if (eco < 65) { text = "⚠️ Needs Improvement"; cls = "eco-average"; }
  else if (eco < 85) { text = "✅ Eco-Friendly"; cls = "eco-good"; }
  else { text = "🌿 Very Eco-Friendly"; cls = "eco-excellent"; }

  ecoLevelEl.innerText = text;
  ecoLevelEl.className = cls;
  ecoBar.style.width = eco + "%";

  document.getElementById("streakText").innerText = streakCount + " days";
  document.getElementById("badgeText").innerText =
    eco >= 80 ? "Green Champion" : "Beginner";
});

/* ================= PROGRESS PAGE ================= */

document.addEventListener("DOMContentLoaded", () => {
  const totalDaysEl = document.getElementById("totalDays");
  if (!totalDaysEl) return;

  totalDaysEl.innerText = totalDaysCount;
  document.getElementById("bestStreak").innerText = bestStreakCount;
  document.getElementById("ecoLevelProgress").innerText =
    document.getElementById("ecoLevel")?.innerText || "—";
});
/* ================= GRAPHS ================= */

document.addEventListener("DOMContentLoaded", () => {

  /* WEEKLY GRAPH */
  const weeklyData = JSON.parse(localStorage.getItem("weeklyEco")) || [9, 11, 10, 8, 7, 6, 8];

  const weeklyCtx = document.getElementById("weeklyChart");
  if (weeklyCtx) {
    new Chart(weeklyCtx, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
          label: "kg CO₂",
          data: weeklyData,
          fill: true,
          borderColor: "#2e7d32",
          backgroundColor: "rgba(46,125,50,0.15)",
          tension: 0.4
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: false } }
      }
    });
  }

  /* MONTHLY GRAPH */
  const monthlyData = JSON.parse(localStorage.getItem("monthlyEco")) || [62, 58, 54, 50];

  const monthlyCtx = document.getElementById("monthlyChart");
  if (monthlyCtx) {
    new Chart(monthlyCtx, {
      type: "bar",
      data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [{
          label: "kg CO₂",
          data: monthlyData,
          backgroundColor: ["#2e7d32", "#43a047", "#66bb6a", "#81c784"]
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
});
