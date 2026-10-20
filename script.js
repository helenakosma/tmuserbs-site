// ============================================================
//  EDIT YOUR CONTENT HERE
// ============================================================

// Events: date is "YYYY-MM-DD". Past events are faded out automatically.
const events = [
  {
    date: "2026-10-30",
    title: "Welcome Social",
    description: "Meet the club, grab some snacks, and kick off the year.",
    tag: "Social",
  },
  {
    date: "2026-11-14",
    title: "Kolo Night",
    description: "Learn the basics of kolo — no experience needed.",
    tag: "Culture",
  },
  {
    date: "2026-12-05",
    title: "Kafana Night",
    description: "Live music, good food, and great company.",
    tag: "Social",
  },
  {
    date: "2027-01-07",
    title: "Božić Celebration",
    description: "Celebrate Orthodox Christmas together.",
    tag: "Culture",
  },
];

// Team: add a photo path (e.g. "images/ana.jpg") or leave it empty to show initials.
const team = [
  { name: "Your Name", role: "President", photo: "" },
  { name: "Your Name", role: "Vice President", photo: "" },
  { name: "Your Name", role: "Events Coordinator", photo: "" },
  { name: "Your Name", role: "Marketing Lead", photo: "" },
];

// Paste your sign-up form link here (Google Form, TMU club page, etc.)
const signupUrl = "#";

// ============================================================

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const today = new Date();
today.setHours(0, 0, 0, 0);

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderEvents() {
  const list = document.getElementById("event-list");
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  list.innerHTML = sorted
    .map((e) => {
      const [y, m, d] = e.date.split("-").map(Number);
      const isPast = new Date(y, m - 1, d) < today;
      return `
        <article class="event reveal${isPast ? " past" : ""}">
          <div class="event-date">
            <span class="month">${months[m - 1]}</span>
            <span class="day">${d}</span>
          </div>
          <div>
            <h3>${escapeHtml(e.title)}</h3>
            <p>${escapeHtml(e.description)}</p>
          </div>
          <span class="event-tag">${isPast ? "Past" : escapeHtml(e.tag)}</span>
        </article>`;
    })
    .join("");
}

function renderTeam() {
  const grid = document.getElementById("team-grid");
  grid.innerHTML = team
    .map((p) => {
      const initials = p.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
      const avatar = p.photo ? `<img src="${escapeHtml(p.photo)}" alt="${escapeHtml(p.name)}">` : initials;
      return `
        <div class="member reveal">
          <div class="avatar">${avatar}</div>
          <h3>${escapeHtml(p.name)}</h3>
          <p>${escapeHtml(p.role)}</p>
        </div>`;
    })
    .join("");
}

function setupNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

function setupReveal() {
  document.querySelectorAll(".section h2, .pillar, .join-card").forEach((el) => el.classList.add("reveal"));
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

renderEvents();
renderTeam();
setupNav();
setupReveal();
document.getElementById("signup-link").href = signupUrl;
document.getElementById("year").textContent = new Date().getFullYear();
