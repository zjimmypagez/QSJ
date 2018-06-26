import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';

@Component({
	selector: 'app-home-func',
	templateUrl: './home-func.component.html',
	styleUrls: ['./home-func.component.css']
})
export class HomeFuncComponent implements OnInit {

	constructor( 
		private authService: AuthService,
		private router: Router
	) { }

	ngOnInit() {
	}

	logout(){
		this.authService.logout();
		this.router.navigate(['/login']);
	}

}
