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
export class RecuperarService {
	private apiName: string = "http://localhost:3003/recuperarPassword";

	constructor( private http: Http ) { }
	
	recuperarPassword(user: User){
		let body = JSON.stringify({
			to: user.Email,
			username: user.Username,
			userID: user.Id
		});
		return this.http.post(this.apiName, body, httpOptions);
	}

}
