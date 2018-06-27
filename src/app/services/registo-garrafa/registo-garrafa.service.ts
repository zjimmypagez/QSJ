import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";

import { RegistoGarrafaSId, RegistoGarrafa, RegistoGarrafaComentario } from '../../interfaces/registoGarrafa';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
	})
};

@Injectable()
export class RegistoGarrafaService {
	private apiName: string = "http://localhost:3003/registoGarrafa";

	constructor( private http: HttpClient ) { }

	// Carregar registos garrafa - TODOS 
	getRegistoGarrafa(): Observable<RegistoGarrafa[]>{
		return this.http.get<RegistoGarrafa[]>(this.apiName);
	}
	  
	// Inserir um novo registo de garrafa
	createRegistoGarrafa(newRegistoGarrafa: RegistoGarrafaSId){
		let body = JSON.stringify(newRegistoGarrafa);
		return this.http.post(this.apiName, body, httpOptions);
	}

	// Editar um registo de garrafa
	editRegistoGarrafa(editRegistoGarrafa: RegistoGarrafaComentario){
		let body = JSON.stringify(editRegistoGarrafa);
		return this.http.put(this.apiName + '/' + editRegistoGarrafa.ID, body, httpOptions)
	}

}
