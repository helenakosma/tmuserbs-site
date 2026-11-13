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

// Add photo: "images/team/name.jpg" to show a picture instead of initials.
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

// Event card (home carousel + events page)
function eventCard(e) {
  const isPast = e.when < today;
  const src = e.thumbnail || e.photos[0] || "images/placeholder/photo-1.jpg";
  const month = e.when.toLocaleDateString("en-CA", { month: "short" }).replace(".", "");
  const weekday = e.when.toLocaleDateString("en-CA", { weekday: "long" });
  const more = isPast
    ? `View gallery${e.photos.length ? ` (${e.photos.length})` : ""} <span aria-hidden="true">→</span>`
    : `Details <span aria-hidden="true">→</span>`;
  return `<a href="${galleryUrl(e)}" class="ecard${isPast ? " past" : ""}" data-reveal>
      <img src="${escapeHtml(src)}" alt="" loading="lazy">
      <span class="ecard-date"><b>${e.when.getDate()}</b><small>${month}</small></span>
      <p class="ecard-meta">${isPast ? e.when.getFullYear() : weekday}</p>
      <h3>${escapeHtml(e.title)}</h3>
      <p>${escapeHtml(e.description)}</p>
      <span class="ecard-more">${more}</span>
    </a>`;
}
const noEvents = `<p class="empty">No upcoming events right now. Follow <a href="https://instagram.com/tmuserbs" target="_blank" rel="noopener">@tmuserbs</a> so you don't miss the next one.</p>`;

// Home: upcoming events carousel
const rail = document.getElementById("event-rail");
if (rail) {
  if (upcoming.length) {
    rail.innerHTML = upcoming.slice(0, 8).map(eventCard).join("");
  } else {
    rail.outerHTML = `<div class="wrap">${noEvents}</div>`;
  }
}

// Events page
const upcomingList = document.getElementById("upcoming");
if (upcomingList) {
  upcomingList.innerHTML = upcoming.length ? upcoming.map(eventCard).join("") : noEvents;
  if (past.length) {
    document.getElementById("past-section").hidden = false;
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
      gallery.outerHTML = `<p class="empty">${e.when >= today ? "Photos will be posted after the event." : "No photos yet. Check back soon."}</p>`;
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
    .map((p, i) => {
      const initials = p.name.split(/\s+/).map((w) => w[0] || "").join("").slice(0, 2).toUpperCase();
      const picture = p.photo
        ? `<img src="${escapeHtml(p.photo)}" alt="${escapeHtml(p.name)}" loading="lazy">`
        : `<span class="initials" aria-hidden="true">${escapeHtml(initials)}</span>`;
      return `<li data-reveal style="--d:${(i % 4) * 0.08}s"><div class="portrait">${picture}</div><p class="role">${escapeHtml(p.role)}</p><p class="name">${escapeHtml(p.name)}</p></li>`;
    })
    .join("");
}

// Sign-up links + footer year
document.querySelectorAll("[data-signup]").forEach((a) => (a.href = signupUrl));
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Mobile menu
const nav = document.querySelector(".nav");
const menuBtn = document.querySelector(".menu-btn");
if (nav && menuBtn) {
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.textContent = open ? "Close" : "Menu";
  });
}

// Fade sections in as they scroll into view
const revealItems = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealItems.forEach((el) => io.observe(el));
} else {
  revealItems.forEach((el) => el.classList.add("in"));
}

// Soft spotlight that follows the cursor on tiles
document.querySelectorAll(".tile").forEach((tile) => {
  tile.addEventListener("pointermove", (ev) => {
    const r = tile.getBoundingClientRect();
    tile.style.setProperty("--mx", `${ev.clientX - r.left}px`);
    tile.style.setProperty("--my", `${ev.clientY - r.top}px`);
  });
});
