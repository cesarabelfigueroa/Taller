import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Directive, HostListener, ElementRef, Input, Output, EventEmitter } from '@angular/core'
import { AuthenticateService } from '../../services/authenticate.service';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css'],
	providers: [AuthenticateService]
})

export class NavbarComponent {
	@Input('items') items:any;

	constructor() {

	
	}
}