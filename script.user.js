// ==UserScript==
// @name        Easy Manga Reader
// @namespace   Violentmonkey Scripts
// @match       https://asura.gg/*/
// @match       http*://flamescans.org/*/
// @match       http*://luminousscans.com/*/
// @match       http*://reset-scans.com/*/
// @include     /^https?:\/\/(www\.)?reaperscans\.com\/comics\//
// @grant       none
// @homepageURL  https://github.com/ush-ruff/Easy-Manga-Reader/
// @downloadURL  https://github.com/ush-ruff/Easy-Manga-Reader/raw/main/script.user.js
// @version     1.0.0
// @author      ushruff
// @description Smooth scrolling with no delays in keydown. Add shortcuts to go to next, previous and all chapters of the manga.
// ==/UserScript==

// ---------------------------------------------------------------------------
// CONFIGURABLE - VARIABLES
// ---------------------------------------------------------------------------
const SCROLL_AMOUNT = 20; // Number of pixels to scroll in each step
const KEYS = {
  "ArrowUp": {func: () => smoothScroll(-1), repeat: true},
  "ArrowDown": {func: () =>  smoothScroll(1), repeat: true},
  "ArrowRight": {func: () => changeChapter("next"), repeat: false},
  "ArrowLeft": {func: () => changeChapter("prev"), repeat: false},
  "0": {func: () => changeChapter("allChapters"), repeat: false}
};

// ---------------------------------------------------------------------------
// REFERENCE VARIABLES (SUPPORTED SITES)
// ---------------------------------------------------------------------------
const SITES = {
  "asura.gg": {
    next: ".chnav .ch-next-btn:not(.disabled)",
    prev: ".chnav .ch-prev-btn:not(.disabled)",
    allChapters: ".headpost > .allc > a"
  },
  "luminousscans.com": {
    // next: ".chnav .ch-next-btn:not(.disabled)",
    // prev: ".chnav .ch-prev-btn:not(.disabled)",
    allChapters: ".headpost > .allc > a"
  },
  "reaperscans.com": {
    next: "nav > div:nth-child(3) > a:nth-child(2)",
    prev: "nav > div:nth-child(1) > a",
    allChapters: "nav > div:nth-child(3) > a:nth-child(1)"
  }
}

// ---------------------------------------------------------------------------
// Add Event Listeners
// ---------------------------------------------------------------------------
document.addEventListener("keydown", handleKeydown);
document.addEventListener("keyup", handleKeyup);

let timers = {};


// ---------------------------------------------------------------------------
// Key Handlers & Animation
// ---------------------------------------------------------------------------
function handleKeydown(event) {
  const key = (event || window.event).key;
  const isInteractiveElement = event.target.matches("input, textarea, select");
  const modifierKeys = event.shiftKey || event.ctrlKey || event.altKey;

  if (!(key in KEYS) || isInteractiveElement || modifierKeys) return;

  if (!(key in timers)) {
    timers[key] = null;
    KEYS[key].func();

    if (KEYS[key].repeat) {
      // timers[key] = setInterval(KEYS[key].func, KEYS[key].repeat);
      timers[key] = requestAnimationFrame(repeatAnimation.bind(null, key, KEYS[key].func));
    }
  };

  event.preventDefault();
};

function handleKeyup() {
  for (key in timers) {
    if (timers[key] != null) {
      // clearInterval(timers[key]);
      cancelAnimationFrame(timers[key]);
    };
  };
  timers = {};
};

function repeatAnimation(key, func) {
  func();
  timers[key] = requestAnimationFrame(repeatAnimation.bind(null, key, func));
};


// ---------------------------------------------------------------------------
// Smooth Scroll
// ---------------------------------------------------------------------------
function smoothScroll(yDir) {
  window.scrollBy(0, yDir * SCROLL_AMOUNT);
};


// ---------------------------------------------------------------------------
// Change Chapters
// ---------------------------------------------------------------------------
function changeChapter(dir) {
  const site = window.location.hostname;
  if (!site in SITES || !(dir in SITES[site])) return;

  const btn = document.querySelector(SITES[site][dir]);
  if (!btn) return;
  btn.click();
}
