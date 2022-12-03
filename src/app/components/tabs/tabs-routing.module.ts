import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../../pages/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'search',
        loadChildren: () => import('../../pages/search/search.module').then(m => m.SearchPageModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('../../pages/notifications/notifications.module').then(m => m.NotificationsPageModule)
      },
      {
        path: 'messages',
        loadChildren: () => import('../../pages/messages/messages.module').then(m => m.MessagesPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
