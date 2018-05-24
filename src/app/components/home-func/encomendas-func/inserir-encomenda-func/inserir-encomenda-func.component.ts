import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { Router } from '@angular/router';

import { Encomenda } from '../../../../interfaces/encomenda';
import { Caixa } from '../../../../interfaces/caixa';
import { Garrafa } from '../../../../interfaces/garrafa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

import { JoinTablesService } from '../../../../services/funcoes-service/join-tables.service';
import { FiltrosService } from '../../../../services/funcoes-service/filtros.service';

import { ValidatorEncomendaCaixasEspeciaisRegisto, ValidatorEncomendaCaixasRegisto, ValidatorEncomendaQuantidadeCaixas, ValidatorEncomendaQuantidadeCaixasEspeciais, ValidatorEncomendaQuantidadeGarrafas, ValidatorEncomendaQuantidadeGarrafasEspeciais, ValidatorEncomendaQuantidadeGarrafasEspeciaisPreenchida } from '../../../../validators/validator-encomendas';

@Component({
	selector: 'app-inserir-encomenda-func',
	templateUrl: './inserir-encomenda-func.component.html',
	styleUrls: ['./inserir-encomenda-func.component.css']
})
export class InserirEncomendaFuncComponent implements OnInit {
	DadosEncomendaForm: FormGroup;
	DadosCaixaForm: FormGroup;
	FiltroCaixaForm: FormGroup;
	FiltroGarrafaForm: FormGroup;
	materiais: string[] = ["Cartão", "Madeira"];
	capacidades: number[] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500, 3.000, 6.000, 12.000];
	tipoVinhos: string[] = ["Verde", "Rosé", "Tinto", "Branco", "Espumante", "Quinta"];
	categorias: string[] = [];
	anos: number[] = [];

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
	estadoTabelaCaixa: boolean = true;
	estadoTabelaGarrafa: boolean = true;

	// Array individual, usado em cada item do form array
	modeloCapacidadeGarrafa: any[] = [];
	// Array individual, usado em cada item do form array
	modeloCapacidadeGarrafaEspecial: any[] = [];

	tabelaFiltroCaixa: tableCaixa[] = [];	
	tabelaFiltroGarrafa: tableGarrafa[] = [];	

	constructor( private router: Router, private fb: FormBuilder, private joinTableService: JoinTablesService, private filtroService: FiltrosService ) { 
		this.DadosEncomendaForm = fb.group({
			'nFatura': ['', Validators.min(1)],
			'comentario': ['', Validators.maxLength(200)]
		});
		this.FiltroCaixaForm = fb.group({
			'marca': ['', ],
			'material': [0, ],
			'capacidade': [0, ],
			'tipoVinho': [0, ],
			'categoria': [0, ]
		});
		this.FiltroGarrafaForm = fb.group({
			'marca': ['', ],
			'ano': [0, ],
			'capacidade': [0, ],
			'tipoVinho': [0, ],
			'categoria': [0, ]
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
		this.anos = this.filtroService.iniFiltroAno(this.garrafas);
		this.categorias = this.filtroService.iniFiltroCategoria(this.vinhos);
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
				this.clearTabelaGarrafa();
				this.modeloCaixaSelecionado = true;
			}
			else{
				this.modeloCaixaSelecionado = false;
				this.clearTabelaCaixa();
				this.modeloGarrafaSelecionado = true;
			}
		}
		else{
			this.modeloGarrafaSelecionado = false;
			this.clearTabelaGarrafa();
			this.modeloCaixaSelecionado = false;
			this.clearTabelaCaixa();
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

	// Pesquisa na tabela caixa
	pesquisaMarcaCaixa(form){
		var marca = form.marca;		
		if (marca != ""){
			if (form.material != "" || form.capacidade != "" || form.tipoVinho != "" || form.categoria != ""){
				if (this.tabelaFiltroCaixa.length != 0) this.tabelaCaixas = this.filtroService.pesquisaMarca(this.tabelaFiltroCaixa, marca);
				else this.tabelaCaixas = this.filtroService.pesquisaMarca(this.tabelaCaixas, marca);
			}
			else{
				this.tabelaCaixas = this.joinTableService.iniListaTableCaixas(this.caixas, this.vinhos);
				this.tabelaCaixas = this.filtroService.pesquisaMarca(this.tabelaCaixas, marca);
			} 
			if (this.tabelaCaixas.length == 0){
				this.tabelaCaixas = this.joinTableService.iniListaTableCaixas(this.caixas, this.vinhos);
				this.estadoTabelaCaixa = false;
			}
			else this.estadoTabelaCaixa = true;
		}
		else{
			this.estadoTabelaCaixa = true;
			if (this.tabelaFiltroCaixa.length != 0) this.tabelaCaixas = this.tabelaFiltroCaixa;
			alert("Pesquisa inválida!");
		}
	}

	// Filtragem caixa
	onChangeCaixa(){
		var filtro: any = this.FiltroCaixaForm.value;
		this.tabelaCaixas = this.joinTableService.iniListaTableCaixas(this.caixas, this.vinhos);
		if (filtro.marca != "") this.tabelaCaixas = this.filtroService.pesquisaMarca(this.tabelaCaixas, filtro.marca);		
		if (filtro.material != "" || filtro.capacidade != "" || filtro.tipoVinho != "" || filtro.categoria != ""){
			this.tabelaFiltroCaixa = this.filtroService.filtroMaterialCapacidadeTipoVinhoCategoria(filtro, this.tabelaCaixas);
			this.tabelaCaixas = this.tabelaFiltroCaixa;
			if (this.tabelaCaixas.length == 0) this.estadoTabelaCaixa = false;
			else this.estadoTabelaCaixa = true;
		}
		else{
			if (filtro.marca != "") this.tabelaCaixas = this.filtroService.pesquisaMarca(this.tabelaCaixas, filtro.marca);
			else this.tabelaCaixas = this.joinTableService.iniListaTableCaixas(this.caixas, this.vinhos);
			this.tabelaFiltroCaixa = [];
			this.estadoTabelaCaixa = true;
		}
	}

	// Limpar pesquisa Caixa
	clearTabelaCaixa(){
		this.tabelaCaixas = this.joinTableService.iniListaTableCaixas(this.caixas, this.vinhos);
		this.estadoTabelaCaixa = true;
		this.clearFormCaixa();
	}

	// Limpar Form
	clearFormCaixa(){
		this.FiltroCaixaForm.controls['marca'].reset('');
		this.FiltroCaixaForm.controls['material'].reset(0);
		this.FiltroCaixaForm.controls['capacidade'].reset(0);
		this.FiltroCaixaForm.controls['tipoVinho'].reset(0);
		this.FiltroCaixaForm.controls['categoria'].reset(0);
	}

	// Pesquisa na tabela garrafa
	pesquisaMarcaGarrafa(form){
		var marca = form.marca;		
		if (marca != ""){
			if (form.ano != 0 || form.capacidade != 0 || form.tipoVinho != 0 || form.categoria != 0){
				if (this.tabelaFiltroGarrafa.length != 0) this.tabelaGarrafas = this.filtroService.pesquisaMarca(this.tabelaFiltroGarrafa, marca);
				else this.tabelaGarrafas = this.filtroService.pesquisaMarca(this.tabelaGarrafas, marca);
			}
			else{
				this.tabelaGarrafas = this.joinTableService.iniListaTableGarrafas(this.garrafas, this.vinhos);
				this.tabelaGarrafas = this.filtroService.pesquisaMarca(this.tabelaGarrafas, marca);
			}
			if (this.tabelaGarrafas.length == 0) {
				this.tabelaGarrafas = this.joinTableService.iniListaTableGarrafas(this.garrafas, this.vinhos);
				this.estadoTabelaGarrafa = false;
			}				
			else this.estadoTabelaGarrafa = true;
		}
		else {
			this.estadoTabelaGarrafa = true;
			if (this.tabelaFiltroGarrafa.length != 0) this.tabelaGarrafas = this.tabelaFiltroGarrafa;
			alert("Pesquisa inválida!");
		}
	}

	// Filtragem Garrafa
	onChangeGarrafa(){
		var filtro: any = this.FiltroGarrafaForm.value;
		this.tabelaGarrafas = this.joinTableService.iniListaTableGarrafas(this.garrafas, this.vinhos);
		if (filtro.marca != "") this.tabelaGarrafas = this.filtroService.pesquisaMarca(this.tabelaGarrafas, filtro.marca);
		if (filtro.ano != 0 || filtro.capacidade != 0 || filtro.tipoVinho != 0 || filtro.categoria != 0){
			this.tabelaFiltroGarrafa = this.filtroService.filtroAnoCapacidadeTipoVinhoCategoria(filtro, this.tabelaGarrafas);
			this.tabelaGarrafas = this.tabelaFiltroGarrafa;
			if (this.tabelaGarrafas.length == 0) this.estadoTabelaGarrafa = false;
			else this.estadoTabelaGarrafa = true;
		}
		else{
			if (filtro.marca != "") this.tabelaGarrafas = this.filtroService.pesquisaMarca(this.tabelaGarrafas, filtro.marca);
			else this.tabelaGarrafas = this.joinTableService.iniListaTableGarrafas(this.garrafas, this.vinhos);
			this.tabelaFiltroGarrafa = [];
			this.estadoTabelaGarrafa = true;
		}
	}

	// Limpar pesquisa garrafa
	clearTabelaGarrafa(){
		this.tabelaGarrafas = this.joinTableService.iniListaTableGarrafas(this.garrafas, this.vinhos);
		this.estadoTabelaGarrafa = true;
		this.clearFormGarrafa();
	}

	// Limpar Form
	clearFormGarrafa(){
		this.FiltroGarrafaForm.controls['marca'].reset('');
		this.FiltroGarrafaForm.controls['ano'].reset(0);
		this.FiltroGarrafaForm.controls['capacidade'].reset(0);
		this.FiltroGarrafaForm.controls['tipoVinho'].reset(0);
		this.FiltroGarrafaForm.controls['categoria'].reset(0);
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