document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
});

function addNote() {
    const noteInput = document.getElementById('note-input');
    const themeInput = document.getElementById('theme-input');
    const notesContainer = document.getElementById('notes-container');

    if (noteInput.value.trim() !== '' && themeInput.value.trim() !== '') {
        const noteId = Date.now().toString();
        const noteText = noteInput.value;
        const themeText = themeInput.value;

        const note = createNoteElement(noteId, themeText, noteText);
        notesContainer.appendChild(note);

        saveNoteToLocalStorage(noteId, themeText, noteText);
        noteInput.value = '';
        themeInput.value = '';
    }
}

function editNote(button) {
    const noteId = button.parentNode.dataset.id;
    const noteElement = button.parentNode;
    const themeSpan = noteElement.querySelector('.theme');
    const noteTextSpan = noteElement.querySelector('.note-text');
    const currentTheme = themeSpan.textContent;
    const currentNoteText = noteTextSpan.textContent;

    const newTheme = prompt('Введите новую тему:', currentTheme);
    const newNoteText = prompt('Введите новый текст заметки:', currentNoteText);

    if (newTheme !== null && newNoteText !== null) {
        themeSpan.textContent = newTheme;
        noteTextSpan.textContent = newNoteText;

        updateNoteInLocalStorage(noteId, newTheme, newNoteText);
    }
}

function createNoteElement(id, theme, text) {
    const note = document.createElement('div');
    note.className = 'note';
    note.dataset.id = id;

    const themeSpan = document.createElement('span');
    themeSpan.className = 'theme';
    themeSpan.textContent = theme;

    const noteTextSpan = document.createElement('span');
    noteTextSpan.className = 'note-text';
    noteTextSpan.textContent = text;

    const editButton = document.createElement('button');
    editButton.textContent = 'Редактировать';
    editButton.onclick = function() {
        editNote(this);
    };

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Удалить';
    deleteButton.onclick = function() {
        deleteNote(this);
    };

    note.appendChild(themeSpan);
    note.appendChild(noteTextSpan);
    note.appendChild(editButton);
    note.appendChild(deleteButton);

    return note;
}

function saveNoteToLocalStorage(id, theme, text) {
    const notes = getNotesFromLocalStorage();
    notes.push({ id, theme, text });
    localStorage.setItem('notes', JSON.stringify(notes));
}

function updateNoteInLocalStorage(id, newTheme, newNoteText) {
    const notes = getNotesFromLocalStorage();
    const index = notes.findIndex(note => note.id === id);

    if (index !== -1) {
        notes[index].theme = newTheme;
        notes[index].text = newNoteText;
        localStorage.setItem('notes', JSON.stringify(notes));
    }
}

function deleteNote(button) {
    const confirmDelete = confirm('Вы уверены, что хотите удалить эту заметку?');

    if (confirmDelete) {
        const noteElement = button.parentNode;
        noteElement.classList.add('fadeOut');
        setTimeout(() => {
            noteElement.remove();
            removeNoteFromLocalStorage(noteElement.dataset.id);
        }, 500);
    }
}

function loadNotes() {
    const notes = getNotesFromLocalStorage();
    const notesContainer = document.getElementById('notes-container');

    notes.forEach(note => {
        const noteElement = createNoteElement(note.id, note.theme, note.text);
        notesContainer.appendChild(noteElement);
    });
}

function getNotesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('notes')) || [];
}
