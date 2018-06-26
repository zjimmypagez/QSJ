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

	login(user: User){
		let body = JSON.stringify({
			username: user.Username
		});
		return this.http.post(this.apiName, body, httpOptions).map(
			(res: Response) => {
				let token = res.json() && res.json().token;
				if (token){
					this.token = token;
					localStorage.setItem(
						'currentUser',
						JSON.stringify({
							userID: user.Id,
							token: token
						})
					);
				}
			}
		)
	}

	logout(){
		this.token = null;
		localStorage.removeItem('currentUser');
	}

}
