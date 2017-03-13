import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../../services/authenticate.service';


@Component({
	selector: 'app-home',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css'],
	providers: [AuthenticateService]
})

export class SignUpComponent implements OnInit {

	private users;


	constructor(private dataService: AuthenticateService) {


		
		/* this.dataService.getUsers().subscribe(
			data => this.users = data,
			error => console.log(error),
			() => console.log(this.users)
		);*/
	}

	ngOnInit() {
		
	}
}
