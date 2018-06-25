import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";

import { UserSId, User } from '../../interfaces/user';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
	})
};

@Injectable()
export class UserServiceService {
	private apiName: string = "http://localhost:3003/user";
	
	constructor( private http: HttpClient ){}
	
	// Carregar todos os utilizadores
	getUsers(): Observable<User[]>{
		return this.http.get<User[]>(this.apiName);
	}
		
	// Inserir um novo utilizador
	createUser(newUser: UserSId){
		let body = JSON.stringify(newUser);
		return this.http.post(this.apiName, body, httpOptions);
	}

	// Editar um utilizador
	editUser(editUser: User){
		let body = JSON.stringify(editUser);
		return this.http.put(this.apiName + '/' + editUser.Id, body, httpOptions)
	}

	// Eliminar utilizador - por ID
	deleteUserById(id: number){
		return this.http.delete(this.apiName + '/' + id);
	}

}
