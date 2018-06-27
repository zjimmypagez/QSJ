import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { User } from '../../interfaces/user';

const httpOptions = {
	headers: new Headers({
		'Content-Type': 'application/json'
	})
};

@Injectable()
export class AuthService {
	public token: string;
	private apiName: string = "http://localhost:3003/login";

  	constructor( private http: Http ) {
		var currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.token = currentUser && currentUser.token;
	}

	login(username: string, password: string): Observable<boolean>{
		let body = JSON.stringify({
			username: username,
			password: password
		});
		return this.http.post(this.apiName, body, httpOptions).map(
			(res: Response) => {
				let token = res.json() && res.json().token;
				let userLogado: User[] = res.json() && res.json().userLogado;
				if (token){	
					if (userLogado.length > 0){
						var user: User = {
							Id: userLogado[0].Id,
							Email: userLogado[0].Email,
							Username: userLogado[0].Username,
							_Password: userLogado[0]._Password,
							TipoUtilizador: userLogado[0].TipoUtilizador
						}
					}	
					else{
						var user: User = {
							Id: 0,
							Email: '',
							Username: 'admin',
							_Password: 'admin',
							TipoUtilizador: 0
						}
					}		
					this.token = token;
					localStorage.setItem(
						'currentUser',
						JSON.stringify({
							userID: user.Id,
							token: token
						})
					);
					return true;
				}
				else return false;
			}
		)
	}

	logout(){
		this.token = null;
		localStorage.removeItem('currentUser');
	}

}
