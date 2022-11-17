import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { IonContent, IonFooter, IonList } from '@ionic/angular';
import { ChatService } from 'src/app/services/chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: 'chat.page.html',
  styleUrls: ['chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  messages: Observable<any[]>;
  newMsg = '';

  constructor(private chatService: ChatService, private router: Router, public ngFireAuth: AngularFireAuth) { }

  ngOnInit() {
    this.messages = this.chatService.getChatMessages();
    this.ngFireAuth.authState.subscribe((user) => {
      console.log(user);
    });
  }

  sendMessage() {
    this.chatService.addChatMessage(this.newMsg).then(() => {
      this.newMsg = '';
      setTimeout(()=>{
        this.content.scrollToBottom(10);
      }, 50);


    });
  }

  signOut() {
    this.chatService.signOut().then(() => {
      this.router.navigateByUrl('/', { replaceUrl: true });
    });
  }

}
