const addBtn = document.querySelector(".add-btn");
const container = document.querySelector(".notes-container");

const colors = ["n1", "n2", "n3", "n4"];



// SAVE NOTES

function saveNotes() {

    const notes = [];

    document.querySelectorAll(".note").forEach(note => {

        const textarea = note.querySelector("textarea").value;

        let color = "";

        colors.forEach(c => {
            if (note.classList.contains(c)) {
                color = c;
            }

        });

        notes.push({
            text: textarea.value,
            color: color,
            left: note.style.left,
            top: note.style.top,
        });

    });

    localStorage.setItem("notes", JSON.stringify(notes));

}


// LOAD NOTES

function loadNotes() {
    const saved = JSON.parse(localStorage.getItem("notes")) || [];

    saved.forEach(n => {

        createNote(n.text, n.color, n.left, n.top);

    });

}


// CREATE NOTE

function createNote(text = "", colorClass = null, left = "", top = "") {

    const note = document.createElement("div");
    note.classList.add("note");
    note.style.position = "absolute";

    // random color if none
    if (!colorClass) {
        colorClass = colors[Math.floor(Math.random() * colors.length)];
    }

    note.classList.add(colorClass);

    note.innerHTML = `
    <button class="delete">x</button>
    <button class="color">🎨</button>
    <textarea>${text}</textarea>
    `;

    container.appendChild(note);

    if (left) note.style.left = left;
    if (top) note.style.top = top;

    const textarea = note.querySelector("textarea");
    const delBtn = note.querySelector("delete");
    const colorBtn = note.querySelector(".color");

    textarea.addEventListener("input", saveNotes);

    delBtn.addEventListener("click", () => {
        note.remove();
        saveNotes();
    });

    colorBtn.addEventListener("click", () => {

        colors.forEach(c => note.classList.remove(c));

        const newColor = 
        colors[Math.floor(Math.random() * colors.length)];

        note.classList.add(newColor);
        saveNotes();

    });

    makeDraggable(note);

}

// DRAG

function makeDraggable(note) {

    let offsetX, offsetY;
    let isDown = false;

    note.addEventListener("mousedown", e => {
        
        isDown = true;

        offsetX = e.clientX - note.offsetLeft;
        offsetY = e.clientY - note.offsetTop;

        note.style.zIndex = 1000;

    });

    document.addEventListener("mousemove", e => {

        if (!isDown) return;

        note.style.left = e.clientX - offsetX + "px";
        note.style.top = e.clientY - offsetY + "px";

    });

    document.addEventListener("mouseup", () => {

        if (isDown) {
            saveNotes();
        }

        isDown = false;

    });


}


// ADD BUTTON

addBtn.addEventListener("click", () => {

    createNotes();
    saveNotes();

});


// LOAD ON START

loadNotes();

