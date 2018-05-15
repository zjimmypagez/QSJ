import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { User } from '../../../interfaces/user';
import { Encomenda } from '../../../interfaces/encomenda';

@Component({
	selector: 'app-encomendas-func',
	templateUrl: './encomendas-func.component.html',
	styleUrls: ['./encomendas-func.component.css']
})
export class EncomendasFuncComponent implements OnInit {
	// Dados Filtro
	FiltroForm: FormGroup;
	estadoTabela: boolean = true;  
	
	// Lista de utilizadores a ler da BD
	users: User[];
	// Lista de encomendas a ler da BD
  	encomendas: Encomenda[];
  	// Tabela interligada entre utilizadores caixas e encomendas
	tabelaEncomendas: tableEncomenda[];

	constructor( private router: Router, private fb: FormBuilder ) { 
		this.FiltroForm = fb.group({
			'nFatura': [null, ]
		});
	}

	ngOnInit() {
		this.iniListaUsers();
		this.iniListaEncomendas();
		this.tabelaEncomendas = this.iniListatTableEncomenda(this.users, this.encomendas);
	}

	// Filtrar segundo pesquisa
	filtrar(form){
		var nFatura = form.nFatura;
		if (nFatura != null){
			var tabelaNFatura: tableEncomenda[] = [];
			for (let i = 0; i < this.tabelaEncomendas.length; i++){
				if (this.tabelaEncomendas[i].nFatura == nFatura)
					tabelaNFatura.push(this.tabelaEncomendas[i]);
			}
			if (tabelaNFatura.length == 0){
				this.estadoTabela = false;
			}
			else{
				this.estadoTabela == true;
				this.tabelaEncomendas = tabelaNFatura;
			}
		}
		else{
			alert("Insira números válidos!");
			this.FiltroForm.controls['nFatura'].setValue(null);
		}
	}

	// Clear Tabela
	clearTabela(){
		this.tabelaEncomendas = this.iniListatTableEncomenda(this.users, this.encomendas);
		this.estadoTabela = true;
		this.FiltroForm.controls['nFatura'].setValue(null);
	}

	// Função responsável por selecionar a encomenda a ser visualizada
	verEncomenda(id: number){
		this.router.navigate(['/func/encomendas/ver', id]);
	}

	// Função responsável por selecionar a encomenda a ser editada
   editarEncomenda(id: number){
		this.router.navigate(['/func/encomendas/editar', id]);
	}
	
	// Função responsável por eliminar a encomenda selecionada
	eliminarEncomenda(id: number){
		// Ver, na BD, se é possivel apagar a encomenda selecionada
	}

	// Dados criados (A ser subsituido pela ligação à BD)
	public iniListaUsers(){
		this.users = [{
			id: 1,
			email: 'user1@gmail.com',
			username: 'user1',
			password: '123456'
		},
		{
			id: 2,
			email: 'user2@gmail.com',
			username: 'user2',
			password: '123456'
		}];
	}

	// Dados criados (A ser subsituido pela ligação à BD)
	public iniListaEncomendas(){
		this.encomendas = [{
			id: 1,
			idUser: 2,
			data: new Date(2017, 4, 2),
			dataFinal: null,
			nFatura: 11568920,
			comentario: 'Restaurante XPTO',
			estado: false // false - Em espera; true - Finalizado
		 },
		 {
			id: 2,
			idUser: 1,
			data: new Date(2012, 3, 25),
			dataFinal: new Date(2012, 4, 25),
			nFatura: 25134859,
			comentario: '',
			estado: true
		 }];
	}

	// Interligação entre duas listas: User e Encomenda
	public iniListatTableEncomenda(users: User[], encomendas: Encomenda[]): tableEncomenda[]{
		var table: tableEncomenda[] = [];

		for (let i = 0; i < encomendas.length; i++){
			for (let j = 0; j < users.length; j++){
				if (encomendas[i].idUser == users[j].id){
					var tableObj: tableEncomenda = {
						id: encomendas[i].id,
						username: users[j].username,
						data: encomendas[i].data,
						dataFinal: encomendas[i].dataFinal,
						nFatura: encomendas[i].nFatura,
						comentario: encomendas[i].comentario,
						estado: encomendas[i].estado
					}
					table.push(tableObj);
				}
			}
		}

		table.sort(
			function(obj1, obj2){
				return obj2.data.getTime() - obj1.data.getTime();
		})
		
		return table;
	}

}

// Interface que interliga 2 tabelas = User + Encomenda 
interface tableEncomenda{
	id: number,
	username: string,
	data: Date,
	dataFinal: Date,
	nFatura: number,
	comentario: string,
	estado: boolean
}