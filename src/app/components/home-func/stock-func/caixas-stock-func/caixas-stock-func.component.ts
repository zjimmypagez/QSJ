import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { Caixa } from '../../../../interfaces/caixa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

import { FiltrosService } from '../../../../services/funcoes-service/filtros.service';
import { JoinTablesService } from '../../../../services/funcoes-service/join-tables.service';

@Component({
	selector: 'app-caixas-stock-func',
	templateUrl: './caixas-stock-func.component.html',
	styleUrls: ['./caixas-stock-func.component.css']
})
export class CaixasStockFuncComponent implements OnInit {
	FiltroForm: FormGroup;
	// Dados filtros
	materiais: string[] = ["Cartão", "Madeira"];
	capacidades: number[] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500, 3.000, 6.000, 12.000];
	tipoVinhos: string[] = ["Verde", "Rosé", "Tinto", "Branco", "Espumante", "Quinta"];
	categorias: string[] = [];
	// Estado que determina se resulta alguma tabela do processo de filtragem
	estadoTabela: boolean = true;
	// Tabela auxiliar no processo de filtragem
	tabelaFiltro: tableCaixa[] = [];
	// Lista de modelos de caixa a ler da BD
	caixas: Caixa[];
	// Lista de modelos de vinho a ler da BD
	vinhos: TipoVinho[];
	// Tabela interligada entre caixas e vinhos
	tabelaCaixas: tableCaixa[];	
	// Cálcula da quantidade total da tabela de caixas
	totalCaixas: number = 0;

	constructor( private router: Router, private fb: FormBuilder, private filtroService: FiltrosService, private joinTableService: JoinTablesService ) { 
		this.FiltroForm = fb.group({
			'marca': ['', Validators.required],
			'material': [0, ],
			'capacidade': [0, ],
			'tipoVinho': [0, ],
			'categoria': [0, ]
		});
	}

	ngOnInit() {
		this.iniListaCaixas();
		this.iniListaVinhos();
		this.iniQuantidade();
		this.tabelaCaixas = this.joinTableService.iniListaTableCaixas(this.caixas, this.vinhos);
		this.categorias = this.filtroService.iniFiltroCategoria(this.vinhos);
	}

	// Pesquisa a um determinada marca
	pesquisaMarca(form){
		var marca = form.marca;		
		if (marca != ""){
			if (form.material != "" || form.capacidade != "" || form.tipoVinho != "" || form.categoria != ""){
				if (this.tabelaFiltro.length != 0) this.tabelaCaixas = this.filtroService.pesquisaMarca(this.tabelaFiltro, marca);
				else this.tabelaCaixas = this.filtroService.pesquisaMarca(this.tabelaCaixas, marca);
				this.calcQuantidade(this.tabelaCaixas);
			}
			else{
				this.tabelaCaixas = this.joinTableService.iniListaTableCaixas(this.caixas, this.vinhos);
				this.tabelaCaixas = this.filtroService.pesquisaMarca(this.tabelaCaixas, marca);
				this.calcQuantidade(this.tabelaCaixas);
			} 													
			if (this.tabelaCaixas.length == 0){
				this.tabelaCaixas = this.joinTableService.iniListaTableCaixas(this.caixas, this.vinhos);
				this.clearQuantidade();
				this.estadoTabela = false;
			}
			else{
				this.calcQuantidade(this.tabelaCaixas);
				this.estadoTabela = true;
			} 
		}
	}

	// Filtros 
	onChange(){
		var filtro: any = this.FiltroForm.value;
		this.tabelaCaixas = this.joinTableService.iniListaTableCaixas(this.caixas, this.vinhos);
		if (filtro.marca != "") this.tabelaCaixas = this.filtroService.pesquisaMarca(this.tabelaCaixas, filtro.marca);
		if (filtro.material != "" || filtro.capacidade != "" || filtro.tipoVinho != "" || filtro.categoria != ""){
			this.tabelaFiltro = this.filtroService.filtroMaterialCapacidadeTipoVinhoCategoria(filtro, this.tabelaCaixas);
			this.tabelaCaixas = this.tabelaFiltro;
			if (this.tabelaCaixas.length == 0){
				this.clearQuantidade();
				this.estadoTabela = false;
			}
			else {
				this.calcQuantidade(this.tabelaCaixas);
				this.estadoTabela = true;
			}
		}
		else{
			if (filtro.marca != ""){
				this.tabelaCaixas = this.filtroService.pesquisaMarca(this.tabelaCaixas, filtro.marca);
				this.calcQuantidade(this.tabelaCaixas);
			}
			else{
				this.iniQuantidade();
				this.tabelaCaixas = this.joinTableService.iniListaTableCaixas(this.caixas, this.vinhos);
			} 
			this.tabelaFiltro = [];
			this.estadoTabela = true;
		}
	}

	// Limpar pesquisa
	clearTabela(){
		this.tabelaCaixas = this.joinTableService.iniListaTableCaixas(this.caixas, this.vinhos);
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
	calcQuantidade(caixas){
		this.clearQuantidade();
		for (let i = 0; i < caixas.length; i++){
			this.totalCaixas += caixas[i].quantidade;
		}
	}

	// Valores iniciais da contagem das garrafas com e sem rotulo
	iniQuantidade(){
		this.clearQuantidade();
		for (let i = 0; i < this.caixas.length; i++){
			this.totalCaixas += this.caixas[i].quantidade;
		}
	}

   // Dados criados (A ser subsituido pela ligação à BD)
   iniListaCaixas(){
   	this.caixas = [{
      	id: 1,
         capacidade: 1.000,
         garrafas: 3,
         material: 'Madeira',
			tipoVinho: 1,
			quantidade: 250
      },
      {
         id: 2,
         capacidade: 0.750,
         garrafas: 12,
         material: 'Cartão',
			tipoVinho: 2,
			quantidade: 50
      },
      {
         id: 3,
         capacidade: 0.750,
         garrafas: 12,
         material: 'Cartão',
			tipoVinho: 3,
			quantidade: 50
      },
      {
         id: 4,
         capacidade: 0.750,
         garrafas: 12,
         material: 'Cartão',
			tipoVinho: 2,
			quantidade: 50
      },
      {
         id: 5,
         capacidade: 0.750,
         garrafas: 12,
         material: 'Cartão',
			tipoVinho: 1,
			quantidade: 50
      },
      {
         id: 6,
         capacidade: 0.750,
         garrafas: 12,
         material: 'Cartão',
			tipoVinho: 1,
			quantidade: 50
      }];
	}
	
	// Dados criados (A ser subsituido pela ligação à BD)
	iniListaVinhos(){
		this.vinhos = [{
			id: 1,
			marca: 'Flor São José',
			tipo: 'Verde',
			categoria: ''
		},
		{
			id: 2,
			marca: 'Quinta São José',
			tipo: 'Rosé',
			categoria: 'Grande Reserva'
		},
		{
			id: 3,
			marca: 'Quinta São José',
			tipo: 'Tinto',
			categoria: ''
		}];
	}

}

// Interface que interliga 2 tabelas = Caixa + Tipo de Vinho 
interface tableCaixa{
	id: number,
   capacidade: number,
   garrafas: number,
   material: string,
	marca: string, // Atributo marca da tabela Tipo de vinho
	tipo: string, // Atributo tipo da tabela Tipo de Vinho
	categoria: string; // Atributo categoria da tabela Tipo de Vinho
	quantidade: number
}
