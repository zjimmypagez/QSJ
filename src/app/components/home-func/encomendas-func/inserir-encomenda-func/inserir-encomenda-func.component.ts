import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { Router } from '@angular/router';

import { Encomenda } from '../../../../interfaces/encomenda';
import { Caixa } from '../../../../interfaces/caixa';
import { Garrafa } from '../../../../interfaces/garrafa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

import { JoinTablesService } from '../../../../services/funcoes-service/join-tables.service';

import { ValidatorEncomendaCaixasEspeciaisRegisto, ValidatorEncomendaCaixasRegisto, ValidatorEncomendaQuantidadeCaixas, ValidatorEncomendaQuantidadeCaixasEspeciais, ValidatorEncomendaQuantidadeGarrafas, ValidatorEncomendaQuantidadeGarrafasEspeciais, ValidatorEncomendaQuantidadeGarrafasEspeciaisPreenchida } from '../../../../validators/validator-encomendas';

@Component({
	selector: 'app-inserir-encomenda-func',
	templateUrl: './inserir-encomenda-func.component.html',
	styleUrls: ['./inserir-encomenda-func.component.css']
})
export class InserirEncomendaFuncComponent implements OnInit {
	DadosEncomendaForm: FormGroup;
	DadosCaixaForm: FormGroup;

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
		}, { validator: [
				ValidatorEncomendaCaixasRegisto(), 
				ValidatorEncomendaQuantidadeCaixas(this.caixas), 
				ValidatorEncomendaQuantidadeGarrafas(this.caixas, this.garrafas)] 
			}
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
		const linhaGarrafa = <FormArray>control.get('linhaGarrafa');
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

	// Adicionar item ao array DadosCaixaForm
	adicionarEspecial(){
		const control = <FormArray>this.DadosCaixaForm.controls['linhaModelo'];
		const linhaAtual = control.at(control.length - 1);
		if (control.valid){
			var estadoCaixa: number = this.caixaPreenchida(linhaAtual);
			if (estadoCaixa == 0) control.push(this.iniLinhaModelo());
			else alert("A caixa não está totalmente preenchida! Faltam - " + estadoCaixa + " garrafas para preencher!");
		}
		else{		
			for (let i = 0; i < control.length; i++){
				control.at(i).get('caixa').markAsTouched();
				control.at(i).get('quantidadeCaixa').markAsTouched();
				const linhaGarrafa = <FormArray>control.at(i).get('linhaGarrafa');
				for (let j = 0; j < linhaGarrafa.length; j++){
					linhaGarrafa.at(j).get('garrafa').markAsTouched();
					linhaGarrafa.at(j).get('quantidadeGarrafa').markAsTouched();
				}
			}
		}
	}
	
	// Apagar linha ao array DadosCaixaForm
	apagarEspecial(index: number){
		const control = <FormArray>this.DadosCaixaForm.controls['linhaModelo'];
		if (confirm("Tem a certeza?")) control.removeAt(index);
	}	

	// Função que determina se uma caixa está devidamente preenchida ou não
	caixaPreenchida(linhaAtual): number{
		var soma: number = 0;
		var idCaixa: number = linhaAtual.get('caixa').value;
		var caixa: Caixa = this.caixas.find(x => x.id == idCaixa);
		var garrafas: number = caixa.garrafas;
		const linhaGarrafa = <FormArray>linhaAtual.get('linhaGarrafa');
		for (let i = 0; i < linhaGarrafa.length; i++) soma += linhaGarrafa.at(i).get('quantidadeGarrafa').value;
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
	onChangeModeloCaixa(index: number){	
		const linhaCaixa = <FormArray>this.DadosCaixaForm.get('linhaCaixas');
		var id = linhaCaixa.at(index).get('caixa').value;
		var modeloCaixa: Caixa = this.caixas.find(x => x.id == id);
		var listaGarrafas: Garrafa[] = this.garrafas.filter(x => x.capacidade === modeloCaixa.capacidade);
		this.modeloCapacidadeGarrafa[index] = listaGarrafas;
		const control = <FormArray>this.DadosCaixaForm.controls['linhaCaixas'];
		control.at(index).get('garrafa').reset('');
	}

	// Preenchimento da lista de garrafas especificas para a caixa especial selecionada
	onChangeModeloCaixaEspecial(index: number){			
		const control = <FormArray>this.DadosCaixaForm.controls['linhaModelo'];
		var id = control.at(index).get('caixa').value;
		control.at(index).get('quantidadeCaixa').setValue('');
		const linhaGarrafa = <FormArray>control.at(index).get('linhaGarrafa');
		linhaGarrafa.at(0).get('garrafa').setValue('');
		linhaGarrafa.at(0).get('quantidadeGarrafa').setValue('');
		var modeloCaixa: Caixa = this.caixas.find(x => x.id == id);
		var listaGarrafas: Garrafa[] = this.garrafas.filter(x => x.capacidade == modeloCaixa.capacidade);
		this.modeloCapacidadeGarrafaEspecial[index] = listaGarrafas;
		for (let i = linhaGarrafa.length; i > 0; i--) linhaGarrafa.removeAt(i);
	}

	// Ver se o formulário é válido
	getValidForm(){
		if (this.DadosCaixaForm.get('linhaModelo').valid || this.DadosCaixaForm.get('linhaCaixas').valid) return false;
		return true;
	}

	// Criar encomenda após verificações
	novoRegisto(dadosEncomenda, dadosCaixas){
		var dadosGeraisEncomenda: any = dadosEncomenda;
		var dadosCaixasEncomendadas: any = dadosCaixas;
	}

	// Limpar form
	clearDados(){
		this.clearDadosCaixaForm();
	}

	// Limpar array de dados DadosCaixaForm
	clearDadosCaixaForm(){
		const controlCaixa = <FormArray>this.DadosCaixaForm.controls['linhaCaixas'];	
		const controlModelo = <FormArray>this.DadosCaixaForm.controls['linhaModelo'];		
		for (let i = controlCaixa.length; i > 0; i--) controlCaixa.removeAt(i);
		controlCaixa.at(0).get('caixa').setValue('');
		controlCaixa.at(0).get('garrafa').setValue('');
		controlCaixa.at(0).get('quantidade').setValue('');
		controlCaixa.at(0).get('caixa').markAsUntouched();
		controlCaixa.at(0).get('garrafa').markAsUntouched();
		controlCaixa.at(0).get('quantidade').markAsUntouched();
		for (let i = controlModelo.length; i > 0; i--) controlModelo.removeAt(i);
		const linhaGarrafa = <FormArray>controlModelo.at(0).get('linhaGarrafa');
		for (let i = linhaGarrafa.length; i > 0; i--) linhaGarrafa.removeAt(i);
		controlModelo.at(0).get('caixa').setValue('');
		controlModelo.at(0).get('quantidadeCaixa').setValue('');
		linhaGarrafa.at(0).get('garrafa').setValue('');
		linhaGarrafa.at(0).get('quantidadeGarrafa').setValue('');
		controlModelo.at(0).get('caixa').markAsUntouched();
		controlModelo.at(0).get('quantidadeCaixa').markAsUntouched();
		linhaGarrafa.at(0).get('garrafa').markAsUntouched();
		linhaGarrafa.at(0).get('quantidadeGarrafa').markAsUntouched();
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