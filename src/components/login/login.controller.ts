import { Component } from '@angular/core';
import { AuthenticateService } from '../../services/authenticate.service';
import { Router, Route } from '@angular/router';


@Component({
	selector: 'app-root',
	templateUrl: './login.controller.html',
	styleUrls: ['./login.controller.css'],
	providers: [AuthenticateService]
})

export class LoginComponent {

	private user;
	private data = {};
	private router;


	constructor(private dataService: AuthenticateService, router: Router) {
		this.user = {};
		this.router = router;
	}

	submitLogin() {

		this.dataService.getUsers(this.user).subscribe(
			data => this.data = data,
			error => console.log(error),
			() => this.validUser(this.data)
		);




		// console.log(AuthenticateService);
	}


	validUser(data: any) {
		if (data && data[0] && data[0].name) {
			this.router.navigate(['/home/'], JSON.stringify({ data: { entity: 'entity' }}) );
		}
	}
}
