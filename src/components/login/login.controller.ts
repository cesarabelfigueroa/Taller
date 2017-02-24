import { Component } from '@angular/core';
import { AuthenticateService } from '../../services/authenticate.service';
import { Router } from '@angular/router';


@Component({
	selector: 'app-root',
	templateUrl: './login.controller.html',
	styleUrls: ['./login.controller.css'],
	providers: [AuthenticateService]
})

export class LoginComponent {

	private user;
	private router;


	constructor(private dataService: AuthenticateService, router: Router) {
		this.user = {};
		this.router = router;
	}

	submitLogin() {
		this.router.navigate(['/home/'])
	}
}
