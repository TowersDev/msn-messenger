import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/account/login/login.module').then(
        (m) => m.LoginPageModule
      ),
    // canLoad: [IntroGuard, AutoLoginGuard]
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/account/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
    // canLoad: [IntroGuard, AutoLoginGuard]
  },
  {
    path: 'intro',
    loadChildren: () =>
      import('./pages/intro/intro.module').then((m) => m.IntroPageModule),
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./components/tabs/tabs.module').then((m) => m.TabsPageModule),
    // canLoad: [AuthGuard]
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./pages/account/settings/settings.module').then(
        (m) => m.SettingsPageModule
      ),
    // canLoad: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
