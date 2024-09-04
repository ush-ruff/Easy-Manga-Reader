// ==UserScript==
// @name        Easy Manga Reader
// @namespace   Violentmonkey Scripts
// @match       https://asura.gg/*/
// @match       https://asuratoon.com/*/
// @match       http*://flamescans.org/*/
// @match       http*://luminousscans.com/*/
// @match       http*://reset-scans.com/*/
// @include     /^https?:\/\/(www\.)?reaperscans\.com\/comics\//
// @grant       none
// @homepageURL  https://github.com/ush-ruff/Easy-Manga-Reader/
// @downloadURL  https://github.com/ush-ruff/Easy-Manga-Reader/raw/main/script.user.js
// @version     1.2.0
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
  38: {func: () => smoothScroll(-1), repeat: true},
  40: {func: () =>  smoothScroll(1), repeat: true},
  39: {func: () => changeChapter("next"), repeat: false},
  37: {func: () => changeChapter("prev"), repeat: false},
  96: {func: () => changeChapter("allChapters"), repeat: false}
}

// ---------------------------------------------------------------------------
// REFERENCE VARIABLES (SUPPORTED SITES)
// ---------------------------------------------------------------------------
const SITES = {
  "asura.gg": {
    next: ".chnav .ch-next-btn:not(.disabled)",
    prev: ".chnav .ch-prev-btn:not(.disabled)",
    allChapters: ".headpost > .allc > a"
  },
  "asuracomic.net": {
    // next: ".chnav .ch-next-btn:not(.disabled)",
    // prev: ".chnav .ch-prev-btn:not(.disabled)",
    allChapters: "div > div > div > div > h2 + p > a[href*='/series/']"
  },
  "asuratoon.com": {
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
  let key = event.keyCode;
  const isInteractiveElement = event.target.matches("input, textarea, select");
  const modifierKeys = [16, 17, 18];

  // Cancel keyhandling if the "Main key" is a modifier key
  if (modifierKeys.includes(key)) return;

  // Adjust key to include modifier keys
  if (event.ctrlKey) key = `ctrl+${key}`;
  if (event.shiftKey) key = `shift+${key}`;
  if (event.altKey) key = `alt+${key}`;

  if (!(key in KEYS) || isInteractiveElement) return;

  if (!(key in timers)) {
    timers[key] = null;
    KEYS[key].func();

    if (KEYS[key].repeat) {
      timers[key] = requestAnimationFrame(repeatAnimation.bind(null, key, KEYS[key].func));
    }
  }

  event.preventDefault();
}

function handleKeyup() {
  for (key in timers) {
    if (timers[key] != null) {
      cancelAnimationFrame(timers[key]);
    }
  }
  timers = {};
}

function repeatAnimation(key, func) {
  func();
  timers[key] = requestAnimationFrame(repeatAnimation.bind(null, key, func));
}


// ---------------------------------------------------------------------------
// Smooth Scroll
// ---------------------------------------------------------------------------
function smoothScroll(yDir) {
  window.scrollBy(0, yDir * SCROLL_AMOUNT);
}


// ---------------------------------------------------------------------------
// Change Chapters
// ---------------------------------------------------------------------------
function changeChapter(dir) {
  const site = window.location.hostname;
  if (!SITES.hasOwnProperty(site) || !(dir in SITES[site])) return;

  const btn = document.querySelector(SITES[site][dir]);
  if (!btn) return;
  btn.click();
}
