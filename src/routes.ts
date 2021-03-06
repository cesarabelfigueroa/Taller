import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.controller';
import { SignUpComponent } from './components/signup/signup.component';

const routes: Routes = [
	{ path: 'login', component: LoginComponent, pathMatch: 'prefix' },
	{ path: 'signup', component: SignUpComponent, pathMatch: 'prefix' },
	{ path: 'home', component: HomeComponent,pathMatch: 'prefix' },
	{ path: '', redirectTo: 'login',  pathMatch: 'full'}
];

export const routing = RouterModule.forRoot(routes);