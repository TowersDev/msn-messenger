import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { SwiperModule } from 'swiper/angular';

import { HomePageRoutingModule } from './home-routing.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HomePageRoutingModule,
    ComponentsModule,
    SwiperModule
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
