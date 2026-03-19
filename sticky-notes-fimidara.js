const notesContainer = document.getElementById("notes-container");
const addBtn = document.getElementById("add-note");
const themeToggle = document.getElementById("theme-toggle");

// Load theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// Toggle theme
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const theme = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", theme);
});

// Load notes
function loadNotes() {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes.forEach(note => createNote(note.text, note.color));
}

// Save notes
function saveNotes() {
  const notes = [];
  document.querySelectorAll(".note-wrapper").forEach(wrapper => {
    const textarea = wrapper.querySelector(".note");
    const color = textarea.style.background;

    notes.push({
      text: textarea.value,
      color: color
    });
  });

  localStorage.setItem("notes", JSON.stringify(notes));
}

// Create note
function createNote(content = "", bgColor = "") {
  const wrapper = document.createElement("div");
  wrapper.classList.add("note-wrapper");

  const textarea = document.createElement("textarea");
  textarea.classList.add("note");
  textarea.placeholder = "Enter your note here";
  textarea.value = content;

  if (bgColor) textarea.style.background = bgColor;

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "X";
  deleteBtn.classList.add("delete-btn");

  const colorPicker = document.createElement("input");
  colorPicker.type = "color";
  colorPicker.classList.add("color-picker");

  // Change color
  colorPicker.addEventListener("input", () => {
    textarea.style.background = colorPicker.value;
    saveNotes();
  });

  deleteBtn.addEventListener("click", () => {
    wrapper.remove();
    saveNotes();
  });

  textarea.addEventListener("input", saveNotes);

  wrapper.appendChild(textarea);
  wrapper.appendChild(deleteBtn);
  wrapper.appendChild(colorPicker);

  notesContainer.appendChild(wrapper);
}

// Add note
addBtn.addEventListener("click", () => createNote());

// Init
loadNotes();