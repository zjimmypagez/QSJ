import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { Encomenda } from '../../../../interfaces/encomenda';
import { Caixa } from '../../../../interfaces/caixa';
import { Garrafa } from '../../../../interfaces/garrafa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

@Component({
	selector: 'app-inserir-encomenda-func',
	templateUrl: './inserir-encomenda-func.component.html',
	styleUrls: ['./inserir-encomenda-func.component.css']
})
export class InserirEncomendaFuncComponent implements OnInit {
	DadosEncomendaForm: FormGroup;
	DadosEncomenda: formDadosEncomenda;

	DadosCaixaForm: FormGroup;
	DadosGarrafaForm: FormGroup;

	caixaSelecionado: boolean = false;
	garrafaSelecionado: boolean = false;

	// Lista de modelos de caixa a ler da BD
	caixas: Caixa[];
	// Lista de modelos de garrafa a ler da BD
	garrafas: Garrafa[];
	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[];
	// Lista de encomendas a ler da BD
	encomendas: Encomenda[];
	// Tabela interligada entre caixas e vinhos
	tabelaCaixas: tableCaixa[];	
	// Tabela interligada entre garrafas e vinhos
	tabelaGarrafas: tableGarrafa[];

	modeloCaixaSelecionado: boolean = false;
	modeloGarrafaSelecionado: boolean = false;

	constructor( private router: Router, private fb: FormBuilder ) { 
		this.DadosEncomendaForm = fb.group({
			'nFatura': ['', Validators.compose([Validators.required, Validators.min(1)])],
			'comentario': ['', Validators.maxLength(200)]
		});
	}

	ngOnInit() {	
		this.iniListaCaixas();
		this.iniListaGarrafas();
		this.iniListaVinhos();
		this.iniListaEncomendas();		

		this.tabelaCaixas = this.iniListatTableCaixas(this.caixas, this.vinhos);
		this.tabelaGarrafas = this.iniListatTableGarrafas(this.garrafas, this.vinhos);
	}

	// Criar encomenda após verificações
	novoRegisto(dadosEncomenda){
		console.log(dadosEncomenda);
	}

	// Selecionar encomenda por caixas
	selecionarCaixa(){
		if (this.caixaSelecionado){
			this.caixaSelecionado = false;
		}
		else{
			this.garrafaSelecionado = false;
			this.caixaSelecionado = true;
		}
	}

	// Selecionar encomenda por garrafas
	selecionarGarrafa(){
		if (this.garrafaSelecionado){
			this.garrafaSelecionado = false;
		}
		else{
			this.caixaSelecionado = false;
			this.garrafaSelecionado = true;
		}
	}

	// Selecionar a tabela a mostrar
	onChange(opcao){
		if (opcao != ""){
			if (opcao == "Caixa"){
				this.modeloGarrafaSelecionado = false;
				this.modeloCaixaSelecionado = true;
			}
			else{
				this.modeloCaixaSelecionado = false;
				this.modeloGarrafaSelecionado = true;
			}
		}
		else{
			this.modeloGarrafaSelecionado = false;
			this.modeloCaixaSelecionado = false;
		}
	}

	// Dados criados (A ser subsituido pela ligação à BD)
   public iniListaCaixas(){
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
			tipoVinho: 6,
			quantidade: 50
      }];
	}

	// Dados criados (A ser subsituido pela ligação à BD)
	public iniListaGarrafas(){
		this.garrafas = [{
			id: 1,
			lote: 3599,
			ano: 2004,
			tipoVinho: 1,
			capacidade: 1.000,
			cRotulo: 250,
			sRotulo: 100
		},
		{
			id: 2,
			lote: 3999,
			ano: 2015,
			tipoVinho: 3,
			capacidade: 0.750,
			cRotulo: 150,
			sRotulo: 0
		}];
	}

	// Dados criados (A ser subsituido pela ligação à BD)
	public iniListaVinhos(){
		this.vinhos = [{
			id: 1,
			tipo: 'Verde'
		},
		{
			id: 2,
			tipo: 'Rosé'
		},
		{
			id: 3,
			tipo: 'Tinto'
		},
		{
			id: 4,
			tipo: 'Branco'
		},
		{
			id: 5,
			tipo: 'Espumante'
		},
		{
			id: 6,
			tipo: 'Quinta'
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

	// Interligação entre duas listas: Caixa e Tipo de Vinho
	public iniListatTableCaixas(caixas: Caixa[], vinhos: TipoVinho[]): tableCaixa[]{
		var table: tableCaixa[] = [];

		for (let i = 0; i < caixas.length; i++){
			for (let j = 0; j < vinhos.length; j++){
				if (caixas[i].tipoVinho == vinhos[j].id){
					var tableObj: tableCaixa = {
						id: caixas[i].id,
						capacidade: caixas[i].capacidade,
						garrafas: caixas[i].garrafas,
						material: caixas[i].material,
						tipoVinho: vinhos[j].tipo,
						quantidade: caixas[i].quantidade 
					}
					table.push(tableObj);
				}
			}
		}

		return table;
	}

	// Interligação entre duas listas: Garrafa e Tipo de Vinho
	public iniListatTableGarrafas(garrafas: Garrafa[], vinhos: TipoVinho[]): tableGarrafa[]{
		var table: tableGarrafa[] = [];

		for (let i = 0; i < garrafas.length; i++){
			for (let j = 0; j < vinhos.length; j++){
				if (garrafas[i].tipoVinho == vinhos[j].id){
					var tableObj: tableGarrafa = {
						id: garrafas[i].id,
						lote: garrafas[i].lote,
						ano: garrafas[i].ano,
						tipoVinho: vinhos[j].tipo, 
						capacidade: garrafas[i].capacidade,
						cRotulo: garrafas[i].cRotulo,
						sRotulo: garrafas[i].sRotulo
					}
					table.push(tableObj);
				}
			}
		}

		return table;
	}

}

// Interface que interliga 2 tabelas = Caixa + Tipo de Vinho 
interface tableCaixa{
	id: number,
   capacidade: number,
   garrafas: number,
   material: string,
	tipoVinho: string, // Atributo tipo da tabela Tipo de Vinho
	quantidade: number
}

// Interface que interliga 2 tabelas = Garrafa + Tipo de Vinho 
interface tableGarrafa{
	id: number,
   lote: number,
   ano: number,
	tipoVinho: string, // Atributo tipo da tabela Tipo de Vinho
   capacidade: number,
	cRotulo: number,
	sRotulo: number
}

interface formDadosEncomenda{
	nFatura: number,
	comentario: string
}