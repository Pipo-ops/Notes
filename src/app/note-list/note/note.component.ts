import { Component, Input } from '@angular/core';
import { Note } from '../../interfaces/note.interface';
import { NoteListService } from '../../firebase-services/note-list.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss'
})
export class NoteComponent {
  @Input() note!:Note;
  edit = false;
  hovered = false;
  
  constructor(private noteService: NoteListService){}

  changeMarkedStatus(){
    this.note.marked = !this.note.marked;
    this.saveNote();
  }

  deleteHovered(){
    if(!this.edit){
      this.hovered = false;
    }
  }

  openEdit(){
    this.edit = true;
  }

  closeEdit(){
    this.edit = false;
    this.saveNote();
  }

  moveToTrash() {
    if (this.note.id) {
      const docId = this.note.id;
      const newNote: Note = { ...this.note, type: 'trash' };
      delete newNote.id;
  
      console.log('Moving note to trash with ID:', docId);
      this.noteService.addNote(newNote, 'trash');
      this.noteService.deleteNote('notes', docId);
    }
  }

  moveToNotes() {
    if (this.note.id) {
      const docId = this.note.id;
      const newNote: Note = { ...this.note, type: 'note' };
      delete newNote.id;
  
      console.log('Restoring note from trash with ID:', docId);
      this.noteService.addNote(newNote, 'notes');
      this.noteService.deleteNote('trash', docId);
    }
  }

  deleteNote(){
    if(this.note.id){ 
      this.noteService.deleteNote("trash", this.note.id); 
    }
  }

  saveNote(){
    this.noteService.updateNote(this.note)
  }
}
