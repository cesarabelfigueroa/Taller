import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { AuthenticateService } from '../../services/authenticate.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
	providers: [AuthenticateService],
	entryComponents: [NavbarComponent]
})

export class HomeComponent  implements OnInit{
	private router;
	private route;
	private type;
	private promotions;
	private navbarItems;
	private user;

	constructor(dataService: AuthenticateService, router: Router, route: ActivatedRoute) {
		this.router = router;
		this.route = route;

		this.route.params.subscribe(params => {
			this.user = params['data'];
			console.log(params);
		});

		


		this.promotions = [{
			name: 'Food 2*1',
			image: '/assets/images/app.jpg',
			description: 'Pay one and have two',
			initDate: new Date(),
			endDate: new Date()
		}, {
			name: 'Food 2*1',
			image: '/assets/images/app.jpg',
			description: 'Pay one and have two',
			initDate: new Date(),
			endDate: new Date()
		}, {
			name: 'Food 2*1',
			image: '/assets/images/app.jpg',
			description: 'Pay one and have two',
			initDate: new Date(),
			endDate: new Date()
		}];

		this.navbarItems = [{
			name: 'Principal',
			isActive: true
		}, {
			name: 'Restaurantes'
		}, {
			name: 'Contact'
		}, {
			name: 'Restaurantes'
		}]
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			console.log(params); // (+) converts string 'id' to a number
			// In a real app: dispatch action to load the details here.
		});
	}
}