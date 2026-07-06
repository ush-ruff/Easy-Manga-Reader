// ==UserScript==
// @name        Easy Manga Reader
// @namespace   Violentmonkey Scripts
// @match       https://asuracomic.net/series/*/chapter/*
// @match       https://asurascans.com/comics/*
// @match       https://comick.io/comic/*/
// @match       https://flamecomics.me/*/
// @match       https://mangadex.org/chapter/*
// @match       https://radiantscans.com/*/
// @match       https://reaperscans.com/series/*
// @version     2.0.0
// @author      ushruff
// @description Smooth scrolling with no delays in keydown. Add shortcuts to go to next, previous and all chapters of the manga.
// @homepageURL https://github.com/ush-ruff/Easy-Manga-Reader/
// @downloadURL https://github.com/ush-ruff/Easy-Manga-Reader/raw/main/script.user.js
// @grant       none
// @license     GNU GPLv3
// @require     https://raw.githubusercontent.com/ush-ruff/Common/main/Userscript-Helper-Lib/helpersBootstrap.js
// ==/UserScript==

// ---------------------------------------------------------------------------
// Configurable Variables
// ---------------------------------------------------------------------------
const SCROLL_AMOUNT = 20; // Number of pixels to scroll in each step
const KEYS = {
  "ArrowUp": {
    action: () => smoothScroll(-1),
    label: "Scroll Up",
    repeat: true,
  },
  "ArrowDown": {
    action: () => smoothScroll(1),
    label: "Scroll Down",
    repeat: true,
  },
  "ArrowRight": {
    action: () => changeChapter("next"),
    label: "Next chapter",
  },
  "ArrowLeft": {
    action: () => changeChapter("prev"),
    label: "Previous chapter",
  },
  "0": {
    action: () => changeChapter("allChapters"),
    label: "View all chapters",
  },
  "Shift + ?": {
    action: () => showShortcutInfo(MODAL_ID),
    label: "Show shortcut help",
  }
}

const SCRIPT_ID = "Easy-manga-reader"
const MODAL_ID = "Manga-reader-shortcut-modal"

// ---------------------------------------------------------------------------
// Reference Variables (Supported Sites)
// ---------------------------------------------------------------------------
const SITES = {
  "asuracomic.net": {
    // next: "",
    // prev: "",
    allChapters: "div > div > div > div > h2 + p > a[href*='/series/']"
  },
  "asurascans.com": {
    // next: "",
    // prev: "",
    allChapters: "div > div > div > div > h2 + p > a[href*='/series/']"
  },
  "comick.io": {
    // next: "",
    // prev: "",
    allChapters: ".info-reader-container a[href*='/comic/']"
  },
  "flamecomics.me": {
    // next: ".chnav .ch-next-btn:not(.disabled)",
    // prev: ".chnav .ch-prev-btn:not(.disabled)",
    allChapters: ".headpost > .allc > a"
  },
  "mangadex.org": {
    // next: "",
    // prev: "",
    allChapters: ".reader--header-manga"
  },
  "radiantscans.com": {
    // next: ".chnav .ch-next-btn:not(.disabled)",
    // prev: ".chnav .ch-prev-btn:not(.disabled)",
    allChapters: ".headpost > .allc > a"
  },
  "reaperscans.com": {
    // next: "",
    // prev: "",
    allChapters: "#content > nav > div > a[href*='/series/'] button"
  }
}

// ---------------------------------------------------------------------------
// Setup Dependencies
// ---------------------------------------------------------------------------
const ushruffUSKit = ensureUSKit.getUSKit()
const { registerShortcutKeys, setupShortcutInfo, showShortcutInfo, clickElement } = window.ushruffUSKit


// ---------------------------------------------------------------------------
// Event Listeners
// ---------------------------------------------------------------------------
window.addEventListener("load", () => {
  registerShortcutKeys(SCRIPT_ID, KEYS)
  setupShortcutInfo(MODAL_ID, KEYS)
})


// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------
function smoothScroll(yDir) {
  window.scrollBy(0, yDir * SCROLL_AMOUNT);
}

function changeChapter(dir) {
  const site = window.location.hostname;
  if (!SITES.hasOwnProperty(site) || !(dir in SITES[site])) return;
  clickElement(SITES[site][dir]);
}
