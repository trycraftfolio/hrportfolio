// main.js — fixes & updates:
// - unified arrow behaviour and prevented focus-jump on arrow buttons
// - added light-mode logo variants per event and load appropriate logo depending on theme
// - ensured Website button gets readable styles in light mode
// - ensured section-3 benefit cards wrap and do not produce horizontal scroll in desktop/mobile

const events = [
  {
    title: "HR Tech MENA Summit",
    date: "6th & 7th May 2026 | Dubai, UAE",
    imgDesktop: "assets/hrtm-c.jpg",
    logo: "assets/hrtm-l.png",
    logoLight: "assets/hrtm-l-light.png", // dummy light logo
    gradient: "linear-gradient(120deg, #0072ff, #00c6ff)",
    accessCode: "HRDXB25",
    link: "https://hrtechmena.com/"
  },
  {
    title: "ATD Middle East Conference",
    date: "June 2026 | Abu Dhabi, UAE",
    imgDesktop: "assets/atdme-c.jpg",
    logo: "assets/atdme-l.png",
    logoLight: "assets/atdme-l-light.png",
    gradient: "linear-gradient(120deg, #ff512f, #cf9b00d6)",
    accessCode: "ATDME",
    link: "https://atdme.com/"
  },
  {
    title: "HR Tech Saudi Summit",
    date: "6th & 7th October 2026 | Riyadh, Saudi Arabia",
    imgDesktop: "assets/hrts-c.jpg",
    logo: "assets/HRTS-logo.png",
    logoLight: "assets/hrts-l-light.png",
    gradient: "linear-gradient(120deg, #000dbeff, #0085cdff)",
    accessCode: "HRYD25",
    link: "https://hrtechsaudi.com/"
  },
  {
    title: "GOV HR Summit",
    date: "21st & 22nd October 2026 | Abu Dhabi, UAE",
    imgDesktop: "assets/govhr-c.jpg",
    logo: "assets/govhr.png",
    logoLight: "assets/govhr-light.png",
    gradient: "linear-gradient(120deg, #6e4600ff, #ba8418ff)",
    accessCode: "GHR25",
    link: "https://hrtechsaudi.com/"
  },
  {
    title: "ATD KSA Conference",
    date: "16th & 17th November 2026 | Dubai, UAE",
    imgDesktop: "assets/atdksa-c.jpg",
    logo: "assets/atdksa-l.png",
    logoLight: "assets/atdksa-l-light.png",
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
  attachAboutPanel();
  attachThemeToggle();
  attachArrowButtonBehaviour();
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
    // choose light-mode logo variant if in light-mode
    const body = document.body;
    logo.src = body.classList.contains("light-mode") && evt.logoLight ? evt.logoLight : evt.logo;

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

    applyGradientToButtons(evt.gradient);
    attachAccessCode(evt.accessCode);
    attachWebsite(evt.link);
    updateDots(idx);
  }, 160);
}

