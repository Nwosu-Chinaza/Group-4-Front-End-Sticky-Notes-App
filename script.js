const container = document.querySelector(".sticky-notes");
const addNoteBtn = document.querySelector(".add-note");
const themeToggleBtn = document.getElementById("theme-toggle");

let notes = [];

function loadNotes() {
  const storedNotes = localStorage.getItem("notes");
  if (!storedNotes) return;

  try {
    notes = JSON.parse(storedNotes) || [];
    notes.forEach(note => renderNote(note));
  } catch (error) {
    console.error("Error loading notes:", error);
    notes = [];
  }
}

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function renderNote(note) {
  const stickyNote = document.createElement("div");
  stickyNote.classList.add("sticky-note", "animate-in");
  stickyNote.style.setProperty("--note-color", note.color);
  stickyNote.dataset.id = note.id;

  const textarea = document.createElement("textarea");
  textarea.classList.add("note-content");
  textarea.placeholder = "Enter your note here";
  textarea.value = note.content;
  textarea.style.color = note.textColor || "#000";

  textarea.addEventListener("input", () => {
    updateNote(note.id, textarea.value, textarea);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-note");
  deleteBtn.textContent = "X";

  deleteBtn.addEventListener("click", () => {
    removeNote(note.id, stickyNote);
  });

  stickyNote.appendChild(textarea);
  stickyNote.appendChild(deleteBtn);

  container.prepend(stickyNote);
}


function addNote() {
  const newNote = {
    id: generateID(),
    color: generateRandomLightColor(),
    content: "",
    textColor: "#000"
  };

  notes.unshift(newNote);
  renderNote(newNote);
  saveNotes();
}

function updateNote(id, newContent, textarea) {
  const note = notes.find(n => n.id === id);
  if (!note) return;

  const bgColor = getComputedStyle(textarea.parentElement)
    .getPropertyValue("--note-color")
    .trim();

  const lightness = calculateLightness(bgColor);
  const textColor = lightness > 50 ? "#000" : "#fff";

  textarea.style.color = textColor;

  note.content = newContent;
  note.textColor = textColor;

  saveNotes();
}

function removeNote(id, element) {
  element.classList.add("animate-out");

  setTimeout(() => {
    element.remove();
  }, 300);

  notes = notes.filter(note => note.id !== id);
  saveNotes();
}

function generateID() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function generateRandomLightColor() {
  const r = Math.floor(Math.random() * 56) + 200;
  const g = Math.floor(Math.random() * 56) + 200;
  const b = Math.floor(Math.random() * 56) + 200;

  return (
    "#" + ((1 << 24) | (r << 16) | (g << 8) | b)
      .toString(16)
      .slice(1)
  );
}

function calculateLightness(color) {
  color = color.replace("#", "");

  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);

  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;

  return ((max + min) / 2) * 100;
}

addNoteBtn.addEventListener("click", addNote);

loadNotes();

// THEME TOGGLE

// Load theme from localStorage
let currentTheme = localStorage.getItem("theme") || "light";
setTheme(currentTheme);

themeToggleBtn.addEventListener("click", () => {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  setTheme(currentTheme);
  localStorage.setItem("theme", currentTheme);
});

function setTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggleBtn.textContent = "☀️"; // sun for dark mode
  } else {
    document.body.classList.remove("dark-mode");
    themeToggleBtn.textContent = "🌙"; // moon for light mode
  }
}