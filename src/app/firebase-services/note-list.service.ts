import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collection, doc, collectionData, onSnapshot, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
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

  async deleteNote(colId: string, docId: string){
    await deleteDoc(this.getsingleDocRef(colId, docId)).catch(
      (err) => {console.error(err); }
    )
  }

  async updateNote(note:Note) {
    if (note.id){
      let docRef = this.getsingleDocRef(this.getColIdFromNote(note), note.id);
      await updateDoc(docRef, this.getCleanJson(note)).catch(
        (err) => {console.error(err); }
      ).then();
    }  
  }

  getCleanJson(note:Note){
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    }  
  }

  getColIdFromNote(note:Note){
    if(note.type == "note"){
      return "notes";
    } else {
      return "trash";
    }
  }

  async addNote(item: Note, colId: "notes" | "trash"){
    const ref = collection(this.firestore, colId);
    await addDoc(ref, item).catch(
      err => console.error(err)
    ).then(docRef => {
      console.log("Document written with ID: ", docRef?.id);
    });
  }

  ngonDestroy(){
    this.unsubNotes();
    this.unsubTrash();
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
        list.forEach(element => {
        this.trashNotes.push(this.setNoteObeject(element.data(), element.id));
        });
    });
  }

  subNotesList() {
    return onSnapshot(this.getNotesRef(), (list) => {
      this.normalNotes = [];
      list.forEach((element) => {
        const note = this.setNoteObeject(element.data(), element.id);
        this.normalNotes.push(note);
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
