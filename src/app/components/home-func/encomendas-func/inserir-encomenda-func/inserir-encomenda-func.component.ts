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

	DadosCaixaEspeciaisForm: FormGroup;
	DadosCaixaEspeciais: formDadosCaixaEspeciais[];

	caixaSelecionado: boolean = false;
	garrafaSelecionado: boolean = false;

	// Quantidade de garrafas que leva a caixa selecionada
	quantidadeGarrafas: number; 

	// Seleção de garrafas com a mesma capacidade que as caixas
	selecaoGarrafas: Garrafa[] = [];

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
		if (control.valid){
			control.push(this.iniItemRow());						
		}
		else{
			const row = control.controls[control.length - 1];
			row.get('caixa').markAsTouched();
			row.get('garrafa').markAsTouched();
			row.get('quantidade').markAsTouched();
		}
	}

	// Adicionar item ao array DadosCaixaEspeciaisForm
	adicionarEspecial(){
		const control = <FormArray>this.DadosCaixaEspeciaisForm.controls['itemRowEsp'];
		this.DadosCaixaEspeciais = this.DadosCaixaEspeciaisForm.value.itemRowEsp;

		for (let i = 0; i < this.DadosCaixaEspeciais.length; i++){
			console.log(this.DadosCaixaEspeciais[i].caixa);
			console.log(this.DadosCaixaEspeciais[i].quantidadeCaixa);
			console.log(this.DadosCaixaEspeciais[i].itemRowGarrafa);
		}

		console.log(this.DadosCaixaEspeciais);
		if (control.valid){
			control.push(this.iniitemRowEsp());
		}
		else{
			const row = control.controls[control.length - 1];
			row.get('caixa').markAsTouched();
			row.get('quantidadeCaixa').markAsTouched();		
		}
	}

	// Adicionar linha ao array itemRowGarrafas do array DadosCaixaEspecialForm
	adicionarLinhaEspecial(control){
		var qnt = control.controls[control.length - 1].controls['quantidadeGarrafa'].value;
		if (control.valid){
			if (this.quantidadeGarrafas - qnt > 0){
				this.quantidadeGarrafas -= qnt;
				control.push(this.iniItemRowGarrafa());			
			}
			else{
				if (this.quantidadeGarrafas - qnt == 0)[
					this.quantidadeGarrafas -= qnt;
					alert("Caixa preenchida!");
				]
				else{
					control.controls[control.length - 1].controls['quantidadeGarrafa'].setValue('');
					alert("Extravazou a quantidade da caixa!");
				}
			}
		}
		else{
			const row = control.controls[control.length - 1];
			row.get('garrafa').markAsTouched();
			row.get('quantidadeGarrafa').markAsTouched();
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
		var qnt = control.controls[index - 1].controls['quantidadeGarrafa'].value;
		var qnt2 = control.controls[index].controls['quantidadeGarrafa'].value;
		if (this.quantidadeGarrafas + qnt2 == qnt2)
			this.quantidadeGarrafas += qnt + qnt2;
		else
			this.quantidadeGarrafas += qnt;
		control.removeAt(index);
	}

	// Criar encomenda após verificações
	novoRegisto(dadosEncomenda, dadosCaixas){
		console.log(dadosEncomenda);
		console.log(dadosCaixas);
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
		this.clearDadosCaixaForm();
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

	// Limpar array itemRowGarrafa de dados do array DadosCaixaEspeciaisForm
	clearDadosCaixaEspeciaisForm(control){
		for (let i = 0; i < control.length; i++){
			control.controls[i].controls['garrafa'].setValue('')
		}		
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

	// Preenchimento da lista de garrafas especificas para a caixa selecionada
	onChangeModeloCaixa(id: number, control){	
		this.selecaoGarrafas = [];
		var caixaSelecionada: Caixa = {
			id: 0,
			capacidade: 0,
			garrafas: 0,
			material: "",
			tipoVinho: 0,
			quantidade: 0
		};
		for (let i = 0; i < this.caixas.length; i++){
			if (id == this.caixas[i].id)
				caixaSelecionada = this.caixas[i];
		}		
		for (let j = 0; j < this.garrafas.length; j++){
			if (caixaSelecionada.capacidade == this.garrafas[j].capacidade)
				this.selecaoGarrafas.push(this.garrafas[j]);
		}
		this.quantidadeGarrafas = caixaSelecionada.garrafas;
		this.clearDadosCaixaEspeciaisForm(control);
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

interface listaGarrafas{
	garrafa: number,
	quantidadeGarrafa: number
}