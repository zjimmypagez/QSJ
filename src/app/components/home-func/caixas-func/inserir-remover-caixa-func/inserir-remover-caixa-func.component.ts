import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { Caixa } from '../../../../interfaces/caixa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

@Component({
	selector: 'app-inserir-remover-caixa-func',
	templateUrl: './inserir-remover-caixa-func.component.html',
	styleUrls: ['./inserir-remover-caixa-func.component.css']
})
export class InserirRemoverCaixaFuncComponent implements OnInit {
  	RegistoForm: FormGroup;
	Registo: formRegisto;

	// Lista de modelos de caixa a ler da BD
	caixas: Caixa[];
	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[];
	// Tabela interligada entre caixas e vinhos
	tabelaCaixas: tableCaixa[];	

	constructor( private router: Router, private fb: FormBuilder ) { 
		this.RegistoForm = fb.group({
			'idCaixa': ['', Validators.required],
			'opcao': ['', Validators.required],
			'comentario': ['', Validators.maxLength(200)],
			'quantidade': ['', Validators.compose([Validators.required, Validators.min(1)])]
		});
	}

	ngOnInit() {
		this.iniFormRegisto();
		this.iniListaCaixas();
		this.iniListaVinhos();
		this.tabelaCaixas = this.iniListatTableCaixas(this.caixas, this.vinhos);
	}

	// Criação de um novo registo de caixa após verificações 
	novoRegisto(form){
		this.Registo = form;

		// Opção escolhida
		switch (this.Registo.opcao){
			case "Inserir":{
				alert("Foram inseridas " + this.Registo.quantidade + " caixas!");
				this.router.navigate(['/func/caixas']);
				break;
			}
			case "Remover":{
				alert("Foram removidas " + this.Registo.quantidade + " caixas!");
				this.Registo.quantidade = -this.Registo.quantidade;
				this.router.navigate(['/func/caixas']);
				break;
			}
		}
	}

	// Limpa os dados do Formulário
	clearDados(){
		this.clearForm();
	}

	// Iniciar o objeto Registo
	public iniFormRegisto(){
		this.Registo = {
			idCaixa: null,
			opcao: '',
			comentario: '',
			quantidade: null
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
			tipoVinho: 2,
			quantidade: 50
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
						marca: vinhos[j].marca,
						tipo: vinhos[j].tipo,
						categoria: vinhos[j].categoria,
						quantidade: caixas[i].quantidade 
					}
					table.push(tableObj);
				}
			}
		}

		return table;
	}

	// Função que limpa os dados do form RegistoForm
	public clearForm(){
		this.RegistoForm.controls['idCaixa'].setValue('');
		this.RegistoForm.controls['opcao'].setValue('');
		this.RegistoForm.controls['comentario'].setValue('');
		this.RegistoForm.controls['quantidade'].setValue('');
	}

}

interface formRegisto{
	idCaixa: number,
	opcao: string,
	comentario: string,
	quantidade: number
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