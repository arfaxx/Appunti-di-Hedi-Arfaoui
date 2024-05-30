document.addEventListener('DOMContentLoaded', () => {
    const noteForm = document.getElementById('note-form');
    const noteText = document.getElementById('note-text');
    const fileInput = document.getElementById('file-input');
    const categorySelect = document.getElementById('category-select');
    const notesContainer = document.getElementById('notes-container');
    let editingNoteId = null;

    const loadNotes = () => {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        notesContainer.innerHTML = '';
        notes.forEach(note => addNoteToDOM(note));
    };

    const saveNotes = (notes) => {
        localStorage.setItem('notes', JSON.stringify(notes));
    };

    const addNoteToDOM = (note) => {
        const noteElement = document.createElement('div');
        noteElement.classList.add('note');

        const noteTextElement = document.createElement('div');
        noteTextElement.classList.add('note-text');
        noteTextElement.textContent = note.text;

        const noteCategoryElement = document.createElement('div');
        noteCategoryElement.classList.add('note-category');
        noteCategoryElement.textContent = note.category;

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => {
            const notes = JSON.parse(localStorage.getItem('notes')) || [];
            const updatedNotes = notes.filter(n => n.id !== note.id);
            saveNotes(updatedNotes);
            loadNotes();
        };

        const editButton = document.createElement('button');
        editButton.classList.add('edit-btn');
        editButton.textContent = 'Edit';
        editButton.onclick = () => {
            noteText.value = note.text;
            categorySelect.value = note.category;
            editingNoteId = note.id;
        };

        noteElement.appendChild(noteCategoryElement);
        noteElement.appendChild(noteTextElement);

        if (note.attachment) {
            const attachmentLink = document.createElement('a');
            attachmentLink.classList.add('attachment');
            attachmentLink.href = note.attachment;
            attachmentLink.textContent = 'Attachment';
            attachmentLink.target = '_blank';
            noteElement.appendChild(attachmentLink);
        }

        noteElement.appendChild(editButton);
        noteElement.appendChild(deleteButton);
        notesContainer.appendChild(noteElement);
    };

    noteForm.onsubmit = (e) => {
        e.preventDefault();
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        const noteId = editingNoteId ? editingNoteId : Date.now().toString();
        const note = {
            id: noteId,
            text: noteText.value,
            category: categorySelect.value,
            attachment: ''
        };

        const saveAndRenderNote = () => {
            if (editingNoteId) {
                const index = notes.findIndex(n => n.id === editingNoteId);
                notes[index] = note;
                editingNoteId = null;
            } else {
                notes.push(note);
            }
            saveNotes(notes);
            loadNotes();
            noteText.value = '';
            categorySelect.value = 'General';
            fileInput.value = '';
        };

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                note.attachment = event.target.result;
                saveAndRenderNote();
            };
            reader.readAsDataURL(file);
        } else {
            saveAndRenderNote();
        }
    };

    loadNotes();
});
