import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { Router } from '@angular/router';

import { Encomenda } from '../../../../interfaces/encomenda';
import { Caixa } from '../../../../interfaces/caixa';
import { Garrafa } from '../../../../interfaces/garrafa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

import { JoinTablesService } from '../../../../services/funcoes-service/join-tables.service';

import {  ValidatorEncomendaCaixasEspeciaisRegisto, ValidatorEncomendaCaixasRegisto, ValidatorEncomendaQuantidadeCaixas, ValidatorEncomendaQuantidadeCaixasEspeciais, ValidatorEncomendaQuantidadeGarrafas, ValidatorEncomendaQuantidadeGarrafasEspeciais, ValidatorEncomendaQuantidadeGarrafasEspeciaisPreenchida } from '../../../../validators/validator-encomendas';

@Component({
	selector: 'app-inserir-encomenda-func',
	templateUrl: './inserir-encomenda-func.component.html',
	styleUrls: ['./inserir-encomenda-func.component.css']
})
export class InserirEncomendaFuncComponent implements OnInit {
	DadosEncomendaForm: FormGroup;
	DadosCaixaForm: FormGroup;

	caixaSelecionado: boolean = false;
	garrafaSelecionado: boolean = false;

	// Quantidade de garrafas que leva a caixa selecionada
	quantidadeGarrafas: number; 

	caixaSelecionada: Caixa;

	// Seleção de garrafas com a mesma capacidade que as caixas
	selecaoGarrafas: tableGarrafa[] = [];

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

	// Array individual, usado em cada item do form array
	modeloCapacidadeGarrafa: any[] = [];
	// Array individual, usado em cada item do form array
	modeloCapacidadeGarrafaEspecial: any[] = [];

	constructor( private router: Router, private fb: FormBuilder, private joinTableService: JoinTablesService ) { 
		this.DadosEncomendaForm = fb.group({
			'nFatura': ['', Validators.min(1)],
			'comentario': ['', Validators.maxLength(200)]
		});
	}

	ngOnInit() {	
		this.iniListaCaixas();
		this.iniListaGarrafas();
		this.iniListaVinhos();
		this.iniListaEncomendas();		
		this.tabelaCaixas = this.joinTableService.iniListaTableCaixas(this.caixas, this.vinhos);
		this.tabelaGarrafas = this.joinTableService.iniListaTableGarrafas(this.garrafas, this.vinhos);
		this.iniDadosCaixasForm();
	}

	// Inicializar objeto form DadosCaixasForm - Caixas Normais
	iniDadosCaixasForm(){
		this.DadosCaixaForm = this.fb.group({
			linhaCaixas: this.fb.array([this.iniLinhaCaixas()]),
			linhaModelo: this.fb.array([this.iniLinhaModelo()])
		});
	}

	// Inicializar objeto formArray linhaCaixas do objeto form DadosCaixasForm - Caixas Normais
	iniLinhaCaixas(){	
		return this.fb.group({
			'caixa': ['', Validators.required],
			'garrafa': ['', Validators.required],
			'quantidade': ['', [Validators.required, Validators.min(1)]]
		}, { validator: [ValidatorEncomendaCaixasRegisto(), ValidatorEncomendaQuantidadeCaixas(this.caixas), ValidatorEncomendaQuantidadeGarrafas(this.caixas, this.garrafas)] }
		);
	}

	// Inicializar objeto formArray linhaModelo do objeto form DadosCaixasForm - Caixas Especiais
	iniLinhaModelo(){
		return this.fb.group({
			'caixa': ['', Validators.required],
			'quantidadeCaixa': ['', Validators.compose([Validators.required, Validators.min(1)])],
			linhaGarrafa: this.fb.array([this.iniLinhaGarrafa()])
		}, { validator: ValidatorEncomendaQuantidadeCaixasEspeciais(this.caixas) }
		);
	}

	// Inicializar objeto formArray linhaGarrafa do objeto formArray linhaModelo do objeto form DadosCaixasForm - Caixas Especiais
	iniLinhaGarrafa(){
		return this.fb.group({			
			'garrafa': ['', Validators.required],
			'quantidadeGarrafa': ['', Validators.compose([Validators.required, Validators.min(1)])],
		}, { validator: [
				ValidatorEncomendaCaixasEspeciaisRegisto(), 
				ValidatorEncomendaQuantidadeGarrafasEspeciais(this.caixas, this.garrafas),
				ValidatorEncomendaQuantidadeGarrafasEspeciaisPreenchida(this.caixas)] 
			}
		);
	}

