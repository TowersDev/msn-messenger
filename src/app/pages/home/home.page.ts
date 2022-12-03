import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavigationExtras, Router } from '@angular/router';
import { IonModal, ToastController } from '@ionic/angular';
import { ChatService } from 'src/app/services/chat.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { MessageService } from 'src/app/services/message.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit{
  @ViewChild(IonModal) modal: IonModal;
  user: any;
  email: string[];
  message: string;
  parrots: any;

  constructor(
    private afs: AngularFirestore,
    private chatService: ChatService,
    private toastController: ToastController,
    private spinnerService: SpinnerService,
    private router: Router,
    public ngFireAuth: AngularFireAuth, private messageService: MessageService) {
  }

  ngOnInit() {
    this.ngFireAuth.authState.subscribe((user) => {
      this.user = user;
    });



    this.afs.collection('parrots', (ref) => ref.orderBy('date'))
      .valueChanges({ idField: 'id' })
      .subscribe(res => this.parrots = res);

  }

  goToProfile() {
    this.router.navigate(['profile']);
  }

  someThingLikeLogOut() {
    console.log('icon action');
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    // this.afs.doc(`parrots/${this.user.uid}`).set({
    //   message:
    //     {
    //       email: this.user.email,
    //       message: this.message,
    //       nombre: this.user.displayName,
    //       date: new Date()
    //     }
    //   }).then(res => {
    //
    //     }).catch(error => {
    //       this.messageService.show(error);
    //       this.spinnerService.endLoading();
    //     });
    this.afs.collection('parrots').add({
      email: this.user.email,
      message: this.message,
      nombre: this.user.displayName,
      date: new Date()
    });
    this.messageService.show('Se ha creado correctamente');
    this.spinnerService.endLoading();
    this.modal.dismiss(null, 'cancel');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  prueba(event: any){
    console.log(event.target.value);
    this.message = event.target.value;
  }
}
