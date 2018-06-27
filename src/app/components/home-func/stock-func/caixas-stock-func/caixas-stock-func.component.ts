import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { Observable } from "rxjs/observable";
import { Subscription } from 'rxjs/Subscription';

import { Caixa, CaixaEVinho } from '../../../../interfaces/caixa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

import { FiltrosService } from '../../../../services/funcoes-service/filtros.service';
import { OrdenarTablesService } from '../../../../services/funcoes-service/ordenar-tables.service';

import { VinhoServiceService } from '../../../../services/vinho/vinho-service.service';
import { CaixaServiceService } from '../../../../services/caixa/caixa-service.service';

@Component({
	selector: 'app-caixas-stock-func',
	templateUrl: './caixas-stock-func.component.html',
	styleUrls: ['./caixas-stock-func.component.css']
})
export class CaixasStockFuncComponent implements OnInit, OnDestroy {
	FiltroForm: FormGroup;
	// Dados filtros
	materiais: string[] = ["Cartão", "Madeira"];
	capacidades: number[] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500, 3.000, 6.000, 12.000];
	tipoVinhos: string[] = ["Verde", "Rosé", "Tinto", "Branco", "Espumante", "Quinta"];
	categorias: string[] = [];
	// Estado que determina se resulta alguma tabela do processo de filtragem
	estadoTabela: boolean = true;	
	// Tabela auxiliar no processo de filtragem
	caixasEVinhosFiltro: CaixaEVinho[] = [];
	// Lista de modelos de caixa a ler da BD
	caixasEVinhos: CaixaEVinho[] = [];
	// Lista auxiliar total de caixas a ler da BD
	caixasEVinhosAux: CaixaEVinho[];
	// Lista de modelos de vinho a ler da BD
	vinhos: TipoVinho[] = [];
	// Cálcula da quantidade total da tabela de caixas
	totalCaixas: number = 0;

	private subVinhos: Subscription;	
	private subCaixasEVinhos: Subscription;

	constructor( 
		private router: Router, 
		private fb: FormBuilder, 
		private filtroService: FiltrosService, 
		private ordenarService: OrdenarTablesService, 
		private vinhoService: VinhoServiceService,
		private caixaService: CaixaServiceService
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
		this.getCaixasEVinhos();		
	}

	ngOnDestroy(){
		this.subVinhos.unsubscribe();
		this.subCaixasEVinhos.unsubscribe();
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

	// Subcrição do service CaixaService e obtenção dos dados de todos as caixas com a operação JOIN com os vinhos provenientes da BD
	getCaixasEVinhos(){
		this.subCaixasEVinhos = this.caixaService.getCaixasEVinhos().subscribe(
			data => { 
				this.caixasEVinhos = data; 
				this.caixasEVinhosAux = data 
			},
			err => console.error(err),
			() => {
				this.ordenarService.ordenarTabelaMV(this.caixasEVinhos);
				this.ordenarService.ordenarTabelaMV(this.caixasEVinhosAux);
				this.iniQuantidade();
			}
		);
	}

	// Pesquisa a um determinada marca
	pesquisaMarca(form){
		var marca = form.marca;		
		if (marca != ""){
			if (form.material != "" || form.capacidade != "" || form.tipoVinho != "" || form.categoria != ""){
				if (this.caixasEVinhosFiltro.length != 0) this.caixasEVinhos = this.filtroService.pesquisaMarca(this.caixasEVinhosFiltro, marca);
				else this.caixasEVinhos = this.filtroService.pesquisaMarca(this.caixasEVinhos, marca);
				this.calcQuantidade(this.caixasEVinhos);
			}
			else{
				this.reloadCaixasEVinhos();
				this.caixasEVinhos = this.filtroService.pesquisaMarca(this.caixasEVinhos, marca);
				this.calcQuantidade(this.caixasEVinhos);
			} 													
			if (this.caixasEVinhos.length == 0){
				this.reloadCaixasEVinhos();
				this.clearQuantidade();
				this.estadoTabela = false;
			}
			else{
				this.calcQuantidade(this.caixasEVinhos);
				this.estadoTabela = true;
			} 
		}
	}

	// Filtros 
	onChange(){
		var filtro: any = this.FiltroForm.value;
		this.reloadCaixasEVinhos();
		if (filtro.marca != "") this.caixasEVinhos = this.filtroService.pesquisaMarca(this.caixasEVinhos, filtro.marca);
		if (filtro.material != "" || filtro.capacidade != "" || filtro.tipoVinho != "" || filtro.categoria != ""){
			this.caixasEVinhosFiltro = this.filtroService.filtroMaterialCapacidadeTipoVinhoCategoria(filtro, this.caixasEVinhos);
			this.caixasEVinhos = this.caixasEVinhosFiltro;
			if (this.caixasEVinhos.length == 0){
				this.clearQuantidade();
				this.estadoTabela = false;
			}
			else {
				this.calcQuantidade(this.caixasEVinhos);
				this.estadoTabela = true;
			}
		}
		else{
			if (filtro.marca != ""){
				this.caixasEVinhos = this.filtroService.pesquisaMarca(this.caixasEVinhos, filtro.marca);
				this.calcQuantidade(this.caixasEVinhos);
			}
			else{
				this.iniQuantidade();
				this.reloadCaixasEVinhos();
			} 
			this.caixasEVinhosFiltro = [];
			this.estadoTabela = true;
		}
	}

	// Limpar pesquisa
	clearTabela(){
		this.reloadCaixasEVinhos();
		this.iniQuantidade();
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

	// Valores de garrafas com e sem rotulo a 0
	clearQuantidade(){
		this.totalCaixas = 0;
	}

	// Calacular valores atuais de garrafas com e sem rotulo
	calcQuantidade(caixas: CaixaEVinho[]){
		this.clearQuantidade();
		for (let i = 0; i < caixas.length; i++){
			this.totalCaixas += caixas[i].Stock;
		}
	}

	// Valores iniciais da contagem das garrafas com e sem rotulo
	iniQuantidade(){
		this.clearQuantidade();
		for (let i = 0; i < this.caixasEVinhos.length; i++){
			this.totalCaixas += this.caixasEVinhos[i].Stock;
		}
	}

	// Recarregamento de todos as caixas
	reloadCaixasEVinhos(){
		this.caixasEVinhos = [];
		this.caixasEVinhos = this.caixasEVinhosAux;
	}

}