import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { Observable } from "rxjs/observable";
import { Subscription } from 'rxjs/Subscription';

import { Caixa, CaixaVinhoRegistoEUser } from '../../../interfaces/caixa';
import { RegistoCaixa } from '../../../interfaces/registoCaixa';
import { TipoVinho } from '../../../interfaces/tipoVinho';

import { JoinTablesService } from '../../../services/funcoes-service/join-tables.service';
import { FiltrosService } from '../../../services/funcoes-service/filtros.service';
import { OrdenarTablesService } from '../../../services/funcoes-service/ordenar-tables.service';

import { VinhoServiceService } from '../../../services/vinho/vinho-service.service';
import { CaixaServiceService } from '../../../services/caixa/caixa-service.service';

@Component({
	selector: 'app-caixas-func',
	templateUrl: './caixas-func.component.html',
	styleUrls: ['./caixas-func.component.css']
})
export class CaixasFuncComponent implements OnInit, OnDestroy {
	FiltroForm: FormGroup;
	// Dados filtros
	materiais: string[] = ["Cartão", "Madeira"];
	capacidades: number[] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500, 3.000, 6.000, 12.000];
	tipoVinhos: string[] = ["Verde", "Rosé", "Tinto", "Branco", "Espumante", "Quinta"];
	categorias: string[] = [];
	// Estado que determina se resulta alguma tabela do processo de filtragem
	estadoTabela: boolean = true;
	// Tabela auxiliar no processo de filtragem
	caixaVinhoRegistoEUserFiltro: CaixaVinhoRegistoEUser[] = [];
  	// Lista de modelos de caixas a ler da BD
	caixaVinhoRegistoEUser: CaixaVinhoRegistoEUser[] = [];	
	// Lista auxiliar total de caixas a ler da BD
	caixaVinhoRegistoEUserAux: CaixaVinhoRegistoEUser[];
	// Lista de modelos de vinho a ler da BD
	vinhos: TipoVinho[] = [];
	
	private subVinhos: Subscription;
	private subCaixaVinhoRegistoEUser: Subscription;

	constructor( 
		private router: Router, 
		private fb: FormBuilder, 
		private filtroService: FiltrosService, 
		private joinTableService: JoinTablesService,
		private vinhoService: VinhoServiceService,
		private caixaService: CaixaServiceService,
		private ordenarService: OrdenarTablesService
	) { 
		this.FiltroForm = fb.group({
			'marca': ['', Validators.required],
			'material': [0, ],
			'capacidade': [0, ],
			'tipoVinho': [0, ],
			'categoria': [0, ]
		});
	}

	ngOnInit() {
		this.getVinhos();
		this.getCaixaVinhoRegistoEUser();	
	}

	ngOnDestroy(){
		this.subVinhos.unsubscribe();
		this.subCaixaVinhoRegistoEUser.unsubscribe();	
	}

	// Subcrição do service VinhoService e obtenção dos dados de todos os vinhos provenientes da BD
	getVinhos(){
		this.subVinhos = this.vinhoService.getVinhos().subscribe(
			data => { 
				this.vinhos = data 
			},
			err => console.error(err),
			() => {
				this.categorias = this.filtroService.iniFiltroCategoria(this.vinhos);
			}
		);
	}

	// Subcrição do service CaixaService e obtenção dos dados de todos as caixas com a operação JOIN com os vinhos provenientes e registos da BD
	getCaixaVinhoRegistoEUser(){
		this.subCaixaVinhoRegistoEUser = this.caixaService.getCaixaVinhoRegistoEUser().subscribe(
			data => { 
				this.caixaVinhoRegistoEUser = data;
				this.caixaVinhoRegistoEUserAux = data 
			},
			err => console.error(err),
			() => {
				this.ordenarService.ordenarTabelaData(this.caixaVinhoRegistoEUser);
				this.ordenarService.ordenarTabelaData(this.caixaVinhoRegistoEUserAux);
			}
		);
	}

	// Função responsável por selecionar o registo de caixa a ser editado
   editarRegisto(id: number){
		this.router.navigate(['/func/caixas/editar', id]);
	}

	// Pesquisa a um determinada marca
	pesquisaMarca(form){
		var marca = form.marca;		
		if (marca != ""){
			if (form.material != "" || form.capacidade != "" || form.tipoVinho != "" || form.categoria != ""){
				if (this.caixaVinhoRegistoEUserFiltro.length != 0) this.caixaVinhoRegistoEUser = this.filtroService.pesquisaMarca(this.caixaVinhoRegistoEUserFiltro, marca);
				else this.caixaVinhoRegistoEUser = this.filtroService.pesquisaMarca(this.caixaVinhoRegistoEUser, marca);
			}
			else{
				this.reloadCaixaVinhoRegistoEUser();
				this.caixaVinhoRegistoEUser = this.filtroService.pesquisaMarca(this.caixaVinhoRegistoEUser, marca);
			} 
			if (this.caixaVinhoRegistoEUser.length == 0){
				this.reloadCaixaVinhoRegistoEUser();
				this.estadoTabela = false;
			}
			else this.estadoTabela = true;
		}
	}

	// Filtros 
	onChange(){
		var filtro: any = this.FiltroForm.value;
		this.reloadCaixaVinhoRegistoEUser();
		if (filtro.marca != "") this.caixaVinhoRegistoEUser = this.filtroService.pesquisaMarca(this.caixaVinhoRegistoEUser, filtro.marca);		
		if (filtro.material != "" || filtro.capacidade != "" || filtro.tipoVinho != "" || filtro.categoria != ""){
			this.caixaVinhoRegistoEUserFiltro = this.filtroService.filtroMaterialCapacidadeTipoVinhoCategoria(filtro, this.caixaVinhoRegistoEUser);
			this.caixaVinhoRegistoEUser = this.caixaVinhoRegistoEUserFiltro;
			if (this.caixaVinhoRegistoEUser.length == 0) this.estadoTabela = false;
			else this.estadoTabela = true;
		}
		else{
			if (filtro.marca != "") this.caixaVinhoRegistoEUser = this.filtroService.pesquisaMarca(this.caixaVinhoRegistoEUser, filtro.marca);
			else this.reloadCaixaVinhoRegistoEUser();
			this.caixaVinhoRegistoEUserFiltro = [];
			this.estadoTabela = true;
		}
	}
	
	// Limpar pesquisa
	clearTabela(){
		this.reloadCaixaVinhoRegistoEUser();
		this.estadoTabela = true;
		this.clearForm();
	}

	// Limpar Form
	clearForm(){
		this.FiltroForm.controls['marca'].reset('');
		this.FiltroForm.controls['material'].reset(0);
		this.FiltroForm.controls['capacidade'].reset(0);
		this.FiltroForm.controls['tipoVinho'].reset(0);
		this.FiltroForm.controls['categoria'].reset(0);
	}

	// Recarregamento de todos as garrafas
	reloadCaixaVinhoRegistoEUser(){
		this.caixaVinhoRegistoEUser = [];
		this.caixaVinhoRegistoEUser = this.caixaVinhoRegistoEUserAux;
	}

}