	// Adicionar item ao formarray do form DadosCaixaForm
	adicionarLinhaCaixasNormais(){		
		const control = <FormArray>this.DadosCaixaForm.controls['linhaCaixas'];		
		const linhaAtual = control.at(control.length - 1);
		if (control.valid) control.push(this.iniLinhaCaixas());
		else{
			for (let i = 0; i < control.length; i++){
				control.at(i).get('caixa').markAsTouched();
				control.at(i).get('garrafa').markAsTouched();
				control.at(i).get('quantidade').markAsTouched();
			}
		}				
	}

	// Apagar linha ao formarray do form DadosCaixaForm
	apagarLinhaCaixasNormais(index: number){
		const control = <FormArray>this.DadosCaixaForm.controls['linhaCaixas'];		
		this.modeloCapacidadeGarrafa.splice(index, 1);
		control.removeAt(index);
	}

	// Adicionar linha ao array linhaGarrafa do array linhaModelo do grupo DadosCaixaForm
	adicionarLinhaCaixasEspeciais(control){
		const linhaGarrafa = control.get('linhaGarrafa');
		if (control.valid) linhaGarrafa.push(this.iniLinhaGarrafa());
		else{
			control.get('caixa').markAsTouched();
			control.get('quantidadeCaixa').markAsTouched();
			for (let i = 0; i < linhaGarrafa.length; i++){
				linhaGarrafa.at(i).get('garrafa').markAsTouched();
				linhaGarrafa.at(i).get('quantidadeGarrafa').markAsTouched();				
			}
		}
	}

	// Apagar linha ao array DadosCaixaForm
	apagarLinhaEspecial(control, index: number){
		control.removeAt(index);
	}

	// Adicionar item ao array DadosCaixaEspeciaisForm
	adicionarEspecial(){
		const control = <FormArray>this.DadosCaixaForm.controls['linhaModelo'];
		const row = control.at(control.length - 1);
		var estadoCaixa: number = this.caixaPreenchida(row);
		if (control.valid){
			if (estadoCaixa == 0) control.push(this.iniLinhaModelo());
			else alert("A caixa não está totalmente preenchida! Faltam - " + estadoCaixa + " garrafas para preencher!");
		}
		else{			
			row.get('caixa').markAsTouched();
			row.get('quantidadeCaixa').markAsTouched();	
			for (let i = 0; i < row.get('linhaGarrafa').length; i++){
				row.get('linhaGarrafa').at(i).get('garrafa').markAsTouched();
				row.get('linhaGarrafa').at(i).get('quantidadeGarrafa').markAsTouched();
			}
		}
	}
	
	// Apagar linha ao array DadosCaixaForm
	apagarEspecial(index: number){
		const control = <FormArray>this.DadosCaixaForm.controls['linhaModelo'];
		if (confirm("Tem a certeza?")){
			control.removeAt(index);
		}
	}	

	// Função que determina se uma caixa está devidamente preenchida ou não
	caixaPreenchida(caixa): number{
		var preenchida: boolean = false, soma: number = 0;
		var idCaixa: number = caixa.get('caixa').value;
		var garrafas: number = 0;
		for (let i = 0; i < this.caixas.length; i++){
			if (idCaixa == this.caixas[i].id) garrafas = this.caixas[i].garrafas;
		}
		for (let i = 0; i < caixa.get('linhaGarrafa').length; i++) soma += caixa.get('linhaGarrafa').at(i).get('quantidadeGarrafa').value;
		if (garrafas == soma) return 0;
		return garrafas - soma;
	}

	// Selecionar a tabela a mostrar: Caixas ou Garrafas
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

