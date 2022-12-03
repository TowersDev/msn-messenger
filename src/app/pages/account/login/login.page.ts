import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { validateEmail } from '../../../utils/validations';
import { isEmpty } from 'lodash';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  ionicForm: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    public authService: AuthenticationService,
    public router: Router,
    public spinnerService: SpinnerService,
  ) {
    this.ionicForm = this.formBuilder.group({
      email: [''],
      password: [''],
    });
  }

  ngOnInit() {}

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
    });
    toast.present();
  }

  submitForm() {
    console.log(this.ionicForm.value.email);
    if (
      isEmpty(this.ionicForm.value.email) ||
      isEmpty(this.ionicForm.value.password)
    ) {
      this.presentToast('Todos los campos son obligatorios');
    } else if (!validateEmail(this.ionicForm.value.email)) {
      this.presentToast('El email no es correcto');
    } else {
      this.spinnerService.showLoading();
      this.authService.signIn(this.ionicForm.value.email, this.ionicForm.value.password)
      .then((res) => {
        this.spinnerService.endLoading();
        this.router.navigate(['tabs']);
      }).catch((error) => {
        this.spinnerService.endLoading();
        this.presentToast('Email o contraseña incorrecta');
      });
    }
  }

  registrarFacebook() {
    this.spinnerService.showLoading();
    this.authService.facebookAuth()
    .then((res) => {
      this.spinnerService.endLoading();
      this.router.navigate(['tabs/account']);
    }).catch((error) => {
      this.spinnerService.endLoading();
      this.presentToast('El email ya está en uso.');
    });
  }

  registrarGoogle() {
    this.spinnerService.showLoading();
    this.authService.googleAuth()
    .then((res) => {
      this.spinnerService.endLoading();
      this.router.navigate(['tabs/account']);
    }).catch((error) => {
      this.spinnerService.endLoading();
      this.presentToast('El email ya está en uso.');
    });
  }


}
