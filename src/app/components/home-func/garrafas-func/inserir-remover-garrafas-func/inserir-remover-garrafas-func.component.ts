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

	// Lista de modelos de garrafa a ler da BD
	garrafas: Garrafa[];
	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[];
	// Tabela interligada entre caixas e vinhos
	tabelaGarrafas: tableGarrafa[];
	
	constructor( private router: Router, private fb: FormBuilder ) { 
		this.RegistoForm = fb.group({
			'idGarrafa': ['', Validators.required],
			'opcao': ['', Validators.required],
			'comentario': ['', Validators.maxLength(200)],
			'cRotulo': ['', Validators.compose([Validators.required, Validators.min(0)])],
			'sRotulo': ['', Validators.compose([Validators.required, Validators.min(0)])]
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
				case "Inserir":{
					alert("Foram inseridas " + qnt + " caixas: " + this.Registo.cRotulo + " c/Rótulo e " + this.Registo.sRotulo + " s/Rótulo");
					this.router.navigate(['/func/garrafas']);
					break;
				}
				case "Remover":{
					alert("Foram removidas " + qnt + " caixas: " + this.Registo.cRotulo + " c/Rótulo e " + this.Registo.sRotulo + " s/Rótulo");
					this.Registo.cRotulo = -this.Registo.cRotulo;
					this.Registo.sRotulo = -this.Registo.sRotulo;
					this.router.navigate(['/func/garrafas']);
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

	// Limpa os dados do Formulário
	clearDados(){
		this.clearForm();
	}

	// Iniciar o objeto Registo
	public iniFormRegisto(){
		this.Registo = {
			idGarrafa: null,
			opcao: '',
			comentario: '',
			cRotulo: null,
			sRotulo: null
		}
	}

	// Dados criados (A ser subsituido pela ligação à BD)
	public iniListaGarrafas(){
		this.garrafas = [{
			id: 1,
			lote: 3599,
			ano: 2004,
			tipoVinho: 1,
			capacidade: 1.000,
			quantidade: 250
		},
		{
			id: 2,
			lote: 3999,
			ano: 2015,
			tipoVinho: 3,
			capacidade: 0.750,
			quantidade: 100
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
						quantidade: garrafas[i].quantidade 
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
		this.RegistoForm.controls['opcao'].setValue('');
		this.RegistoForm.controls['comentario'].setValue('');
		this.RegistoForm.controls['cRotulo'].setValue('');
		this.RegistoForm.controls['sRotulo'].setValue('');
	}

}

interface formRegisto{
	idGarrafa: number,
	opcao: string,
	comentario: string,
	cRotulo: number,
	sRotulo: number
}

// Interface que interliga 2 tabelas = Garrafa + Tipo de Vinho 
interface tableGarrafa{
	id: number,
   lote: number,
   ano: number,
	tipoVinho: string, // Atributo tipo da tabela Tipo de Vinho
   capacidade: number,
	quantidade: number
}