function applyGradientToButtons(gradient) {
  document.querySelectorAll(".portfolio-btn").forEach(btn => {
    btn.style.background = gradient;
    btn.style.color = "#fff";
    btn.style.border = "none";
  });

  const website = document.querySelector(".website-btn");
  const body = document.body;

  if (website) {
    if (body.classList.contains("light-mode")) {
      // readable in light mode: dark subtle background and dark text
      website.style.background = "rgba(15,23,36,0.06)";
      website.style.border = "1px solid rgba(15,23,36,0.08)";
      website.style.color = "var(--light-text)";
      website.style.backdropFilter = "none";
    } else {
      // dark mode appearance
      website.style.background = "rgba(255,255,255,0.12)";
      website.style.border = "1px solid rgba(255,255,255,0.12)";
      website.style.color = "#fff";
      website.style.backdropFilter = "blur(6px)";
    }
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

/* attach arrows: unify behaviour, prevent focus and layout jumps */
function attachArrowButtonBehaviour() {
  const left = document.getElementById("arrowLeft");
  const right = document.getElementById("arrowRight");

  // unify click actions
  if (left) left.addEventListener("click", prevSlide);
  if (right) right.addEventListener("click", nextSlide);

  // add identical pressed visual behavior and prevent focus retaining (prevents jumping)
  [left, right].forEach(btn => {
    if (!btn) return;
    // prevent default focus on mousedown to avoid layout jumps on some browsers
    btn.addEventListener("mousedown", (e) => {
      // allow the click but avoid focus style shifting
      e.preventDefault();
      btn.classList.add("pressed");
    });
    btn.addEventListener("mouseup", () => btn.classList.remove("pressed"));
    btn.addEventListener("mouseleave", () => btn.classList.remove("pressed"));
    btn.addEventListener("touchstart", (e) => {
      // avoid focusing / reflow on touch devices
      e.preventDefault();
      btn.classList.add("pressed");
    }, { passive: false });
    btn.addEventListener("touchend", () => btn.classList.remove("pressed"));

    // prevent keyboard focus style causing layout differences
    btn.addEventListener("focus", () => btn.blur());
  });
}

/* -------------- DOTS -------------- */
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

/* -------------- ALL EVENTS (Hero) --------------
   All cards are equal size to guarantee consistent layout.
*/
function buildAllEvents() {
  const container = document.getElementById("eventCards");
  container.innerHTML = "";
  events.forEach((evt, i) => {
    const card = document.createElement("div");
    card.className = "event-card";
    card.setAttribute("role", "listitem");

    card.innerHTML = `
      <div class="thumb-wrap">
        <img src="${evt.imgDesktop}" alt="${evt.title}">
      </div>
      <div class="card-body">
        <div>
          <h4>${evt.title}</h4>
          <p>${evt.date}</p>
        </div>
        <div class="card-actions">
          <button class="view-btn" onclick="viewEvent(${i})">View</button>
        </div>
      </div>`;

    // subtle accent (keeps the card neutral by default)
    container.appendChild(card);
  });
}

function viewEvent(i) {
  currentIndex = i;
  setEvent(currentIndex);
  document.getElementById("carouselSection").scrollIntoView({ behavior: "smooth" });
}

/* -------------- ABOUT PANEL toggle -------------- */
function attachAboutPanel() {
  const btn = document.getElementById("aboutBtn");
  btn.addEventListener("click", () => {
    let panel = document.querySelector(".about-panel");
    if (!panel) {
      panel = document.createElement("div");
      panel.className = "about-panel active";
      panel.innerHTML = `
        <button class="close-btn about-close" id="closeAbout" title="Close">✕</button>
        <div class="about-inner">
          <h3>Be At The Top Of Your Game</h3>
          <div class="about-content">
            <p>QNA International LLC is a leading global business to business event organizer, continuously innovating knowledge and events business since 2004. We create our events based on market intelligence and industry connections and deliver the best in-class content. We give access to practical case studies while embracing external trends and deliver wow events globally. All this to ‘Be at the Top of your Game’.</p>
            <p>Having delivered successful large scale events across four continents in such a short span of time has earned us a repute globally. Our diverse portfolio of events has something unique for each client to choose from, connecting business minds globally with a intention of business growth is our main goal. QnA International is an industry expert and leader in the field of B2B Events, Summits, Conferences & Trainings. Our passion, positivity and dynamic approach, are the key factors which have contributed to QnA's recognition & growth since its inception. As the indisputable market pioneer, QnA International is always thinking out of the box and creating something unique for each and every partner.</p>
            <p>Our young, dynamic multicultural team is the force behind our success and continues to create new milestones through this journey. QnA International's combined experience of more than 20 years has helped in providing world-class, quality products for its clients. We are focused on delivering excellence in all our projects and have a strong dedication towards achieving the vision and goals of our clients.</p>
            <p>With a growing portfolio of conferences, summits and trainings, ranging from Travel & Tourism to Destination Weddings, Trade Finance to Human Resource and Technology, QnA International caters to a wide range of industries, in correlation with the present and future demands of the global economy. We are driven by passion and a genuine commitment towards providing the highest standard of events while building strong, positive business relationships with our partners and clients. We believe in open communication and evolving with the market, to provide the best industry standard solutions.</p>
            <p>An ever evolving and progressive company, QnA International prides itself in its multi-cultural work environment and philosophy that is strongly based on producing high caliber, unique projects. Transforming the way the events are perceived and created, QnA International delivers impactful experiences that are firmly grounded in its core values and ideologies.</p>
          </div>
        </div>`;
      document.body.appendChild(panel);
      document.getElementById("closeAbout").onclick = () => panel.remove();
    } else {
      panel.classList.toggle("active");
      if (!panel.classList.contains("active")) panel.remove();
    }
  });
}

/* -------------- THEME (light/dark) --------------
   Light mode swaps header logo and adjusts Website button styles for readability.
*/
function attachThemeToggle() {
  const t = document.getElementById("themeToggle");
  const body = document.body;
  const siteLogo = document.getElementById("siteLogo");
  t.onclick = () => {
    const isLight = body.classList.toggle("light-mode");
    t.textContent = isLight ? "☀️" : "🌙";
    // swap page header logo (dummy light logo)
    siteLogo.src = isLight ? "assets/logo-light.png" : "assets/logo.png";

    // update carousel logo for current event immediately
    setEvent(currentIndex);

    // rebuild cards to ensure colors and sizes adapt to theme
    buildAllEvents();
  };
}