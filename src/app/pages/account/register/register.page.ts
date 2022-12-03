import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { validateEmail } from '../../../utils/validations';
import { isEmpty } from 'lodash';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SpinnerService } from 'src/app/services/spinner.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  ionicForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public messageService: MessageService,
    public router: Router,
    public authService: AuthenticationService,
    private navController: NavController,
    public afs: AngularFirestore,
    public spinnerService: SpinnerService
  ) {
    this.ionicForm = this.formBuilder.group({
      email: [''],
      nombre: [''],
      password: [''],
      repeatPassword: [''],
    });
  }

  ngOnInit() {
  }

  submitForm() {
    if (
      isEmpty(this.ionicForm.value.email) ||
      isEmpty(this.ionicForm.value.password) ||
      isEmpty(this.ionicForm.value.repeatPassword) ||
      isEmpty(this.ionicForm.value.nombre)
    ) {
      this.messageService.show('Todos los campos son obligatorios');
    } else if (!validateEmail(this.ionicForm.value.email)) {
      this.messageService.show('El email no es correcto');
    } else if (
      this.ionicForm.value.password !== this.ionicForm.value.repeatPassword
    ) {
      this.messageService.show('las contraseñas no coinciden');
    } else {
      this.spinnerService.showLoading();
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
            avatar: '',
            nombre: this.ionicForm.value.nombre
          });
          this.spinnerService.endLoading();
          this.router.navigate(['tabs/home']);
        })
        .catch((error) => {
          this.spinnerService.endLoading();
          this.messageService.show('El email ya está en uso.');
        });
    }
  }

  back() {
    this.navController.back();
  }
}
