import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonContent, IonList } from '@ionic/angular';

@Component({
  selector: 'app-chat',
  templateUrl: 'chat.page.html',
  styleUrls: ['chat.page.scss']
})
export class ChatPage implements OnInit{
  @ViewChild('pru') scroll: any;
  name: string;
  message: string;
  listChat: any;
  user: any;

  constructor(private readonly firestore: AngularFirestore, public ngFireAuth: AngularFireAuth) {}

  ngOnInit() {
    this.ngFireAuth.authState.subscribe((user) => {
      this.user = user;
    });

    this.firestore.collection('messages').valueChanges().subscribe((message) => {
      this.listChat = message?.sort((a: any,b: any) => a.date - b.date);
    });
  }

  prueba() {
    const prueba = {
      sender: this.user.email,
      message: this.message,
      date: new Date(),
    };
    this.firestore.collection('messages').add(prueba);
    this.message = '';

    this.scrollToBottom();


  }

  scrollToBottom() {
    this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
  }
}
