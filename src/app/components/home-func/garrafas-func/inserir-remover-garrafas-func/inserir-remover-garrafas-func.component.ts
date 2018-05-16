import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { Garrafa } from '../../../../interfaces/garrafa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

@Component({
	selector: 'app-inserir-remover-garrafas-func',
	templateUrl: './inserir-remover-garrafas-func.component.html',
	styleUrls: ['./inserir-remover-garrafas-func.component.css']
})
export class InserirRemoverGarrafasFuncComponent implements OnInit {
  	RegistoForm: FormGroup;
	Registo: formRegisto;

	cRotuloSelecionado: boolean = false;
	sRotuloSelecionado: boolean = false;
	rotularSelecionado: boolean = false;

	// Lista de modelos de garrafa a ler da BD
	garrafas: Garrafa[];
	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[];
	// Tabela interligada entre caixas e vinhos
	tabelaGarrafas: tableGarrafa[];
	
	constructor( private router: Router, private fb: FormBuilder ) { 
		this.RegistoForm = fb.group({
			'idGarrafa': ['', Validators.required],
			'comentario': ['', Validators.maxLength(200)],
			'opcao': ['', Validators.required],
			'cRotulo': ['', Validators.min(0)],
			'sRotulo': ['',  Validators.min(0)]
		});
	}

	ngOnInit() {
		this.iniFormRegisto();
		this.iniListaGarrafas();
		this.iniListaVinhos();
		this.tabelaGarrafas = this.iniListatTableGarrafas(this.garrafas, this.vinhos);
	}

	// Criação de um novo registo de garrafa após verificações 
	novoRegisto(form){
		this.Registo = form;
		var qnt: number = this.Registo.cRotulo + this.Registo.sRotulo; 
		
		if (qnt != 0){
			// Opção escolhida
			switch (this.Registo.opcao){
				case "InserirCS":{
					alert("Foram inseridas " + qnt + " caixas: " + this.Registo.cRotulo + " c/Rótulo e " + this.Registo.sRotulo + " s/Rótulo");
					this.router.navigate(['/func/garrafas']);
					break;
				}
				case "RemoverCS":{
					alert("Foram removidas " + qnt + " caixas: " + this.Registo.cRotulo + " c/Rótulo e " + this.Registo.sRotulo + " s/Rótulo");
					this.Registo.cRotulo = -this.Registo.cRotulo;
					this.Registo.sRotulo = -this.Registo.sRotulo;
					this.router.navigate(['/func/garrafas']);
					break;
				}
				case "RotularS":{
					
					break;
				}
			}
		}
		else{
			alert("Operação Incoerente!");
			this.RegistoForm.controls['cRotulo'].setValue('');
			this.RegistoForm.controls['sRotulo'].setValue('');
		}
	}

	// Select da opção escolhida
	onChange(op){
		if (op != ""){
			switch (op){
				case "InserirCS":{
					this.rotularSelecionado = false;
					this.cRotuloSelecionado = true;
					this.sRotuloSelecionado = true;
					break;
				}
				case "RemoverCS":{
					this.rotularSelecionado = false;
					this.cRotuloSelecionado = true;
					this.sRotuloSelecionado = true;
					break;
				}
				case "RotularS":{
					this.cRotuloSelecionado = false;
					this.sRotuloSelecionado = false;
					this.rotularSelecionado = true;
					break;
				}
			}
		}
		else{
			this.cRotuloSelecionado = false;
			this.sRotuloSelecionado = false;
			this.rotularSelecionado = false;
		}
	}

	// Limpa os dados do Formulário
	clearDados(){
		this.clearForm();
	}

	// Obter iniciais da marca do vinho
	public getIniciaisMarca(id: number): string{
		var iniciais: string = "";
		var marca: string;
		for (let i = 0; i < this.vinhos.length; i++){
			if (id == this.vinhos[i].id)
				marca = this.vinhos[i].marca;
		}

		for (let i = 0; i < marca.length; i++){
			if(marca[i].match(/[A-Z]/) != null){
				iniciais = iniciais + marca[i];
		  }
		}
		return iniciais;
	}

	// Iniciar o objeto Registo
	public iniFormRegisto(){
		this.Registo = {
			idGarrafa: null,
			comentario: '',
			opcao: '',
			cRotulo: null,
			sRotulo: null
		}
	}

	// Dados criados (A ser subsituido pela ligação à BD)
	public iniListaGarrafas(){
		this.garrafas = [{
			id: 1,
			cuba: 5000,
			ano: 2004,
			tipoVinho: 1,
			capacidade: 1.000,
			cRotulo: 250,
			sRotulo: 100
		},
		{
			id: 2,
			cuba: 10000,
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

	// Interligação entre duas listas: Garrafa e Tipo de Vinho
	public iniListatTableGarrafas(garrafas: Garrafa[], vinhos: TipoVinho[]): tableGarrafa[]{
		var table: tableGarrafa[] = [];

		for (let i = 0; i < garrafas.length; i++){
			for (let j = 0; j < vinhos.length; j++){
				if (garrafas[i].tipoVinho == vinhos[j].id){
					var tableObj: tableGarrafa = {
						id: garrafas[i].id,
						lote: "LT-" + this.getIniciaisMarca(vinhos[j].id) + "-" + garrafas[i].ano + "-" + garrafas[i].cuba,
						cuba: garrafas[i].cuba,
						ano: garrafas[i].ano,
						marca: vinhos[j].marca,
						tipo: vinhos[j].tipo, 
						categoria: vinhos[j].categoria,
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

	// Função que limpa os dados do form RegistoForm
	public clearForm(){
		this.RegistoForm.controls['idGarrafa'].setValue('');
		this.RegistoForm.controls['comentario'].setValue('');
		this.RegistoForm.controls['opcao'].setValue('');
		this.RegistoForm.controls['cRotulo'].setValue('');
		this.RegistoForm.controls['sRotulo'].setValue('');
	}

}

interface formRegisto{
	idGarrafa: number,
	comentario: string,
	opcao: string,
	cRotulo: number,
	sRotulo: number
}

// Interface que interliga 2 tabelas = Garrafa + Tipo de Vinho 
interface tableGarrafa{
	id: number,
	lote: string, // Atributo que junta, para mostrar, marca, ano e cuba
   cuba: number,
	ano: number,
	marca: string, // Atributo marca da tabela Tipo de vinho
	tipo: string, // Atributo tipo da tabela Tipo de Vinho
	categoria: string; // Atributo categoria da tabela Tipo de Vinho
   capacidade: number,
	cRotulo: number,
	sRotulo: number
}