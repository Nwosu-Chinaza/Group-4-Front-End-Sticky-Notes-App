// ================================================
// Sticky Notes Group-4
// Features: add, edit, delete, localStorage persist
// ================================================

document.addEventListener("DOMContentLoaded", () => {
  // ── Note color palette — matches the design ───
  const NOTE_COLORS = [
    "var(--note-color-1)",
    "var(--note-color-2)",
    "var(--note-color-3)",
    "var(--note-color-4)",
  ];

  // ── State ─────────────────────────────────────
  // Each note: { id, text, color }
  let notes = _loadNotes();

  // ── DOM refs ──────────────────────────────────
  const grid = document.getElementById("notesGrid");
  const addBtn = document.getElementById("btnAddNote");

  // ── Initial render ────────────────────────────
  // If no saved notes, start with one empty note
  if (notes.length === 0) {
    notes.push(_createNote());
    _saveNotes();
  }

  _renderAll();

  // ── Add note button ───────────────────────────
  addBtn.addEventListener("click", () => {
    const note = _createNote();
    notes.push(note);
    _saveNotes();
    _renderAll();

    // Focus the new note's textarea after render
    const newCard = document.querySelector(
      `[data-id="${note.id}"] .note-card__textarea`
    );
    if (newCard) newCard.focus();
  });

  // ════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════

  function _renderAll() {
    // Remove all existing note cards (keep the add button)
    grid
      .querySelectorAll(".note-card:not(.note-card--add)")
      .forEach((card) => card.remove());

    // Insert each note card before the add button
    notes.forEach((note) => {
      const card = _buildCard(note);
      grid.insertBefore(card, addBtn);
    });
  }

  function _buildCard(note) {
    // ── Card element ────────────────────────────
    const card = document.createElement("article");
    card.className = "note-card note-card--animate";
    card.dataset.id = note.id;
    card.style.backgroundColor = note.color;

    // ── Textarea ─────────────────────────────────
    const textarea = document.createElement("textarea");
    textarea.className = "note-card__textarea";
    textarea.placeholder = "Enter your note here";
    textarea.value = note.text;
    textarea.setAttribute("aria-label", "Note text");

    // Save text on every input
    textarea.addEventListener("input", () => {
      note.text = textarea.value;
      _saveNotes();
    });

    // ── Delete button ─────────────────────────────
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "note-card__delete";
    deleteBtn.type = "button";
    deleteBtn.textContent = "X";
    deleteBtn.setAttribute("aria-label", "Delete note");

    deleteBtn.addEventListener("click", () => {
      _deleteNote(note.id, card);
    });

    card.appendChild(textarea);
    card.appendChild(deleteBtn);

    return card;
  }

  // ════════════════════════════════════════════════
  // DELETE
  // ════════════════════════════════════════════════

  function _deleteNote(id, cardEl) {
    // Play exit animation first, then remove from DOM + state
    cardEl.classList.add("note-card--removing");

    cardEl.addEventListener(
      "animationend",
      () => {
        notes = notes.filter((n) => n.id !== id);
        _saveNotes();
        cardEl.remove();
      },
      { once: true }
    );
  }

  // ════════════════════════════════════════════════
  // UTILITIES
  // ════════════════════════════════════════════════

  function _createNote() {
    return {
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      text: "",
      // Cycle through colors in order
      color: NOTE_COLORS[notes.length % NOTE_COLORS.length],
    };
  }

  function _saveNotes() {
    localStorage.setItem("stickyNotes", JSON.stringify(notes));
  }

  function _loadNotes() {
    try {
      const saved = localStorage.getItem("stickyNotes");
      return saved ? JSON.parse(saved) : [];
    } catch {
      // If localStorage is unavailable or data is corrupt, start fresh
      return [];
    }
  }
});
