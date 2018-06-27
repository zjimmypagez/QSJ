import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { Observable } from "rxjs/observable";
import { Subscription } from 'rxjs/Subscription';

import { Garrafa, GarrafaVinhoRegistoEUser } from '../../../interfaces/garrafa';
import { TipoVinho } from '../../../interfaces/tipoVinho';
import { RegistoGarrafa } from '../../../interfaces/registoGarrafa';

import { FiltrosService } from '../../../services/funcoes-service/filtros.service';
import { OrdenarTablesService } from '../../../services/funcoes-service/ordenar-tables.service';

import { VinhoServiceService } from '../../../services/vinho/vinho-service.service';
import { GarrafaServiceService } from '../../../services/garrafa/garrafa-service.service';

@Component({
	selector: 'app-garrafas-func',
	templateUrl: './garrafas-func.component.html',
	styleUrls: ['./garrafas-func.component.css']
})
export class GarrafasFuncComponent implements OnInit, OnDestroy {
	FiltroForm: FormGroup;
	// Dados filtros
	anos: number[] = [];
	capacidades: number[] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500, 3.000, 6.000, 12.000];
	tipoVinhos: string[] = ["Verde", "Rosé", "Tinto", "Branco", "Espumante", "Quinta"];
	categorias: string[] = [];
	// Estado que determina se resulta alguma tabela do processo de filtragem
	estadoTabela: boolean = true;
	// Tabela auxiliar no processo de filtragem
	garrafaVinhoRegistoEUserFiltro: GarrafaVinhoRegistoEUser[] = [];
  	// Lista de modelos de garrafa a ler da BD
	garrafaVinhoRegistoEUser: GarrafaVinhoRegistoEUser[] = [];	
	// Lista auxiliar total de garrafas a ler da BD
	garrafaVinhoRegistoEUserAux: GarrafaVinhoRegistoEUser[];
	// Lista de modelos de vinho a ler da BD
	vinhos: TipoVinho[] = [];

	private subVinhos: Subscription;
	private subGarrafaVinhoRegistoEUser: Subscription;

	constructor( 
		private router: Router, 
		private fb: FormBuilder, 
		private filtroService: FiltrosService,
		private ordenarService: OrdenarTablesService, 
		private vinhoService: VinhoServiceService,
		private garrafaService: GarrafaServiceService
	) { 
		this.FiltroForm = fb.group({
			'marca': ['', Validators.required],
			'ano': [0, ],
			'capacidade': [0, ],
			'tipoVinho': [0, ],
			'categoria': [0, ]
		});
	}

	ngOnInit() {
		this.getVinhos();
		this.getGarrafaVinhoRegistoEUser();
	}

	ngOnDestroy(){
		this.subVinhos.unsubscribe();
		this.subGarrafaVinhoRegistoEUser.unsubscribe();	
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
	
	// Subcrição do service GarrafaService e obtenção dos dados de todos as garrafas com a operação JOIN com os vinhos provenientes e registos da BD
	getGarrafaVinhoRegistoEUser(){
		this.subGarrafaVinhoRegistoEUser = this.garrafaService.getGarrafaVinhoRegistoEUser().subscribe(
			data => { 
				this.garrafaVinhoRegistoEUser = data;
				this.garrafaVinhoRegistoEUserAux = data 
			},
			err => console.error(err),
			() => {
				this.anos = this.filtroService.iniFiltroAno(this.garrafaVinhoRegistoEUser);
				this.ordenarService.ordenarTabelaData(this.garrafaVinhoRegistoEUser);
				this.ordenarService.ordenarTabelaData(this.garrafaVinhoRegistoEUserAux);
			}
		);
	}

	// Função responsável por selecionar o registo de garrafa a ser editado
   editarRegisto(id: number){
		this.router.navigate(['/func/garrafas/editar', id]);
	}

	// Pesquisa a um determinada marca
	pesquisaMarca(form){
		var marca = form.marca;		
		if (marca != ""){
			if (form.ano != 0 || form.capacidade != 0 || form.tipoVinho != 0 || form.categoria != 0){
				if (this.garrafaVinhoRegistoEUserFiltro.length != 0) this.garrafaVinhoRegistoEUser = this.filtroService.pesquisaMarca(this.garrafaVinhoRegistoEUserFiltro, marca);
				else this.garrafaVinhoRegistoEUser = this.filtroService.pesquisaMarca(this.garrafaVinhoRegistoEUser, marca);
			}
			else{
				this.reloadGarrafaVinhoRegistoEUser();
				this.garrafaVinhoRegistoEUser = this.filtroService.pesquisaMarca(this.garrafaVinhoRegistoEUser, marca);
			}
			if (this.garrafaVinhoRegistoEUser.length == 0) {
				this.reloadGarrafaVinhoRegistoEUser();
				this.estadoTabela = false;
			}				
			else this.estadoTabela = true;
		}
	}

	// Filtros 
	onChange(){
		var filtro: any = this.FiltroForm.value;
		this.reloadGarrafaVinhoRegistoEUser();
		if (filtro.marca != "") this.garrafaVinhoRegistoEUser = this.filtroService.pesquisaMarca(this.garrafaVinhoRegistoEUser, filtro.marca);
		if (filtro.ano != 0 || filtro.capacidade != 0 || filtro.tipoVinho != 0 || filtro.categoria != 0){
			this.garrafaVinhoRegistoEUserFiltro = this.filtroService.filtroAnoCapacidadeTipoVinhoCategoria(filtro, this.garrafaVinhoRegistoEUser);
			this.garrafaVinhoRegistoEUser = this.garrafaVinhoRegistoEUserFiltro;
			if (this.garrafaVinhoRegistoEUser.length == 0) this.estadoTabela = false;
			else this.estadoTabela = true;
		}
		else{
			if (filtro.marca != "") this.garrafaVinhoRegistoEUser = this.filtroService.pesquisaMarca(this.garrafaVinhoRegistoEUser, filtro.marca);
			this.reloadGarrafaVinhoRegistoEUser();
			this.garrafaVinhoRegistoEUserFiltro = [];
			this.estadoTabela = true;
		}
	}

	// Limpar pesquisa
	clearTabela(){
		this.reloadGarrafaVinhoRegistoEUser();
		this.estadoTabela = true;
		this.clearForm();
	}

	// Limpar Form
	clearForm(){
		this.FiltroForm.controls['marca'].reset('');
		this.FiltroForm.controls['ano'].reset(0);
		this.FiltroForm.controls['capacidade'].reset(0);
		this.FiltroForm.controls['tipoVinho'].reset(0);
		this.FiltroForm.controls['categoria'].reset(0);
	}

	// Recarregamento de todos as garrafas
	reloadGarrafaVinhoRegistoEUser(){
		this.garrafaVinhoRegistoEUser = [];
		this.garrafaVinhoRegistoEUser = this.garrafaVinhoRegistoEUserAux;
	}	

}