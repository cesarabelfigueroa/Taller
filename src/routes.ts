import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.controller';

const routes: Routes = [
	{ path: 'login', component: LoginComponent, pathMatch: 'prefix' },
	{ path: 'home', component: HomeComponent, pathMatch: 'prefix' },
	{ path: '', redirectTo: 'login',  pathMatch: 'full'}
];

export const routing = RouterModule.forRoot(routes);