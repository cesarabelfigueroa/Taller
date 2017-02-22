import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
	selector: 'app-root',
	templateUrl: './app.controller.html',
	styleUrls: ['./app.controller.css']
})

export class AppComponent {

	public router: Router;

	constructor(router: Router) {
		this.router = router;
		this.router.navigate(['/login/']);
	}
}