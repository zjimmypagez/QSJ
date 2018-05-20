import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { Caixa } from '../../../../interfaces/caixa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

import { JoinTablesService } from '../../../../services/funcoes-service/join-tables.service';

import { ValidatorRemover } from '../../../../validators/validator-caixas';

@Component({
	selector: 'app-inserir-remover-caixa-func',
	templateUrl: './inserir-remover-caixa-func.component.html',
	styleUrls: ['./inserir-remover-caixa-func.component.css']
})
export class InserirRemoverCaixaFuncComponent implements OnInit {
	RegistoForm: FormGroup;
	InserirForm: FormGroup;
	RemoverForm: FormGroup;

	inserirSelecionado: boolean = false;
	removerSelecionado: boolean = false;

	// Lista de modelos de caixa a ler da BD
	caixas: Caixa[];
	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[];
	// Tabela interligada entre caixas e vinhos
	tabelaCaixas: tableCaixa[];	

	constructor( private router: Router, private fb: FormBuilder, private joinTableService: JoinTablesService ) { 
		this.RegistoForm = fb.group({
			'idCaixa': ['', Validators.required],
			'opcao': ['', Validators.required],
			'comentario': ['', Validators.maxLength(200)]
		});
		this.InserirForm = fb.group({
			'quantidade': [null, [Validators.required, Validators.min(1)]]
		})
	}

	ngOnInit() {
		this.iniListaCaixas();
		this.iniListaVinhos();
		this.tabelaCaixas = this.joinTableService.iniListaTableCaixas(this.caixas, this.vinhos);
		this.iniRemoverForm();
	}

	// Inicializar objeto form RemoverForm
	iniRemoverForm(){
		this.RemoverForm = this.fb.group({
			'quantidade': [null, [Validators.required, Validators.min(1), ValidatorRemover(this.caixas, this.RegistoForm)]]
		});
	}

	// Criação de um novo registo de caixa após verificações 
	novoRegisto(form){
		var quantidade: any = form.quantidade;
		switch (this.RegistoForm.get('opcao').value){
			case "Inserir":{
				alert("Foram inseridas " + quantidade + " caixas!");
				this.router.navigate(['/func/caixas']);
				break;
			}
			case "Remover":{
				alert("Foram removidas " + quantidade + " caixas!");
				this.router.navigate(['/func/caixas']);				
				break;
			}
		}
	}

	// Operação selecionada
	onChange(op){
		switch(op){
			case "Inserir":{
				this.removerSelecionado = false;
				this.clearRemoverForm();
				this.inserirSelecionado = true;
				break;
			}
			case "Remover":{
				this.inserirSelecionado = false;
				this.clearInserirForm();
				this.removerSelecionado = true;
				break;
			}
		}
	}

	// Validação do formulário
	getEstadoForm(){
		if (this.RegistoForm.valid && this.InserirForm.valid) return false;
		else
			if (this.RegistoForm.valid && this.RemoverForm.valid) return false;
		return true;
	}

	// Limpa os dados do Formulário
	clearDados(){
		this.clearForm();
		this.inserirSelecionado = false;
		this.clearInserirForm();
		this.removerSelecionado = false;
		this.clearRemoverForm();
	}

	// Limpar dados do form InserirForm
	clearInserirForm(){
		this.InserirForm.get('quantidade').reset(null);
		this.InserirForm.get('quantidade').markAsUntouched();
	}	

	// Limpar dados do form RemoverForm
	clearRemoverForm(){
		this.RemoverForm.get('quantidade').reset(null);
		this.RemoverForm.get('quantidade').markAsUntouched();
	}	

	// Função que limpa os dados do form RegistoForm
	clearForm(){
		this.RegistoForm.controls['idCaixa'].reset('');
		this.RegistoForm.controls['opcao'].reset('');
		this.RegistoForm.controls['comentario'].reset('');
		this.RegistoForm.markAsUntouched();
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