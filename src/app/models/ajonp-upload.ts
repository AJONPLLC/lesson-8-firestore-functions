import { AngularFireUploadTask } from '@angular/fire/storage';
import * as firebase from 'firebase/app';

export class AjonpUpload {
  createRef?: Promise<firebase.firestore.DocumentReference>;
  task?: AngularFireUploadTask;
  updateRef?: Promise<void>;
  constructor(createRef: Promise<firebase.firestore.DocumentReference>, task: AngularFireUploadTask,
    updateRef: Promise<void>) {
    this.createRef = createRef;
    this.task = task;
    this.updateRef = updateRef;
  }
}
