import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { User } from '../../../interfaces/user';
import { Encomenda } from '../../../interfaces/encomenda';

import { JoinTablesService } from '../../../services/funcoes-service/join-tables.service';
import { FiltrosService } from '../../../services/funcoes-service/filtros.service';

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

	constructor( private router: Router, private fb: FormBuilder, private filtroService: FiltrosService, private joinTableService: JoinTablesService ) { 
		this.FiltroForm = fb.group({
			'nFatura': [null, ]
		});
	}

	ngOnInit() {
		this.iniListaUsers();
		this.iniListaEncomendas();
		this.tabelaEncomendas = this.joinTableService.iniListaTableEncomenda(this.users, this.encomendas);
	}

	// Filtrar segundo pesquisa
	filtrar(form){
		var nFatura = form.nFatura;
		if (nFatura != null){
			this.tabelaEncomendas = this.filtroService.pesquisaNFatura(this.tabelaEncomendas, nFatura);
			if (this.tabelaEncomendas.length == 0)
				this.estadoTabela = false;
			else
				this.estadoTabela == true;
		}
		else{
			alert("Insira números válidos!");
			this.FiltroForm.controls['nFatura'].setValue(null);
		}
	}

	// Clear Tabela
	clearTabela(){
		this.tabelaEncomendas = this.joinTableService.iniListaTableEncomenda(this.users, this.encomendas);
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