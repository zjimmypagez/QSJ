import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";

import { TipoVinhoSId, TipoVinho } from '../../interfaces/tipoVinho';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
	})
};

@Injectable()
export class VinhoServiceService {
	private apiName: string = "http://localhost:3003/vinho";

  	constructor( private http: HttpClient ){}

	// Carregar todos os vinhos
	getVinhos(): Observable<any>{
		return this.http.get(this.apiName);
	}
		
	// Inserir um novo vinho
	createVinho(newVinho: TipoVinhoSId){
		let body = JSON.stringify(newVinho);
		return this.http.post(this.apiName, body, httpOptions);
	}

	// Editar um vinho
	editVinho(editVinho: TipoVinho){
		let body = JSON.stringify(editVinho);
		return this.http.put(this.apiName + '/' + editVinho.ID, body, httpOptions)
	}

	// Eliminar vinho - por ID
	deleteVinhoById(id: number){
		return this.http.delete(this.apiName + '/' + id);
	}

}
