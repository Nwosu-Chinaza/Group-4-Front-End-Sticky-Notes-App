(function () {
  const grid = document.getElementById("notesGrid");
  const addBtn = document.getElementById("addNote");
  const toggleTheme = document.getElementById("toggleTheme");

  const colors = ["c1", "c2", "c3", "c4", "c5", "c6"];
  let colorIndex = 0;

  toggleTheme.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark"));
  });

  if (localStorage.getItem("theme") === "true") {
    document.body.classList.add("dark");
  }

  function saveNotes() {
    const notes = [];
    document.querySelectorAll(".note-card").forEach((card) => {
      const textarea = card.querySelector(".note-text");
      const meta = card.querySelector(".meta-timestamps");
      const colorClass = Array.from(card.classList).find((cls) =>
        cls.startsWith("c"),
      );
      notes.push({
        text: textarea.value,
        color: colorClass || "c1",
        created: card.dataset.created,
        updated: card.dataset.updated,
      });
    });
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  function createNote(text = "", color = null, created = null, updated = null) {
    const card = document.createElement("div");
    card.classList.add("note-card");

    const finalColor = color || colors[colorIndex++ % colors.length];
    card.classList.add(finalColor);

    const now = new Date().toLocaleString();
    card.dataset.created = created || now;
    card.dataset.updated = updated || now;

    card.innerHTML = `
          <button class="delete-btn" aria-label="delete note">✕</button>
          <textarea class="note-text" placeholder="write something nice...">${text}</textarea>
          <div class="meta-timestamps"></div>
        `;

    const textarea = card.querySelector(".note-text");
    const metaDiv = card.querySelector(".meta-timestamps");

    function updateMeta() {
      metaDiv.textContent = `✏️ ${card.dataset.created} · updated ${card.dataset.updated}`;
    }
    updateMeta();

    card.addEventListener("dblclick", (e) => {
      if (e.target.classList.contains("delete-btn")) return;
      card.classList.add("editing");
      textarea.focus();
    });

    textarea.addEventListener("blur", () => {
      card.classList.remove("editing");
      card.dataset.updated = new Date().toLocaleString();
      updateMeta();
      saveNotes();
    });

    card.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      card.style.transition = "opacity 0.2s, transform 0.15s";
      card.style.opacity = "0";
      card.style.transform = "scale(0.96)";
      setTimeout(() => {
        card.remove();
        saveNotes();
      }, 150);
    });

    grid.insertBefore(card, addBtn);
    saveNotes();
  }

  function loadNotes() {
    const saved = JSON.parse(localStorage.getItem("notes")) || [];
    saved.forEach((n) => createNote(n.text, n.color, n.created, n.updated));
  }

  addBtn.addEventListener("click", () => {
    createNote();
  });

  loadNotes();

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && e.target.tagName === "TEXTAREA") {
      e.target.blur();
    }
  });
})();
