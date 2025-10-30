const events = [
  {
    title: "HR Tech MENA Summit",
    date: "6th & 7th May 2026 | Dubai, UAE",
    imgDesktop: "assets/hrtm-c.jpg",
    logo: "assets/hrtm-l.png",
    gradient: "linear-gradient(120deg, #0072ff, #00c6ff)",
    accessCode: "HRDXB25",
    link: "https://hrtechmena.com/"
  },
  {
    title: "ATD Middle East Conference",
    date: "June 2026 | Abu Dhabi, UAE",
    imgDesktop: "assets/atdme-c.jpg",
    logo: "assets/atdme-l.png",
    gradient: "linear-gradient(120deg, #ff512f, #cf9b00d6)",
    accessCode: "ATDME",
    link: "https://atdme.com/"
  },
  {
    title: "HR Tech Saudi Summit",
    date: "6th & 7th October 2026 | Riyadh, Saudi Arabia",
    imgDesktop: "assets/hrts-c.jpg",
    logo: "assets/HRTS-logo.png",
    gradient: "linear-gradient(120deg, #000dbeff, #0085cdff)",
    accessCode: "HRYD25",
    link: "https://hrtechsaudi.com/"
  },
  {
    title: "GOV HR Summit",
    date: "21st & 22nd October 2026 | Abu Dhabi, UAE",
    imgDesktop: "assets/govhr-c.jpg",
    logo: "assets/govhr.png",
    gradient: "linear-gradient(120deg, #6e4600ff, #ba8418ff)",
    accessCode: "GHR25",
    link: "https://hrtechsaudi.com/"
  },
  {
    title: "ATD KSA Conference",
    date: "16th & 17th November 2026 | Dubai, UAE",
    imgDesktop: "assets/atdksa-c.jpg",
    logo: "assets/atdksa-l.png",
    gradient: "linear-gradient(120deg, #654ea3, #9980d1ff)",
    accessCode: "ATDKSA",
    link: "https://atdksa.com/"
  }
];

let currentIndex = 0;

window.addEventListener("DOMContentLoaded", () => {
  setEvent(0);
  renderDots();
  buildAllEvents();
  attachAllEventsPanel();
});

/* -------------- CAROUSEL / EVENT DISPLAY -------------- */
function setEvent(idx) {
  const evt = events[idx];
  const img = document.getElementById("carouselImage");
  const date = document.getElementById("eventDate");
  const logo = document.getElementById("eventLogo");
  const btnRow = document.getElementById("buttonRow");
  const bg = document.getElementById("bgBlur");
  const titleEl = document.getElementById("eventTitle");

  img.style.opacity = 0;
  logo.style.opacity = 0;

  setTimeout(() => {
    img.src = evt.imgDesktop;
    logo.src = evt.logo;
    bg.style.backgroundImage = `url('${evt.imgDesktop}')`;

    titleEl.textContent = evt.title;
    date.textContent = evt.date;

    btnRow.innerHTML = `
      <button class="portfolio-btn">PSR</button>
      <button class="portfolio-btn">Brochure</button>
      <button class="portfolio-btn">Packages</button>
      <button class="portfolio-btn">Video</button>
      <button class="portfolio-btn access-toggle" id="accessCodeBtn">Access Code</button>
      <button class="portfolio-btn website-btn" id="websiteBtn" title="Visit website">🌐 Website</button>
    `;

    img.onload = () => (img.style.opacity = 1);
    logo.onload = () => (logo.style.opacity = 1);

    applyGradient(evt.gradient);
    attachAccessCode(evt.accessCode);
    attachWebsite(evt.link);
    updateDots(idx);
  }, 160);
}

function applyGradient(gradient) {
  // style all primary buttons with gradient (except those overridden)
  document.querySelectorAll(".portfolio-btn").forEach(btn => {
    btn.style.background = gradient;
  });

  // make the website button slightly different (semi-transparent white overlay) but keep gradient accents
  const website = document.querySelector(".website-btn");
  if (website) {
    website.style.background = "rgba(255,255,255,0.12)";
    website.style.border = "1px solid rgba(255,255,255,0.12)";
    website.style.backdropFilter = "blur(6px)";
    website.style.color = "#fff";
  }
}

