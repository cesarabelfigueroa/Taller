import { Component } from '@angular/core';
import { AuthenticateService } from '../../services/authenticate.service';
@Component({
	selector: 'app-root',
	templateUrl: './login.controller.html',
	styleUrls: ['./login.controller.css'],
	providers: [AuthenticateService]
})

export class LoginComponent {

	private user;


	constructor(private dataService: AuthenticateService) {
		this.user = {};
	}


	submitLogin() {
		console.log(this.user);
		
	}

}
