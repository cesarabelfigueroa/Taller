import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../../services/authenticate.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
	providers: [AuthenticateService]
})

export class HomeComponent implements OnInit {

	private users;





	constructor(private dataService: AuthenticateService) {

		this.dataService.getUsers().subscribe(
			data => this.users = data,
			error => console.log(error),
			() => console.log(this.users)
		);

		console.log('try');

	}

	ngOnInit() {
	}
}
