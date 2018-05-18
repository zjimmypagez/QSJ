import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { Router } from '@angular/router';

import { Encomenda } from '../../../../interfaces/encomenda';
import { Caixa } from '../../../../interfaces/caixa';
import { Garrafa } from '../../../../interfaces/garrafa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

import { JoinTablesService } from '../../../../services/funcoes-service/join-tables.service';

@Component({
	selector: 'app-inserir-encomenda-func',
	templateUrl: './inserir-encomenda-func.component.html',
	styleUrls: ['./inserir-encomenda-func.component.css']
})
export class InserirEncomendaFuncComponent implements OnInit {
	DadosEncomendaForm: FormGroup;
	DadosEncomenda: formDadosEncomenda;

	DadosCaixaForm: FormGroup;
	DadosCaixa: formDadosCaixa[];

	DadosCaixaEspeciaisForm: FormGroup;
	DadosCaixaEspeciais: formDadosCaixaEspeciais[];

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

	constructor( private router: Router, private fb: FormBuilder, private joinTableService: JoinTablesService ) { 
		this.DadosEncomendaForm = fb.group({
			'nFatura': ['', Validators.min(1)],
			'comentario': ['', Validators.maxLength(200)]
		});
		this.DadosCaixaForm = fb.group({
			itemRow: fb.array([this.iniItemRow()])
		});
		this.DadosCaixaEspeciaisForm = fb.group({
			itemRowEsp: fb.array([this.iniitemRowEsp()])
		});
	}

	ngOnInit() {	
		this.iniCaixaSelecionada();
		this.iniListaCaixas();
		this.iniListaGarrafas();
		this.iniListaVinhos();
		this.iniListaEncomendas();		
		this.tabelaCaixas = this.joinTableService.iniListaTableCaixas(this.caixas, this.vinhos);
		this.tabelaGarrafas = this.joinTableService.iniListaTableGarrafas(this.garrafas, this.vinhos);
	}

	// Inicializar itemRow - Caixas Normais
	iniItemRow(){
		return this.fb.group({
			'caixa': ['', Validators.required],
			'garrafa': ['', Validators.required],
			'quantidade': ['', Validators.compose([Validators.required, Validators.min(1)])]
		});
	}

	// Inicializar itemRow - Caixas Especiais
	iniitemRowEsp(){
		return this.fb.group({
			'caixa': ['', Validators.required],
			'quantidadeCaixa': ['', Validators.compose([Validators.required, Validators.min(1)])],
			itemRowGarrafa: this.fb.array([this.iniItemRowGarrafa()])
		});
	}

	iniItemRowGarrafa(){
		return this.fb.group({			
			'garrafa': ['', Validators.required],
			'quantidadeGarrafa': ['', Validators.compose([Validators.required, Validators.min(1)])],
		});
	}

	// Adicionar item ao array DadosCaixaForm
	adicionarLinha(){		
		const control = <FormArray>this.DadosCaixaForm.controls['itemRow'];		
		const row = control.at(control.length - 1);
		if (control.valid){
			control.push(this.iniItemRow());						
		}
		else{
			row.get('caixa').markAsTouched();
			row.get('garrafa').markAsTouched();
			row.get('quantidade').markAsTouched();
		}
	}

	// Adicionar item ao array DadosCaixaEspeciaisForm
	adicionarEspecial(){
		const control = <FormArray>this.DadosCaixaEspeciaisForm.controls['itemRowEsp'];
		const row = control.at(control.length - 1);
		var estadoCaixa = this.caixaPreenchida(row);
		if (control.valid){
			if (estadoCaixa)
				control.push(this.iniitemRowEsp());
			else
				alert("A caixa não está totalmente preenchida ou extravazou a quantidade!");
		}
		else{			
			row.get('caixa').markAsTouched();
			row.get('quantidadeCaixa').markAsTouched();	
			var length: any = row.get('itemRowGarrafa.length');
			for (let i = 0; i < length; i++){
				row.get('itemRowGarrafa.' + i + '.garrafa').markAsTouched();
				row.get('itemRowGarrafa.' + i + '.quantidadeGarrafa').markAsTouched();
			}
		}
	}

	// Adicionar linha ao array itemRowGarrafas do array DadosCaixaEspecialForm
	adicionarLinhaEspecial(control, caixa){
		var qnt = control.controls[control.length - 1].controls['quantidadeGarrafa'].value;
		var soma: number = 0;
		if (control.length > 1){
			for (let i = 0; i < control.length; i++)
				soma += control.controls[i].get('quantidadeGarrafa').value;
		}
		else
			soma = qnt;
		
		if (caixa.valid){
			if (this.quantidadeGarrafas - soma > 0)
				control.push(this.iniItemRowGarrafa());		
			else
				if (this.quantidadeGarrafas - soma == 0)
					alert("Caixa preenchida!");
				else{
					control.controls[control.length - 1].controls['quantidadeGarrafa'].setValue('');
					alert("Extravazou a quantidade da caixa!");
				}			
		}
		else{
			caixa.get('caixa').markAsTouched();
			caixa.get('quantidadeCaixa').markAsTouched();
			for (let i = 0; i < control.length; i++){
				control.controls[i].get('garrafa').markAsTouched();
				control.controls[i].get('quantidadeGarrafa').markAsTouched();
			}
		}
	}


