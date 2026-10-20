// ---------- Edit your content here ----------

// Each event needs a unique "id" (used in the gallery link).
// Date format is "YYYY-MM-DD". Past events move to "Past events" automatically.
// thumbnail: the picture shown in the events list.
// photos: the pictures shown on the event's gallery page. Leave it empty ([]) until you have photos.
// Tip: put each event's pictures in its own folder, e.g. images/events/kolo-night/
const events = [
  {
    id: "welcome-social",
    date: "2026-10-30",
    title: "Welcome Social",
    description: "Meet the club and kick off the year.",
    thumbnail: "images/placeholder/photo-1.jpg",
    photos: [],
  },
  {
    id: "kolo-night",
    date: "2026-11-14",
    title: "Kolo Night",
    description: "Learn the basics of kolo. No experience needed.",
    thumbnail: "images/placeholder/photo-2.jpg",
    photos: [],
  },
  {
    id: "kafana-night",
    date: "2026-12-05",
    title: "Kafana Night",
    description: "Live music and food.",
    thumbnail: "images/placeholder/photo-4.jpg",
    photos: [],
  },
  {
    id: "bozic",
    date: "2027-01-07",
    title: "Božić Celebration",
    description: "Orthodox Christmas get-together.",
    thumbnail: "images/placeholder/photo-5.jpg",
    photos: [],
  },
  {
    id: "end-of-year-social",
    date: "2026-04-10",
    title: "End of Year Social",
    description: "Celebrating the end of the school year.",
    thumbnail: "images/placeholder/photo-3.jpg",
    photos: [
      "images/placeholder/photo-1.jpg",
      "images/placeholder/photo-2.jpg",
      "images/placeholder/photo-3.jpg",
      "images/placeholder/photo-4.jpg",
      "images/placeholder/photo-5.jpg",
      "images/placeholder/photo-6.jpg",
    ],
  },
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
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
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

const galleryUrl = (e) => `gallery.html?event=${encodeURIComponent(e.id)}`;

function dateBadge(when) {
  const month = when.toLocaleDateString("en-CA", { month: "short" });
  return `<div class="date"><span class="m">${month}</span><span class="d">${when.getDate()}</span></div>`;
}

function thumb(e) {
  const src = e.thumbnail || e.photos[0];
  return src
    ? `<img class="thumb" src="${escapeHtml(src)}" alt="" loading="lazy">`
    : `<div class="thumb thumb-empty">${dateBadge(e.when)}</div>`;
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
function eventCard(e) {
  const longDate = e.when.toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const count = e.photos.length;
  return `<li class="event-card${e.when < today ? " past" : ""}">
      <a href="${galleryUrl(e)}" class="thumb-link" aria-label="${escapeHtml(e.title)} gallery">${thumb(e)}</a>
      <div class="event-info">
        <p class="event-date">${longDate}</p>
        <h3>${escapeHtml(e.title)}</h3>
        <p>${escapeHtml(e.description)}</p>
        <a href="${galleryUrl(e)}" class="gallery-link">View gallery${count ? ` (${count})` : ""} &rarr;</a>
      </div>
    </li>`;
}

const upcomingList = document.getElementById("upcoming");
if (upcomingList) {
  upcomingList.innerHTML = upcoming.length
    ? upcoming.map(eventCard).join("")
    : `<li><p class="muted">No upcoming events right now. Check back soon.</p></li>`;
  if (past.length) {
    document.getElementById("past-heading").hidden = false;
    document.getElementById("past").innerHTML = past.map(eventCard).join("");
  }
}

// Gallery page
const gallery = document.getElementById("gallery");
if (gallery) {
  const id = new URLSearchParams(location.search).get("event");
  const e = sortedEvents.find((x) => x.id === id);
  const title = document.getElementById("gallery-title");
  const meta = document.getElementById("gallery-meta");

  if (!e) {
    title.textContent = "Gallery not found";
    meta.innerHTML = `That event doesn't exist. <a href="events.html">See all events</a>.`;
  } else {
    document.title = `${e.title} Gallery | TMU Serbian Student Association`;
    title.textContent = e.title;
    meta.textContent = e.when.toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) + " · " + e.description;

    if (!e.photos.length) {
      gallery.outerHTML = `<p class="muted">${e.when >= today ? "Photos will be posted after the event." : "No photos yet. Check back soon."}</p>`;
    } else {
      gallery.innerHTML = e.photos
        .map((src, i) => `<button class="photo" data-index="${i}" aria-label="Open photo ${i + 1}"><img src="${escapeHtml(src)}" alt="${escapeHtml(e.title)} photo ${i + 1}" loading="lazy"></button>`)
        .join("");

      // Simple photo viewer
      const viewer = document.getElementById("viewer");
      const viewerImg = viewer.querySelector("img");
      const counter = viewer.querySelector(".counter");
      let current = 0;
      const show = (i) => {
        current = (i + e.photos.length) % e.photos.length;
        viewerImg.src = e.photos[current];
        viewerImg.alt = `${e.title} photo ${current + 1}`;
        counter.textContent = `${current + 1} / ${e.photos.length}`;
      };
      gallery.addEventListener("click", (ev) => {
        const btn = ev.target.closest(".photo");
        if (!btn) return;
        show(Number(btn.dataset.index));
        viewer.showModal();
      });
      viewer.querySelector(".prev").addEventListener("click", () => show(current - 1));
      viewer.querySelector(".next").addEventListener("click", () => show(current + 1));
      viewer.querySelector(".close").addEventListener("click", () => viewer.close());
      viewer.addEventListener("click", (ev) => { if (ev.target === viewer) viewer.close(); });
      document.addEventListener("keydown", (ev) => {
        if (!viewer.open) return;
        if (ev.key === "ArrowLeft") show(current - 1);
        if (ev.key === "ArrowRight") show(current + 1);
      });
    }
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
