import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonContent, IonFooter, IonList } from '@ionic/angular';

@Component({
  selector: 'app-chat',
  templateUrl: 'chat.page.html',
  styleUrls: ['chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;

  name: string;
  message: string;
  listChat: any;
  user: any;

  data: any = {
    sender: '',
    message: '',
    date: new Date(),
  };

  constructor(
    private readonly firestore: AngularFirestore,
    public ngFireAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.ngFireAuth.authState.subscribe((user) => {
      this.user = user;
      this.loadChat();
    });
  }

  loadChat() {
    this.firestore
      .collection('messages')
      .valueChanges()
      .subscribe((message) => {
        this.listChat = message?.sort((a: any, b: any) => a.date - b.date);
      });
  }

  sendMessage() {
    this.data = {
      sender: this.user.email,
      message: this.message,
      date: new Date(),
    }; // ARREGLAR
    this.firestore
      .collection('messages')
      .add(this.data)
      .then((res) => {
        this.message = '';
        this.scrollToBottom();
      });
  }

  scrollToBottom() {
    this.content.scrollToBottom(300);
  }
}
