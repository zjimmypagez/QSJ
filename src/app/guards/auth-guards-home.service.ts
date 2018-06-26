import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuardsHomeService implements CanActivate {

	  constructor( private router: Router ) { }
	  
	  canActivate(){
		if (localStorage.getItem('currentUser')){
			var currentUser = JSON.parse(localStorage.getItem('currentUser'));
			var userId: any = currentUser.userID;
			if (userId == 0){
				alert("Faça logout para aceder de novo a página inicial!");	
				this.router.navigate(['/admin']);			
				return false;
			}
			else{
				alert("Faça logout para aceder de novo a página inicial!");	
				this.router.navigate(['/func']);
				return false;
			}
		}
		return true;
	}

}
