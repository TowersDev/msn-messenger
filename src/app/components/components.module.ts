import { NgModule } from '@angular/core';
import { PasswordComponentComponent } from './password-component/password-component.component';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

@NgModule({
  declarations: [PasswordComponentComponent],
  exports: [PasswordComponentComponent],
  imports: [IonicModule.forRoot()],
})
export class ComponentsModule {}
