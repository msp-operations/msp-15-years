/* MSP 15 Years · page behaviour. All state lives in CONFIG; edit, push, done.
   The page must remain fully readable with this file absent or broken: reveal
   hiding is gated on the .js class below, share/calendar links are static HTML,
   and the mail links carry a noscript fallback. */

// Gate all JS-dependent styling; must be the first statement.
document.documentElement.classList.add("js");

// --- splash: play once per session, remove from the DOM once faded ---
const splash = document.querySelector(".splash");
if (splash) {
  try {
    if (sessionStorage.getItem("msp15-splash")) splash.remove();
    else sessionStorage.setItem("msp15-splash", "1");
  } catch {
    // storage unavailable: keep the splash, CSS dismisses it on its own
  }
  splash.addEventListener("animationend", (e) => {
    if (e.animationName === "splash-out") splash.remove();
  });
}

const CONFIG = {
  // The Qualtrics registration form (live since 1 Sep); null = "opens soon" state.
  rsvpUrl: "https://maastrichtuniversity.eu.qualtrics.com/jfe/form/SV_8HvDkAm88ZOC9WC",
  // Set to the current registration count once it passes ~25; null hides the counter.
  attending: null,
  // The canonical shareable URL of this page (update if a custom domain lands).
  shareUrl: "https://msp15.nl/",
  // Contact mailbox, assembled at runtime to keep scrapers off the raw HTML.
  mailUser: "msp-alumni",
  mailDomain: "maastrichtuniversity.nl",
};

// --- RSVP state (forward the visitor's ?src channel tag onto the form URL) ---
if (CONFIG.rsvpUrl) {
  const src = new URLSearchParams(location.search).get("src");
  const url = src
    ? CONFIG.rsvpUrl + (CONFIG.rsvpUrl.includes("?") ? "&" : "?") + "src=" + encodeURIComponent(src)
    : CONFIG.rsvpUrl;
  document.querySelectorAll(".js-rsvp").forEach((a) => {
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
  });
  const link = document.querySelector(".js-rsvp-link");
  if (link) {
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener";
    link.hidden = false;
  }
  const open = document.querySelector(".js-rsvp-open");
  if (open) open.hidden = false;
  const closed = document.querySelector(".js-rsvp-closed");
  if (closed) closed.hidden = true;
}

// --- counter ---
if (CONFIG.attending !== null) {
  const count = document.querySelector(".js-count");
  const section = document.querySelector("#counter");
  if (count && section) {
    count.textContent = CONFIG.attending;
    section.hidden = false;
  }
}

// --- mail links ---
const mail = `${CONFIG.mailUser}@${CONFIG.mailDomain}`;
document.querySelectorAll(".js-mail").forEach((a) => {
  a.href = `mailto:${mail}?subject=${encodeURIComponent("MSP 15 Years")}`;
  if (a.textContent === "email us") a.textContent = mail;
});

// --- copy-link button (share/calendar links are static HTML) ---
const copyBtn = document.querySelector(".js-copy");
if (copyBtn)
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.shareUrl + "?src=copy");
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = "Copy the link"), 2000);
    } catch {
      copyBtn.textContent = CONFIG.shareUrl;
    }
  });

// --- scroll reveals (hiding only applies under html.js, so no-JS sees everything) ---
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries)
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.setProperty("--d", `${(i % 3) * 0.08}s`);
    io.observe(el);
  });
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
}
