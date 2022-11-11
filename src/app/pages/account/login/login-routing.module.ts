import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsPage } from 'src/app/components/tabs/tabs.page';
import { HomePage } from '../../home/home.page';
import { RegisterPage } from '../register/register.page';

import { LoginPage } from './login.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
  // {
  //   path: '',
  //   loadChildren: () => import('../../../components/tabs/tabs.module').then(m => m.TabsPageModule)
  // }
  // { path: 'login', component: LoginPage},
  // { path: 'register', component: RegisterPage},
  // { path: 'tabs', component: TabsPage},
  // {
  //   path: 'tabs',
  //   loadChildren: () => import('../../../components/tabs/tabs.module').then(m => m.TabsPageModule),
  //   children: [{
  //     path: 'home',
  //     loadChildren: () => import('../../../pages/home/home.module').then(m => m.HomePageModule),
  //   }
  //   ]
  // },

  // {
  //   path: '',
  //   redirectTo: '/login',
  //   pathMatch: 'full'
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
