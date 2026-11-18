/* ============================================================
   OUR DECEMBER COUNTDOWN — TEST VERSION
   ------------------------------------------------------------
   This is the 5-day test version. All doors are unlocked so you
   can check the design, the modal and the different content types.
   ============================================================ */

const CONFIG = {
  year: 2026,
  totalDays: 5,
  name: "Emily",
  unlockAll: true,
  showReset: true,
  testMode: true,
  storageKey: "advent-calendar-test-2026",
};

const days = {
  1: {
    type: "link",
    title: "A song that made me think of you",
    text: "I heard this on the way home and immediately thought of you. Press play and imagine I am sitting next to you.",
    link: "https://www.youtube.com/",
    linkLabel: "Open the song",
  },
  2: {
    type: "photo",
    title: "One of my favourite memories",
    image: "assets/images/day-02.svg",
    alt: "A favourite memory of us",
    text: "This is one of those photos I keep coming back to. In the real version, this is where the story behind the photo goes.",
    caption: "Placeholder image — replace it with a real photo of the two of you.",
  },
  3: {
    type: "voucher",
    title: "A date night, on me",
    text: "This one is redeemable whenever you want.",
    voucherTitle: "One cosy date night",
    voucherDetails: "Hot chocolate, a walk with no destination, and no phones for two hours.",
    voucherCode: "DATE-NIGHT",
  },
  4: {
    type: "audio",
    title: "A voice note for you",
    audio: "assets/audio/placeholder.wav",
    text: "Press play. In the real version, this is where a proper voice note from me will go.",
    caption: "The file currently in the folder is only a placeholder sound.",
  },
  5: {
    type: "text",
    title: "One more note",
    text: "Dear Emily,\n\nI wanted the last test door to be a proper note, so here it is: thank you for being you. I hope this little calendar makes December a bit softer.\n\nAlways yours,\n[your name]",
  },
};

const calendarGrid = document.getElementById("calendarGrid");
const modal = document.getElementById("modal");
const modalDay = document.getElementById("modalDay");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const closeButton = document.getElementById("closeButton");
const toast = document.getElementById("toast");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const progressHint = document.getElementById("progressHint");
const resetButton = document.getElementById("resetButton");
const subtitle = document.getElementById("subtitle");
const eyebrow = document.getElementById("eyebrow");

const opened = loadOpened();
let lastFocusedElement = null;
let toastTimer = null;

function loadOpened() {
  try {
    const raw = localStorage.getItem(CONFIG.storageKey);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(
      parsed.filter(
        (day) =>
          Number.isInteger(day) &&
          day >= 1 &&
          day <= CONFIG.totalDays &&
          isUnlocked(day)
      )
    );
  } catch (error) {
    return new Set();
  }
}

function saveOpened() {
  try {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify([...opened]));
  } catch (error) {
    // Private browsing or file:// may block localStorage. The calendar still works.
  }
}

function isUnlocked(day) {
  if (CONFIG.unlockAll) return true;
  const now = new Date();
  const unlockDate = new Date(CONFIG.year, 11, day, 0, 0, 0);
  return now >= unlockDate;
}

function formatDay(day) {
  return "December " + day;
}

function buildCalendar() {
  const fragment = document.createDocumentFragment();

  for (let day = 1; day <= CONFIG.totalDays; day += 1) {
    const unlocked = isUnlocked(day);
    const door = document.createElement("button");
    door.type = "button";
    door.className = "door";
    door.dataset.day = String(day);
    door.setAttribute(
      "aria-label",
      "Day " + day + (unlocked ? "" : ", locked until " + formatDay(day))
    );

    if (!unlocked) {
      door.classList.add("locked");
      door.setAttribute("aria-disabled", "true");
    }

    if (opened.has(day)) {
      door.classList.add("opened");
    }

    const number = document.createElement("span");
    number.className = "door-number";
    number.textContent = String(day);

    const label = document.createElement("span");
    label.className = "door-label";
    label.textContent = "Dec";

    const status = document.createElement("span");
    status.className = "door-status";
    status.textContent = opened.has(day)
      ? "Opened"
      : unlocked
        ? "Open me"
        : "Locked";

    door.append(number, label, status);

    door.addEventListener("click", () => {
      if (!isUnlocked(day)) {
        door.classList.remove("shake");
        void door.offsetWidth;
        door.classList.add("shake");
        showToast("This door opens on " + formatDay(day) + ".");
        return;
      }
      openDoor(day);
    });

    fragment.append(door);
  }

  calendarGrid.replaceChildren(fragment);
}

function makeParagraphs(text) {
  const fragment = document.createDocumentFragment();
  const paragraphs = String(text || "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  paragraphs.forEach((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    fragment.append(p);
  });

  return fragment;
}

function makeCaption(text) {
  if (!text) return null;
  const caption = document.createElement("p");
  caption.className = "caption";
  caption.textContent = text;
  return caption;
}

