import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';

@Component({
	selector: 'app-home-admin',
	templateUrl: './home-admin.component.html',
	styleUrls: ['./home-admin.component.css']
})
export class HomeAdminComponent implements OnInit {

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
