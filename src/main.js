// src/main.js

import './scss/main.scss';

console.log('Lumina Premium Template Loaded Successfully! 🚀');

const yearEl = document.getElementById("year");

if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}