function renderContent(data) {
  const fragment = document.createDocumentFragment();

  if (data.type === "photo") {
    if (data.image) {
      const image = document.createElement("img");
      image.src = data.image;
      image.alt = data.alt || data.title || "A photo";
      image.loading = "lazy";
      fragment.append(image);
    }
    fragment.append(makeParagraphs(data.text));
    const caption = makeCaption(data.caption);
    if (caption) fragment.append(caption);
    return fragment;
  }

  if (data.type === "audio") {
    fragment.append(makeParagraphs(data.text));
    if (data.audio) {
      const audio = document.createElement("audio");
      audio.controls = true;
      audio.preload = "none";
      audio.src = data.audio;
      fragment.append(audio);
    }
    const caption = makeCaption(data.caption);
    if (caption) fragment.append(caption);
    return fragment;
  }

  if (data.type === "link") {
    fragment.append(makeParagraphs(data.text));
    if (data.link) {
      const link = document.createElement("a");
      link.className = "link-button";
      link.href = data.link;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = data.linkLabel || "Open the link";
      fragment.append(link);
    }
    return fragment;
  }

  if (data.type === "voucher") {
    fragment.append(makeParagraphs(data.text));

    const voucher = document.createElement("div");
    voucher.className = "voucher";

    const title = document.createElement("p");
    title.className = "voucher-title";
    title.textContent = data.voucherTitle || "A little voucher";

    const details = document.createElement("p");
    details.className = "voucher-details";
    details.textContent = data.voucherDetails || "";

    const code = document.createElement("span");
    code.className = "voucher-code";
    code.textContent = data.voucherCode || "WITH-LOVE";

    voucher.append(title, details, code);
    fragment.append(voucher);
    return fragment;
  }

  if (data.type === "list") {
    fragment.append(makeParagraphs(data.text));

    const list = document.createElement("ul");
    list.className = "reason-list";

    (data.items || []).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.append(li);
    });

    fragment.append(list);
    return fragment;
  }

  fragment.append(makeParagraphs(data.text));
  return fragment;
}

function openDoor(day) {
  const data = days[day] || {
    type: "text",
    title: "Day " + day,
    text: "A little surprise is still being written for this day.",
  };

  lastFocusedElement = document.activeElement;
  modalDay.textContent = formatDay(day);
  modalTitle.textContent = data.title || "Day " + day;
  modalBody.replaceChildren(renderContent(data));

  modal.hidden = false;
  document.body.classList.add("modal-open");
  closeButton.focus();

  opened.add(day);
  saveOpened();
  updateDoor(day);
  updateProgress();
}

function closeModal() {
  modal.hidden = true;
  document.body.classList.remove("modal-open");
  modalBody.replaceChildren();

  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}

function updateDoor(day) {
  const door = calendarGrid.querySelector('[data-day="' + day + '"]');
  if (!door) return;

  door.classList.add("opened");
  const status = door.querySelector(".door-status");
  if (status) status.textContent = "Opened";
}

function updateProgress() {
  const count = [...opened].filter(
    (day) => day >= 1 && day <= CONFIG.totalDays
  ).length;
  const percent = CONFIG.totalDays
    ? Math.round((count / CONFIG.totalDays) * 100)
    : 0;

  progressText.textContent = count + " of " + CONFIG.totalDays + " opened";
  progressFill.style.width = percent + "%";

  if (count === CONFIG.totalDays) {
    progressHint.textContent = "you found them all \u2665";
  } else if (CONFIG.unlockAll) {
    progressHint.textContent = "all doors unlocked";
  } else if (new Date() < new Date(CONFIG.year, 11, 1)) {
    progressHint.textContent = "first door opens December 1";
  } else {
    progressHint.textContent = "one door at a time";
  }
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

function resetCalendar() {
  opened.clear();
  saveOpened();
  buildCalendar();
  updateProgress();
  closeModal();
  showToast("Calendar reset.");
}

function makeSnow() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const snowLayer = document.getElementById("snow");
  const count = 38;

  for (let i = 0; i < count; i += 1) {
    const flake = document.createElement("span");
    flake.className = "snowflake";
    flake.textContent = "❄";
    flake.style.left = Math.random() * 100 + "%";
    flake.style.fontSize = 8 + Math.random() * 10 + "px";
    flake.style.animationDuration = 10 + Math.random() * 12 + "s";
    flake.style.animationDelay = -Math.random() * 20 + "s";
    flake.style.opacity = String(0.25 + Math.random() * 0.55);
    snowLayer.append(flake);
  }
}

function trapFocus(event) {
  if (event.key !== "Tab") return;

  const focusable = [
    ...modal.querySelectorAll(
      'button, [href], audio[controls], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ),
  ].filter((element) => !element.disabled && element.offsetParent !== null);

  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function init() {
  if (CONFIG.testMode) {
    eyebrow.textContent = "Test version — all doors unlocked";
    if (CONFIG.name) {
      subtitle.textContent =
        CONFIG.totalDays + " tiny surprises for " + CONFIG.name + " — test version.";
    }
  } else if (CONFIG.name) {
    subtitle.textContent =
      CONFIG.totalDays +
      " tiny surprises for " +
      CONFIG.name +
      ", one for each day until Christmas.";
  }

  resetButton.hidden = !CONFIG.showReset;
  resetButton.addEventListener("click", resetCalendar);

  closeButton.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target.matches("[data-close]")) closeModal();
  });
  modal.addEventListener("keydown", trapFocus);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });

  buildCalendar();
  updateProgress();
  makeSnow();
}

init();
