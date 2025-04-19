import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collection, doc, collectionData, onSnapshot, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  unsubTrash;
  unsubNotes;

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubNotes = this.subNotesList();
    this.unsubTrash = this.subTrashList();
  }

  async addNote(item: {}){
    await addDoc(this.getNotesRef(), item).catch(
      (err) => {console.error(err)}  
    ).then(
      (docRef) => {console.log("Document written with ID: ", docRef?.id);},
    )
  }

  ngonDestroy(){
    this.unsubNotes();
    this.unsubTrash();
  }

  subTrashList(){
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach(element => {
        console.log(this.setNoteObeject(element.data(), element.id));
        this.trashNotes.push(this.setNoteObeject(element.data(), element.id));
    });
   });
  }

  subNotesList(){
    return onSnapshot(this.getNotesRef(), (list) => {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObeject(element.data(), element.id));
    });
   });
  }

  setNoteObeject(obj: any, id: string): Note {
    return {
      id: id,
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false,
    }
  }
  getNotesRef(){
    return collection(this.firestore, 'notes');
  }

  getTrashRef(){
    return collection(this.firestore, 'trash');
  }

  getsingleDocRef(colId: string, docId: string){
    return doc(collection(this.firestore, colId), docId);
  }

}
