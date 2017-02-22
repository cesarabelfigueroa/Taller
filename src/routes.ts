import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.controller';

const routes: Routes = [
  { path: '#/login', component: LoginComponent , pathMatch: 'full'},
  { path: '#/home', component: HomeComponent , pathMatch: 'full'}
];

export const routing = RouterModule.forRoot(routes);