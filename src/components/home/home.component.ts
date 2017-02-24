import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticateService } from '../../services/authenticate.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
	providers: [AuthenticateService]
})

export class HomeComponent {
	private router;
	private type;

	constructor(dataService: AuthenticateService, router: Router) {
		this.router = router;
		this.type = 'client';
	}
}