import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";

import { EncomendaEUser, Encomenda, EncomendaSId, EncomendaVer, EncomendaAlterar } from '../../interfaces/encomenda';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
	})
};

@Injectable()
export class EncomendaService {
	private apiName: string = "http://localhost:3003/encomenda";

  	constructor( private http: HttpClient ) { }

	// Carregar caixas 
	getEncomendas(): Observable<Encomenda[]>{
		return this.http.get<Encomenda[]>(this.apiName);
	}

	// Carregar encomendas + utilizadores - JOIN
	getEncomendaEUsers(): Observable<EncomendaEUser[]>{
		return this.http.get<EncomendaEUser[]>(this.apiName + 'User');
	}
	
	// Carregar encomendas + caixas + vinhos + garrafas + tipo_caixa + quantidade_garrafa - JOIN
	getEncomendaVinhoCaixaGarrafaQntGarrafaETipoCaixa(): Observable<EncomendaVer[]>{
		return this.http.get<EncomendaVer[]>(this.apiName + 'VinhoCG');
	}

	// Criar nova encomenda
	createEncomenda(novaEncomenda: EncomendaSId){
		let body = JSON.stringify(novaEncomenda);
		return this.http.post(this.apiName, body, httpOptions);
	}

	// Editar uma encomenda
	editEncomenda(editEncomenda: EncomendaAlterar){
		let body = JSON.stringify(editEncomenda);
		return this.http.put(this.apiName + '/' + editEncomenda.Id, body, httpOptions)
	}


}
