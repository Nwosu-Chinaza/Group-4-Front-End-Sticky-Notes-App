const container = document.getElementById('notes-container');
const addBtn = document.getElementById('add-btn');

// 1. Initial Load from LocalStorage
// We check if "sticky-notes" exists, otherwise start with an empty array
const getSavedNotes = () => JSON.parse(localStorage.getItem("sticky-notes") || "[]");

// 2. Function to Save All Notes
const saveAllNotes = () => {
    const notes = Array.from(document.querySelectorAll('.note textarea')).map(t => t.value);
    localStorage.setItem("sticky-notes", JSON.stringify(notes));
};

// 3. Main Function to Build the Note Element
function createNote(content = "") {
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note');
    
    // Assign a random background color (Pastel palette)
    const colors = ['#FFF5F5', '#F3E8FF', '#E0E7FF', '#ECFDF5', '#FFFBEB'];
    noteDiv.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    const textarea = document.createElement('textarea');
    textarea.placeholder = "Enter your note here...";
    textarea.value = content;
    
    // Update storage every time the user stops typing
    textarea.oninput = () => saveAllNotes();

    const delBtn = document.createElement('button');
    delBtn.innerHTML = "&times;"; // HTML entity for a clean 'X'
    delBtn.classList.add('delete-btn');
    
    delBtn.onclick = () => {
        if (confirm("Delete this note?")) {
            noteDiv.remove();
            saveAllNotes();
        }
    };
    
    noteDiv.appendChild(textarea);
    noteDiv.appendChild(delBtn);
    container.appendChild(noteDiv);
}

// 4. Event Listeners & Startup
addBtn.addEventListener('click', () => {
    createNote("");
    saveAllNotes();
});

// Load existing notes on page refresh
const existingNotes = getSavedNotes();
if (existingNotes.length > 0) {
    existingNotes.forEach(noteContent => createNote(noteContent));
} else {
    // If brand new user, show 2 empty notes as a "tutorial"
    createNote("");
    createNote("");
}
