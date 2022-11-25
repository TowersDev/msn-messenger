import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { validateEmail } from '../../../utils/validations';
import { isEmpty } from 'lodash';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  ionicForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    public router: Router,
    public authService: AuthenticationService,
    private navController: NavController,
    public afs: AngularFirestore
  ) {
    this.ionicForm = this.formBuilder.group({
      email: [''],
      nombre: [''],
      password: [''],
      repeatPassword: [''],
    });
  }

  ngOnInit() {
    // if (!this.avatar) {
    //   this.avatar = 'https://ionicframework.com/docs/img/demos/avatar.svg';
    // }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
    });
    toast.present();
  }

  submitForm() {
    console.log(this.ionicForm.value);
    if (
      isEmpty(this.ionicForm.value.email) ||
      isEmpty(this.ionicForm.value.password) ||
      isEmpty(this.ionicForm.value.repeatPassword) ||
      isEmpty(this.ionicForm.value.nombre)
    ) {
      this.presentToast('Todos los campos son obligatorios');
    } else if (!validateEmail(this.ionicForm.value.email)) {
      this.presentToast('El email no es correcto');
    } else if (
      this.ionicForm.value.password !== this.ionicForm.value.repeatPassword
    ) {
      this.presentToast('las contraseñas no coinciden');
    } else {
      this.authService
        .registerUser(this.ionicForm.value.email, this.ionicForm.value.password)
        .then((res) => {
          const profile = {
            displayName: this.ionicForm.value.nombre,
            // photoURL: this.avatar,
          };
          this.authService.updateName(profile);
          this.afs.doc(`users/${res.user.uid}`).set({
            uid: res.user.uid,
            email: this.ionicForm.value.email,
            // avatar: this.avatar,
          });
          this.router.navigate(['tabs/account']);
        })
        .catch((error) => {
          this.presentToast('El email ya está en uso.');
        });
    }
  }

  back() {
    this.navController.back();
  }
}
