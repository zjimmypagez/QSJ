import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";

import { GarrafaSIdCSRotulo, Garrafa } from '../../interfaces/garrafa';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
	})
};

@Injectable()
export class GarrafaServiceService {
	private apiName: string = "http://localhost:3003/garrafa";

	constructor( private http: HttpClient ){}

	// Carregar garrafas 
	getGarrafas(){
		return this.http.get(this.apiName);
	}

	// Carregar garrafas + vinhos - JOIN
	getGarrafasEVinhos(){
		return this.http.get(this.apiName + 'Vinho');
	}
		
	// Inserir uma nova garrafa
	createGarrafa(newGarrafa: GarrafaSIdCSRotulo){
		let body = JSON.stringify(newGarrafa);
		return this.http.post(this.apiName, body, httpOptions);
	}

	// Editar uma garrafa
	editGarrafa(editGarrafa: Garrafa){
		let body = JSON.stringify(editGarrafa);
		return this.http.put(this.apiName + '/' + editGarrafa.Id, body, httpOptions)
	}

	// Eliminar garrafa - por ID
	deleteGarrafaById(id: number){
		return this.http.delete(this.apiName + '/' + id);
	}

}
