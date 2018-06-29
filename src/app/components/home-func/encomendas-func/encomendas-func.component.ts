import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { Observable } from "rxjs/observable";
import { Subscription } from 'rxjs/Subscription';

import { User } from '../../../interfaces/user';
import { Encomenda, EncomendaEUser } from '../../../interfaces/encomenda';

import { FiltrosService } from '../../../services/funcoes-service/filtros.service';
import { OrdenarTablesService } from '../../../services/funcoes-service/ordenar-tables.service';

import { EncomendaService } from '../../../services/encomenda/encomenda.service';

@Component({
	selector: 'app-encomendas-func',
	templateUrl: './encomendas-func.component.html',
	styleUrls: ['./encomendas-func.component.css']
})
export class EncomendasFuncComponent implements OnInit, OnDestroy {
	FiltroForm: FormGroup;
	// Dados Filtro	
	estadoTabela: boolean = true;  
	// Tabela auxiliar no processo de filtragem
	encomendasEUserFiltro: EncomendaEUser[] = [];
  	// Lista de encomendas a ler da BD
	encomendasEUser: EncomendaEUser[] = [];	
	// Lista auxiliar total de encomendas a ler da BD
	encomendasEUserAux: EncomendaEUser[];

	private subEncomendaEUser: Subscription;

	constructor( 
		private router: Router, 
		private fb: FormBuilder, 
		private filtroService: FiltrosService, 
		private ordenarService: OrdenarTablesService,
		private encomendaService: EncomendaService 
	) { 
		this.FiltroForm = fb.group({
			'estado': [0, ],
			'nFatura': ['', Validators.required]
		});
	}

	ngOnInit() {
		this.getEncomendaEUsers();
	}

	ngOnDestroy(){
		this.subEncomendaEUser.unsubscribe();
	}
	
	// Subcrição do service EncomendaService e obtenção dos dados de todos as encomendas provenientes da BD
	getEncomendaEUsers(){
		this.subEncomendaEUser = this.encomendaService.getEncomendaEUsers().subscribe(
			data => { 
				this.encomendasEUser = data;
				this.encomendasEUserAux = data;
			},
			err => console.error(err),
			() => {
				this.ordenarService.ordenarTabelaDataV1(this.encomendasEUser);
				this.ordenarService.ordenarTabelaDataV1(this.encomendasEUserAux);
			}
		);
	}

	// Eliminar encomenda por Id e recarregamento dos dados de todas as encomendas provenientes da BD
	deleteEncomendaById(id: number){
		const deleteEncomenda = this.encomendaService.deleteEncomendaById(id).subscribe(
			data => data,
			err => console.error(err),
			() => {
				setTimeout(() => {
					alert("A encomenda foi eliminada com sucesso!");
					this.getEncomendaEUsers();				
				}, 500);
			}
		);		
	}

	// Função responsável por selecionar a encomenda a ser visualizada
	verEncomenda(id: number){
		this.router.navigate(['/func/encomendas/ver', id]);
	}

	// Função responsável por selecionar a encomenda a ser eliminada
   eliminarEncomenda(id: number){
		if (confirm("Quer mesmo eliminar esta encomenda?")) this.deleteEncomendaById(id);
	}

	// Filtrar segundo pesquisa
	filtrar(form){
		var nFatura = form.nFatura;
		if (nFatura != ''){
			if (form.estado != 0){
				if (this.encomendasEUserFiltro.length != 0) this.encomendasEUser = this.filtroService.pesquisaNFatura(this.encomendasEUserFiltro, nFatura);
				else this.encomendasEUser = this.filtroService.pesquisaNFatura(this.encomendasEUser, nFatura);
			}
			else{
				this.reloadEncomendaEUser();
				this.encomendasEUser = this.filtroService.pesquisaNFatura(this.encomendasEUser, nFatura);
			}
			if (this.encomendasEUser.length == 0){
				this.reloadEncomendaEUser();
				this.estadoTabela = false;
			}
			else this.estadoTabela = true;
		}
	}

	// Filtros
	onChange(){
		var filtro: any = this.FiltroForm.value;
		this.reloadEncomendaEUser();
		if (filtro.nFatura != "") this.encomendasEUser = this.filtroService.pesquisaNFatura(this.encomendasEUser, filtro.nFatura);
		if (filtro.estado != 0){
			this.encomendasEUserFiltro = this.filtroService.filtroEstado(filtro, this.encomendasEUser);
			this.encomendasEUser = this.encomendasEUserFiltro;
			if (this.encomendasEUser.length == 0) this.estadoTabela = false;
			else this.estadoTabela = true;
		}
		else{
			if (filtro.nFatura != "") this.encomendasEUser = this.filtroService.pesquisaNFatura(this.encomendasEUser, filtro.nFatura);
			else this.reloadEncomendaEUser();
			this.encomendasEUserFiltro = [];
			this.estadoTabela = true;
		}
	}

	// Clear Tabela
	clearTabela(){
		this.reloadEncomendaEUser();
		this.estadoTabela = true;
		this.clearForm();
	}

	// Limpar Form
	clearForm(){
		this.FiltroForm.controls['nFatura'].reset('');
	}

	// Recarregamento de todos as garrafas
	reloadEncomendaEUser(){
		this.encomendasEUser = [];
		this.encomendasEUser = this.encomendasEUserAux;
	}

}