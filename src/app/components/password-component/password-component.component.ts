import { Component, ContentChild } from '@angular/core';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-password-component',
  templateUrl: './password-component.component.html',
  styleUrls: ['./password-component.component.scss'],
})
export class PasswordComponentComponent {
  @ContentChild(IonInput) input!: IonInput;
  showPassword = false;

  constructor() {}

  toggleShow() {
    this.showPassword = !this.showPassword;
    this.input.type = this.showPassword ? 'text' : 'password';
  }
}
