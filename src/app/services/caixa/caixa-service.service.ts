import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";

import { CaixaSIdStock, Caixa } from '../../interfaces/caixa';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
	})
};

@Injectable()
export class CaixaServiceService {
	private apiName: string = "http://localhost:3003/caixa";

	constructor( private http: HttpClient ){}

	// Carregar caixas 
	getCaixas(){
		return this.http.get(this.apiName);
	}

	// Carregar caixas + vinhos - JOIN
	getCaixasEVinhos(){
		return this.http.get(this.apiName + 'Vinho');
	}
		
	// Inserir uma nova caixa
	createCaixa(newCaixa: CaixaSIdStock){
		let body = JSON.stringify(newCaixa);
		return this.http.post(this.apiName, body, httpOptions);
	}

	// Editar uma caixa
	editCaixa(editCaixa: Caixa){
		let body = JSON.stringify(editCaixa);
		return this.http.put(this.apiName + '/' + editCaixa.ID, body, httpOptions)
	}

	// Eliminar caixa - por ID
	deleteCaixaById(id: number){
		return this.http.delete(this.apiName + '/' + id);
	}

}