	// Preenchimento da lista de garrafas especificas para a caixa selecionada
	onChangeModeloCaixa(id: number, index: number){	
		var modeloCaixa: any;
		for (let i = 0; i < this.caixas.length; i++){
			if (id == this.caixas[i].id) modeloCaixa = this.caixas[i];
		}
		var listaGarrafas: Garrafa[] = [];
		for (let i = 0; i < this.garrafas.length; i++){
			if (modeloCaixa.capacidade == this.garrafas[i].capacidade) listaGarrafas.push(this.garrafas[i]);
		}		
		this.modeloCapacidadeGarrafa[index] = listaGarrafas;
		const control = <FormArray>this.DadosCaixaForm.controls['linhaCaixas'];
		control.at(index).get('garrafa').reset('');
	}

	// Preenchimento da lista de garrafas especificas para a caixa especial selecionada
	onChangeModeloCaixaEspecial(id: number, index: number){			
		const control = <FormArray>this.DadosCaixaForm.controls['linhaModelo'];
		const linhaAtualGarrafa = control.at(index).get('linhaGarrafa');
		control.at(index).get('linhaGarrafa').at(0).get('garrafa').setValue('');
		control.at(index).get('linhaGarrafa').at(0).get('quantidadeGarrafa').setValue('');
		var modeloCaixa: any;
		for (let i = 0; i < this.caixas.length; i++){
			if (id == this.caixas[i].id) modeloCaixa = this.caixas[i];
		}
		var listaGarrafas: Garrafa[] = [];
		for (let i = 0; i < this.garrafas.length; i++){
			if (modeloCaixa.capacidade == this.garrafas[i].capacidade) listaGarrafas.push(this.garrafas[i]);
		}
		this.modeloCapacidadeGarrafaEspecial[index] = listaGarrafas;
		for (let i = linhaAtualGarrafa.length; i > 0; i--){
			linhaAtualGarrafa.removeAt(i);
		}
	}

	// Ver se o formulário é válido
	getValidForm(){
		if (this.DadosCaixaForm.get('linhaModelo').valid || this.DadosCaixaForm.get('linhaCaixas').valid) return false;
		return true;
	}

	// Criar encomenda após verificações
	novoRegisto(dadosEncomenda, dadosCaixas, dadosCaixasEspeciais){
		console.log(dadosEncomenda);
		console.log(dadosCaixas);
		console.log(dadosCaixasEspeciais);
	}

	// Limpar form
	clearDados(){
		this.clearDadosCaixaForm();
	}

	// Limpar array de dados DadosCaixaForm
	clearDadosCaixaForm(){
		const controlModelo = <FormArray>this.DadosCaixaForm.controls['linhaModelo'];		
		const controlCaixa = <FormArray>this.DadosCaixaForm.controls['linhaCaixas'];	
		for (let i = controlCaixa.length; i > 0; i--){
			controlCaixa.removeAt(i);
		}		
		controlCaixa.at(0).get('caixa').setValue('');
		controlCaixa.at(0).get('garrafa').setValue('');
		controlCaixa.at(0).get('quantidade').setValue('');
		controlCaixa.at(0).get('caixa').markAsUntouched();
		controlCaixa.at(0).get('garrafa').markAsUntouched();
		controlCaixa.at(0).get('quantidade').markAsUntouched();
		for (let i = controlModelo.length; i > 0; i--){
			controlModelo.removeAt(i);
		}
		for (let i = controlModelo.at(0).get('linhaGarrafa').length; i > 0; i--){
			controlModelo.at(0).get('linhaGarrafa').removeAt(i);
		}
		controlModelo.at(0).get('caixa').markAsUntouched();
		controlModelo.at(0).get('quantidadeCaixa').markAsUntouched();
		controlModelo.at(0).get('linhaGarrafa').at(0).get('garrafa').markAsUntouched();
		controlModelo.at(0).get('linhaGarrafa').at(0).get('quantidadeGarrafa').markAsUntouched();
		controlModelo.at(0).get('caixa').setValue('');
		controlModelo.at(0).get('quantidadeCaixa').setValue('');
		controlModelo.at(0).get('linhaGarrafa').at(0).get('garrafa').setValue('');
		controlModelo.at(0).get('linhaGarrafa').at(0).get('quantidadeGarrafa').setValue('');
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
	iniListaGarrafas(){
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
		},
		{
			id: 3,
			cuba: 10000,
			ano: 2015,
			tipoVinho: 2,
			capacidade: 1.000,
			cRotulo: 1500,
			sRotulo: 0
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

	// Dados criados (A ser subsituido pela ligação à BD)
	iniListaEncomendas(){
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