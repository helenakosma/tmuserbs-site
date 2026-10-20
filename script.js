// ---------- Edit your content here ----------

// Date format is "YYYY-MM-DD". Past events move to "Past events" automatically.
const events = [
  { date: "2026-10-30", title: "Welcome Social", description: "Meet the club and kick off the year." },
  { date: "2026-11-14", title: "Kolo Night", description: "Learn the basics of kolo. No experience needed." },
  { date: "2026-12-05", title: "Kafana Night", description: "Live music and food." },
  { date: "2027-01-07", title: "Božić Celebration", description: "Orthodox Christmas get-together." },
];

const team = [
  { name: "Your Name", role: "President" },
  { name: "Your Name", role: "Vice President" },
  { name: "Your Name", role: "Events Coordinator" },
  { name: "Your Name", role: "Marketing Lead" },
];

// Link to your sign-up form (Google Form, TMU club page, etc.)
const signupUrl = "#";

// ---------------------------------------------

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

const today = new Date();
today.setHours(0, 0, 0, 0);

const sortedEvents = events
  .map((e) => {
    const [y, m, d] = e.date.split("-").map(Number);
    return { ...e, when: new Date(y, m - 1, d) };
  })
  .sort((a, b) => a.when - b.when);
const upcoming = sortedEvents.filter((e) => e.when >= today);
const past = sortedEvents.filter((e) => e.when < today).reverse();

function dateBadge(when) {
  const month = when.toLocaleDateString("en-CA", { month: "short" });
  return `<div class="date"><span class="m">${month}</span><span class="d">${when.getDate()}</span></div>`;
}

function eventItem(e) {
  return `${dateBadge(e.when)}
    <div>
      <h3>${escapeHtml(e.title)}</h3>
      <p>${escapeHtml(e.description)}</p>
    </div>`;
}

// Home page: next event
const nextEvent = document.getElementById("next-event");
if (nextEvent) {
  nextEvent.innerHTML = upcoming.length
    ? `<a href="events.html" class="next-event">${eventItem(upcoming[0])}</a>`
    : `<p class="muted">No upcoming events right now. Check back soon.</p>`;
}

// Events page
const upcomingList = document.getElementById("upcoming");
if (upcomingList) {
  upcomingList.innerHTML = upcoming.length
    ? upcoming.map((e) => `<li>${eventItem(e)}</li>`).join("")
    : `<li><p class="muted">No upcoming events right now. Check back soon.</p></li>`;
  if (past.length) {
    document.getElementById("past-heading").hidden = false;
    document.getElementById("past").innerHTML = past.map((e) => `<li class="past">${eventItem(e)}</li>`).join("");
  }
}

// Team page
const teamList = document.getElementById("team");
if (teamList) {
  teamList.innerHTML = team
    .map((p) => `<li><p class="role">${escapeHtml(p.role)}</p><p class="name">${escapeHtml(p.name)}</p></li>`)
    .join("");
}

document.querySelectorAll("[data-signup]").forEach((a) => (a.href = signupUrl));
document.getElementById("year").textContent = new Date().getFullYear();
