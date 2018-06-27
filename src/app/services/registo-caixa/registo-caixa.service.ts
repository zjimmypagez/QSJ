import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";

import { RegistoCaixaSId, RegistoCaixa, RegistoCaixaComentario } from '../../interfaces/registoCaixa';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
	})
};

@Injectable()
export class RegistoCaixaService {
	private apiName: string = "http://localhost:3003/registoCaixa";

	constructor( private http: HttpClient ) { }
	  
	// Carregar registos caixa - TODOS 
	getRegistoCaixa(): Observable<RegistoCaixa[]>{
		return this.http.get<RegistoCaixa[]>(this.apiName);
	}
	  
	// Inserir um novo registo de caixa
	createRegistoCaixa(newRegistoCaixa: RegistoCaixaSId){
		let body = JSON.stringify(newRegistoCaixa);
		return this.http.post(this.apiName, body, httpOptions);
	}

	// Editar um registo de caixa
	editRegistoCaixa(editRegistoCaixa: RegistoCaixaComentario){
		let body = JSON.stringify(editRegistoCaixa);
		return this.http.put(this.apiName + '/' + editRegistoCaixa.ID, body, httpOptions)
	}

}
