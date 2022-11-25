import {
  Component,
  ElementRef,
  OnInit,
  AfterViewInit,
  ViewChild,
  SimpleChanges,
} from '@angular/core';
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
export class ChatPage implements OnInit, AfterViewInit {
  @ViewChild(IonContent) content: IonContent;

  messages: Observable<any[]>;
  newMsg = '';
  user: any;

  constructor(
    private chatService: ChatService,
    private router: Router,
    public ngFireAuth: AngularFireAuth
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.messages = this.chatService.getChatMessages(this.content);
    this.ngFireAuth.authState.subscribe((user) => {
      this.user = user;
    });
  }

  sendMessage() {
    this.chatService.addChatMessage(this.newMsg).then(() => {
      this.newMsg = '';
      this.content.scrollToBottom(40);
    });
  }

  signOut() {
    this.chatService.signOut().then(() => {
      this.router.navigateByUrl('/', { replaceUrl: true });
    });
  }

  getTime(time: Date) {
    return  time;
  }
}
