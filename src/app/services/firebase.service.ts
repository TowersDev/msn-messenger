import { Injectable } from '@angular/core';

import {
  AngularFirestore,
} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(public firestore: AngularFirestore) {}

  // getBares() {
  //   return this.firestore.collection('bares').valueChanges();
  // }
}
