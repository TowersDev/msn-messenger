import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthenticationService } from '../../services/authentication.service';
import {
  ActionSheetController,
  LoadingController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SpinnerService } from 'src/app/services/spinner.service';
import { ChatService } from 'src/app/services/chat.service';
import { Router } from '@angular/router';

export interface User {
  uid: string;
  email: string;
  photoURL: string;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  currentUser: User = null;

  user: any;
  imageUrl: any;
  url: any;

  constructor(
    public authService: AuthenticationService,
    public ngFireAuth: AngularFireAuth,
    private actionSheet: ActionSheetController,
    private camera: Camera,
    private platform: Platform,
    private webView: WebView,
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private spinnerService: SpinnerService,
    public chatService: ChatService,
    private router: Router
  ) {this.ngFireAuth.onAuthStateChanged((user) => {
    this.currentUser = user;
  });}

  ngOnInit() {
    this.ngFireAuth.authState.subscribe((user) => {
      this.user = user;
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
    });
    toast.present();
  }

  elegirDesdeCamara(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      mediaType: this.camera.MediaType.PICTURE,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.CAMERA,
      correctOrientation: true,
    };

    this.camera.getPicture(options).then(
      (image) => {
        this.spinnerService.showLoading();
        this.imageUrl = this.webView.convertFileSrc(image);
        this.uploadImage(this.imageUrl)
          .then(() => {
            this.actualizarAvatar();
          })
          .catch((error) => {
            this.presentToast('error al elegir desde la cámara');
            this.spinnerService.endLoading();
          });
      },
      (error) => {
        console.log('No se ha realizado ninguna foto');
      }
    );
  }

  elegirDesdeGallery() {
    const options: CameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI
    };
    this.camera.getPicture(options).then(
      (image) => {
        this.spinnerService.showLoading();
        this.imageUrl = this.webView.convertFileSrc(image);
        this.uploadImage(this.imageUrl)
          .then(() => {
            this.actualizarAvatar();
          })
          .catch((error) => {
            this.spinnerService.endLoading();
            this.presentToast(error);
          });
      },
      (error) => {
        console.log('No se ha seleccionado ninguna imagen');
      }
    );
  }

  async uploadImage(uri) {
    const response = await fetch(uri);
    const blob = await response.blob();

    const ref = this.storage.ref(`avatar/${this.user.uid}`);
    return ref.put(blob);
  }

  actualizarAvatar() {
    this.storage
      .ref(`avatar/${this.user.uid}`)
      .getDownloadURL()
      .toPromise()
      .then(async (res) => {
        const update = {
          photoURL: res,
        };
        return (await this.ngFireAuth.currentUser).updateProfile(update);
      })
      .catch(() => this.presentToast('Error al actualizar el avatar.'));
    this.afs
      .collection('users')
      .doc(this.user.uid)
      .update({
        avatar: this.currentUser.photoURL, // Photo URL from Firebase Storage will be saved in here.
      })
      .then(() => {
        this.spinnerService.endLoading();
        this.presentToast('Se ha actualizado la imagen correctamente');
      })
      .catch((error) => {
        console.log('errors');
      });
  }

  async insertarAvatar() {
    const actionSheet = await this.actionSheet.create({
      header: 'Select image',
      buttons: [
        {
          text: 'select image from gallery',
          handler: () => {
            this.elegirDesdeGallery();
          },
        },
        {
          text: 'selet camera',
          handler: () => {
            this.elegirDesdeCamara(this.camera.PictureSourceType.CAMERA);
          },
        },
      ],
    });
    await actionSheet.present();
  }

  logout() {
    this.chatService.signOut();
    this.router.navigate(['/login']);
  }
}