	// Apagar linha ao array DadosCaixaForm
	apagarLinha(index: number){
		const control = <FormArray>this.DadosCaixaForm.controls['itemRow'];
		control.removeAt(index);
	}
	
	// Apagar linha ao array DadosCaixaEspeciaisForm
	apagarEspecial(index: number){
		const control = <FormArray>this.DadosCaixaEspeciaisForm.controls['itemRowEsp'];
		if (confirm("Tem a certeza?")){
			control.removeAt(index);
		}
	}

	// Apagar linha ao array DadosCaixaEspecialForm
	apagarLinhaEspecial(control, index: number){
		control.removeAt(index);
	}

	// Criar encomenda após verificações
	novoRegisto(dadosEncomenda, dadosCaixas, dadosCaixasEspeciais){
		console.log(dadosEncomenda);
		console.log(dadosCaixas);
		console.log(dadosCaixasEspeciais);
	}

	// Ver se o formulário é válido
	getValidForm(){
		if (this.DadosEncomendaForm.valid && this.DadosCaixaForm.valid && this.DadosCaixaEspeciaisForm.valid)
			return false;
		else
			if (this.DadosEncomendaForm.valid && this.DadosCaixaForm.valid)
				return false;
			else
				if (this.DadosEncomendaForm.valid && this.DadosCaixaEspeciaisForm.valid)
					return false;
				else
					if (this.DadosCaixaForm.valid && this.DadosCaixaEspeciaisForm.valid)
						return false;
					else
						if (this.DadosCaixaForm.valid)
							return false;
						else
							if (this.DadosCaixaEspeciaisForm.valid)
								return false;								
							else
								return true;
	}

	// Limpar form
	clearDados(){
		this.DadosEncomendaForm.reset();
		this.DadosCaixaForm.reset();
		this.DadosCaixaEspeciaisForm.reset();
		this.clearDadosCaixaForm();
		this.clearDadosCaixaEspecialForm();
	}

	// Limpar array de dados DadosCaixaForm
	clearDadosCaixaForm(){
		const control = <FormArray>this.DadosCaixaForm.controls['itemRow'];		
		for (let i = 0; i < control.length; i++){
			if (control.length > 1){
				control.removeAt(i);
			}
		}
	}

	// Limpar array de dados DadosCaixaEspecialForm
	clearDadosCaixaEspecialForm(){
		const control = <FormArray>this.DadosCaixaEspeciaisForm.controls['itemRowEsp'];		
		for (let i = 0; i < control.length; i++){
			if (control.length > 1){
				control.removeAt(i);
			}
		}
	}

	// Limpar do array itemRowGarrafa as garrafas escolhidas de dados do array DadosCaixaEspeciaisForm
	clearDadosCaixaEspeciaisFormGarrafa(control){
		for (let i = 0; i < control.length; i++){
			control.controls[i].controls['garrafa'].setValue('')
		}		
	}

	// Função que determina se uma caixa está devidamente preenchida ou não
	caixaPreenchida(caixas): boolean{
		var preenchida: boolean = false, soma: number = 0;
		var length: any = caixas.get('itemRowGarrafa.length');
		for (let i = 0; i < length; i++){
			soma += caixas.get('itemRowGarrafa.' + i + '.quantidadeGarrafa').value;
		}
		if (this.caixaSelecionada.garrafas == soma)
			return true;
		return false;
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

	// Inicializar caixa selecionada
	iniCaixaSelecionada(){
		this.caixaSelecionada = {
			id: null,
			capacidade: null,
			garrafas: null,
			material: "",
			tipoVinho: null,
			quantidade: null
		};
	}

	// Preenchimento da lista de garrafas especificas para a caixa selecionada
	onChangeModeloCaixa(id: number, control){	
		this.selecaoGarrafas = [];
		for (let i = 0; i < this.caixas.length; i++){
			if (id == this.caixas[i].id)
				this.caixaSelecionada = this.caixas[i];
		}		
		for (let j = 0; j < this.tabelaGarrafas.length; j++){
			if (this.caixaSelecionada.capacidade == this.tabelaGarrafas[j].capacidade)
				this.selecaoGarrafas.push(this.tabelaGarrafas[j]);
		}
		this.quantidadeGarrafas = this.caixaSelecionada.garrafas;
		this.clearDadosCaixaEspeciaisFormGarrafa(control);
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

interface formDadosEncomenda{
	nFatura: number,
	comentario: string
}

interface formDadosCaixaEspeciais{
	caixa: number,
	quantidadeCaixa: number,
	itemRowGarrafa: listaGarrafas[];
}

interface formDadosCaixa{
	caixa: number,
	garrafa: number,
	quantidade: number
}

interface listaGarrafas{
	garrafa: number,
	quantidadeGarrafa: number
}