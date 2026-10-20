// ---------- Edit your content here ----------

// Date format is "YYYY-MM-DD". Past events are greyed out automatically.
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

document.getElementById("event-list").innerHTML = [...events]
  .sort((a, b) => a.date.localeCompare(b.date))
  .map((e) => {
    const [y, m, d] = e.date.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    const label = date.toLocaleDateString("en-CA", { weekday: "short", month: "long", day: "numeric" });
    return `<li${date < today ? ' class="past"' : ""}>
      <span class="date">${label}</span> · <strong>${escapeHtml(e.title)}</strong>
      <p>${escapeHtml(e.description)}</p>
    </li>`;
  })
  .join("");

document.getElementById("team-list").innerHTML = team
  .map((p) => `<li><strong>${escapeHtml(p.name)}</strong> <span>· ${escapeHtml(p.role)}</span></li>`)
  .join("");

document.getElementById("signup-link").href = signupUrl;
document.getElementById("year").textContent = new Date().getFullYear();
