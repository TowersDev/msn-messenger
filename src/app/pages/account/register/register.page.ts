import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { validateEmail } from '../../../utils/validations';
import { isEmpty } from 'lodash';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  ionicForm: FormGroup;
  constructor(public formBuilder: FormBuilder, public toastController: ToastController, public router: Router,
    public authService: AuthenticationService, private navController: NavController) {
    this.ionicForm = this.formBuilder.group({
      email: [''],
      password: [''],
      repeatPassword: ['']
    });
  }

  ngOnInit() {
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
    if ( isEmpty(this.ionicForm.value.email) || isEmpty(this.ionicForm.value.password) || isEmpty(this.ionicForm.value.repeatPassword)) {
        this.presentToast('Todos los campos son obligatorios');
    } else if (!validateEmail(this.ionicForm.value.email)) {
      this.presentToast('El email no es correcto');
    } else if (this.ionicForm.value.password !== this.ionicForm.value.repeatPassword) {
      this.presentToast('las contraseñas no coinciden');
    } else {
      this.authService.registerUser(this.ionicForm.value.email, this.ionicForm.value.password)
      .then((res) => {
        this.router.navigate(['tabs/account']);
      }).catch((error) => {
        this.presentToast('El email ya está en uso.');
      });
    }
  }

  back() {
    this.navController.back();
  }


}
