import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthenticationService } from '../../services/authentication.service';
import { ActionSheetController , Platform, ToastController} from '@ionic/angular';

// import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { ImagePicker, ImagePickerOptions } from '@awesome-cordova-plugins/image-picker/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';



// import { File } from '@awesome-cordova-plugins/File/ngx';
// import { Crop } from '@ionic-native/crop/ngx';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  user: any;
  imageUrl: any;
  url: any;
  constructor(
    public authService: AuthenticationService,
    public ngFireAuth: AngularFireAuth,
    private actionSheet: ActionSheetController,
    private camera: Camera,
    private platform: Platform,
    public toastController: ToastController,
    private imagePicker: ImagePicker,
    private webView: WebView,
    private storage: AngularFireStorage,
    private afs: AngularFirestore
    // private file: File,
    // public crop: Crop
  ) { }

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

  async uploadImage(uri) {
    this.presentToast(uri);
    const response = await fetch(uri);
    const blob = await response.blob();

    const ref = this.storage.ref(`avatar/${this.user.uid}`);
    return ref.put(blob);
  };

  actualizarAvatar(image: any) {

    this.storage.ref(`avatar/${this.user.uid}`).getDownloadURL().toPromise()
    .then(async (res) => {
      const update = {
        photoURL: res,
      };
      return (await this.ngFireAuth.currentUser).updateProfile(update);
    })
    .catch(() => this.presentToast('Error al actualizar el avatar.'));
    this.afs.collection('users').doc(this.user.uid).update({
      avatar: image, // Photo URL from Firebase Storage will be saved in here.
    }).then(() => {
      console.log('success');
    })
    .catch(error => {
      console.log('errors');
    });

  }

  elegirDesdeCamara(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      mediaType: this.camera.MediaType.PICTURE,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.CAMERA,
      correctOrientation: true
    };

    this.camera.getPicture(options).then((image) => {
        this.imageUrl =   this.webView.convertFileSrc(image);
        this.uploadImage(this.imageUrl)
        .then(() => {
          this.actualizarAvatar(this.imageUrl);
        })
        .catch((error) => {
          this.presentToast(error);
        });
    }, error => {
      console.log('No se ha realizado ninguna foto');
    });
  }

  elegirDesdeGallery(){
    this.imagePicker.hasReadPermission().then(res => {
      console.log('permissiopns status = ', res);
      if (res === false) {
        this.imagePicker.requestReadPermission().then(res1 => {
          console.log('requested permissions status = ',res1);
        });
      } else {
        const options: ImagePickerOptions = {
          quality: 100,
          maximumImagesCount: 1,
          width: 500,
          height: 500,
        };
        this.imagePicker.getPictures(options).then((result) => {
          console.log('selected photos = ', result);
          if(result.length > 0) {

            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for(let i=0; i<result.length; i++){
              this.url =  this.webView.convertFileSrc(result[i]);
            }
            this.uploadImage(this.url)
            .then(() => {
              this.actualizarAvatar(this.imageUrl);
            })
            .catch((error) => {
              this.presentToast(error);
            });
          }
        }, error => {
          console.log('No se ha seleccionado ninguna imagen');
        });
      }
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
            console.log('select image from gallery');
          }
        },
        {
          text: 'selet camera',
          handler: () => {
            console.log('select camera');
            this.elegirDesdeCamara(this.camera.PictureSourceType.CAMERA);
            console.log(this.platform.is('cordova'));
          }
        }
      ]
    });
    await actionSheet.present();
  }
}



