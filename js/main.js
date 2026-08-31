/* MSP 15 Years · page behaviour. All state lives in CONFIG; edit, push, done. */

const CONFIG = {
  // Set to the Qualtrics registration URL when it exists; null = "opens soon" state.
  rsvpUrl: null,
  // Set to the current registration count once it passes ~25; null hides the counter.
  attending: null,
  // The canonical shareable URL of this page (update if a custom domain lands).
  shareUrl: "https://msp-operations.github.io/msp-15-years/",
  // Contact mailbox, assembled at runtime to keep scrapers off the raw HTML.
  mailUser: "msp-alumni",
  mailDomain: "maastrichtuniversity.nl",
};

// --- RSVP state ---
if (CONFIG.rsvpUrl) {
  document.querySelectorAll(".js-rsvp").forEach((a) => (a.href = CONFIG.rsvpUrl));
  const link = document.querySelector(".js-rsvp-link");
  link.href = CONFIG.rsvpUrl;
  link.hidden = false;
  document.querySelector(".js-rsvp-open").hidden = false;
  document.querySelector(".js-rsvp-closed").hidden = true;
}

// --- counter ---
if (CONFIG.attending !== null) {
  document.querySelector(".js-count").textContent = CONFIG.attending;
  document.querySelector("#counter").hidden = false;
}

// --- mail links ---
const mail = `${CONFIG.mailUser}@${CONFIG.mailDomain}`;
document.querySelectorAll(".js-mail").forEach((a) => {
  a.href = `mailto:${mail}?subject=${encodeURIComponent("MSP 15 Years")}`;
  if (a.textContent === "email us") a.textContent = mail;
});

// --- share buttons ---
const shareMsg =
  "MSP is turning 15 and everyone is invited back to Maastricht for anniversary drinks on Saturday 10 October. Are you going? " +
  CONFIG.shareUrl;
const wa = document.querySelector(".js-share-wa");
if (wa) wa.href = "https://wa.me/?text=" + encodeURIComponent(shareMsg);
const li = document.querySelector(".js-share-li");
if (li) li.href = "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(CONFIG.shareUrl);
const sm = document.querySelector(".js-share-mail");
if (sm)
  sm.href =
    "mailto:?subject=" + encodeURIComponent("MSP turns 15, drinks in Maastricht on 10 October") +
    "&body=" + encodeURIComponent(shareMsg);
const copyBtn = document.querySelector(".js-copy");
if (copyBtn)
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.shareUrl);
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = "Copy the link"), 2000);
    } catch {
      copyBtn.textContent = CONFIG.shareUrl;
    }
  });

// --- scroll reveals (no-JS and reduced-motion users simply see everything) ---
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
