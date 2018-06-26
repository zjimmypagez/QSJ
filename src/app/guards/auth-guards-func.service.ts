import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuardsFuncService implements CanActivate {
  	
	constructor( private router: Router ) { }

	canActivate(){
		if (localStorage.getItem('currentUser')){
			var currentUser = JSON.parse(localStorage.getItem('currentUser'));
			var userId: any = currentUser.userID;
			if (userId != 0){				
				return true;
			}
			else{
				alert("Não tem permissões para aceder ao url pretendido!");	
				this.router.navigate(['/admin']);
				return false;
			}
		}
		alert("Proceda ao login antes de tentar aceder ao url pretendido!");
		this.router.navigate(['/login']);
		return false;
	}

}