function attachAccessCode(code) {
  const btn = document.getElementById("accessCodeBtn");
  if (!btn) return;
  let active = false;
  btn.onclick = () => {
    active = !active;
    if (active) {
      btn.textContent = code;
      btn.classList.add("on");
      if (navigator.clipboard) navigator.clipboard.writeText(code);
      showToast("Access code copied!");
    } else {
      btn.textContent = "Access Code";
      btn.classList.remove("on");
    }
  };
}

function attachWebsite(url) {
  const w = document.getElementById("websiteBtn");
  if (!w) return;
  w.onclick = () => {
    window.open(url || "#", "_blank");
  };
}

function showToast(msg) {
  const t = document.createElement("div");
  t.className = "copy-toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => (t.style.opacity = 1), 20);
  setTimeout(() => {
    t.style.opacity = 0;
    setTimeout(() => t.remove(), 400);
  }, 2000);
}

function nextSlide() { currentIndex = (currentIndex + 1) % events.length; setEvent(currentIndex); }
function prevSlide() { currentIndex = (currentIndex - 1 + events.length) % events.length; setEvent(currentIndex); }
document.getElementById("arrowLeft").onclick = prevSlide;
document.getElementById("arrowRight").onclick = nextSlide;

function renderDots() {
  const footer = document.querySelector(".footer");
  const dotContainer = document.createElement("div");
  dotContainer.className = "dots";
  dotContainer.innerHTML = events.map((_, i) => `<span class="dot" data-index="${i}"></span>`).join("");
  footer.parentNode.insertBefore(dotContainer, footer);
  document.querySelectorAll(".dot").forEach(dot => dot.addEventListener("click", () => {
    currentIndex = parseInt(dot.dataset.index);
    setEvent(currentIndex);
  }));
  updateDots(0);
}
function updateDots(activeIndex) {
  document.querySelectorAll(".dot").forEach((dot, i) => dot.classList.toggle("active", i === activeIndex));
}

/* -------------- ALL EVENTS (Hero) -------------- */
function buildAllEvents() {
  const container = document.getElementById("eventCards");
  container.innerHTML = "";
  events.forEach((evt, i) => {
    const card = document.createElement("div");
    card.className = "event-card";
    // ensure thumbnail is fully visible
    card.innerHTML = `
      <div class="thumb-wrap">
        <img src="${evt.imgDesktop}" alt="${evt.title}">
      </div>
      <div class="card-body">
        <h4>${evt.title}</h4>
        <p>${evt.date}</p>
        <div class="card-actions">
          <button class="view-btn" onclick="viewEvent(${i})">View</button>
        </div>
      </div>`;
    container.appendChild(card);
  });
}

function viewEvent(i) {
  currentIndex = i;
  setEvent(currentIndex);
  document.getElementById("carouselSection").scrollIntoView({ behavior: "smooth" });
}

/* -------------- All Events Panel toggle (kept simple) -------------- */
function attachAllEventsPanel() {
  const btn = document.getElementById("allEventsBtn");
  btn.addEventListener("click", () => {
    // toggle an overlay modal panel for all events (simple)
    let panel = document.querySelector(".events-panel");
    if (!panel) {
      panel = document.createElement("div");
      panel.className = "events-panel active";
      panel.innerHTML = `
        <h3>All Events</h3>
        <div class="event-cards overlay-cards" id="overlayCards"></div>
        <button class="close-btn" id="closeEvents">Close</button>`;
      document.body.appendChild(panel);
      const overlayCards = panel.querySelector("#overlayCards");
      events.forEach((evt, i) => {
        const el = document.createElement("div");
        el.className = "event-card";
        el.innerHTML = `
          <img src="${evt.imgDesktop}" alt="${evt.title}">
          <div class="card-body">
            <h4>${evt.title}</h4>
            <p>${evt.date}</p>
            <button class="view-btn" onclick="(function(){ document.querySelector('.events-panel').remove(); viewEvent(${i}); })()">View</button>
          </div>`;
        overlayCards.appendChild(el);
      });
      document.getElementById("closeEvents").onclick = () => panel.remove();
    } else {
      panel.classList.toggle("active");
      if (!panel.classList.contains("active")) panel.remove();
    }
  });
}
