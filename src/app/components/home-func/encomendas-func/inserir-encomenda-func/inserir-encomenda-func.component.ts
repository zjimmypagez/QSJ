import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { Router } from '@angular/router';
import { Observable } from "rxjs/observable";
import { Subscription } from 'rxjs/Subscription';

import { Encomenda, EncomendaSId } from '../../../../interfaces/encomenda';
import { Caixa, CaixaEVinho, TipoCaixaSId } from '../../../../interfaces/caixa';
import { Garrafa, GarrafaEVinho, TipoGarrafaSId } from '../../../../interfaces/garrafa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

import { FiltrosService } from '../../../../services/funcoes-service/filtros.service';

import { ValidatorEncomendaCaixasEspeciaisRegisto, ValidatorEncomendaCaixasRegisto, ValidatorEncomendaQuantidadeCaixas, ValidatorEncomendaQuantidadeCaixasEspeciais, ValidatorEncomendaQuantidadeGarrafas, ValidatorEncomendaQuantidadeGarrafasEspeciais, ValidatorEncomendaQuantidadeGarrafasEspeciaisPreenchida } from '../../../../validators/validator-encomendas';

import { VinhoServiceService } from '../../../../services/vinho/vinho-service.service';
import { CaixaServiceService } from '../../../../services/caixa/caixa-service.service';
import { GarrafaServiceService } from '../../../../services/garrafa/garrafa-service.service';
import { EncomendaService } from '../../../../services/encomenda/encomenda.service';

@Component({
	selector: 'app-inserir-encomenda-func',
	templateUrl: './inserir-encomenda-func.component.html',
	styleUrls: ['./inserir-encomenda-func.component.css']
})
export class InserirEncomendaFuncComponent implements OnInit, OnDestroy {
	DadosEncomendaForm: FormGroup;
	DadosCaixaForm: FormGroup;
	FiltroCaixaForm: FormGroup;
	FiltroGarrafaForm: FormGroup;
	// Dados filtros
	materiais: string[] = ["Cartão", "Madeira"];
	capacidades: number[] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500, 3.000, 6.000, 12.000];
	tipoVinhos: string[] = ["Verde", "Rosé", "Tinto", "Branco", "Espumante", "Quinta"];
	categorias: string[] = [];
	anos: number[] = [];
	// Estado que determina se resulta alguma tabela do processo de filtragem
	estadoTabelaCaixa: boolean = true;
	// Tabela auxiliar no processo de filtragem
	caixasEVinhosFiltro: CaixaEVinho[] = [];
  	// Lista de modelos de garrafa a ler da BD
	caixasEVinhos: CaixaEVinho[] = [];	
	// Lista auxiliar total de garrafas a ler da BD
	caixasEVinhosAux: CaixaEVinho[];
	// Estado que determina se resulta alguma tabela do processo de filtragem
	estadoTabelaGarrafa: boolean = true;
	// Tabela auxiliar no processo de filtragem
	garrafasEVinhosFiltro: GarrafaEVinho[] = [];
  	// Lista de modelos de garrafa a ler da BD
	garrafasEVinhos: GarrafaEVinho[] = [];	
	// Lista auxiliar total de garrafas a ler da BD
	garrafasEVinhosAux: GarrafaEVinho[];
	// Lista de encomendas a ler da BD
	encomendas: Encomenda[] = [];
	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[] = [];
	// Modelo selecionado
	modeloCaixaSelecionado: boolean = false;
	modeloGarrafaSelecionado: boolean = false;
	// Array individual, usado em cada item do form array
	modeloCapacidadeGarrafa: any[] = [];
	// Array individual, usado em cada item do form array
	modeloCapacidadeGarrafaEspecial: any[] = [];

	private subVinhos: Subscription;
	private subCaixasEVinhos: Subscription;	
	private subGarrafasEVinhos: Subscription;
	private subEncomendas: Subscription;

	constructor( 
		private router: Router, 
		private fb: FormBuilder, 
		private filtroService: FiltrosService,
		private vinhoService: VinhoServiceService,
		private caixaService: CaixaServiceService,
		private garrafaService: GarrafaServiceService,
		private encomendaService: EncomendaService
	) { 
		this.DadosEncomendaForm = fb.group({
			'nFatura': ['', Validators.min(1)],
			'comentario': ['', Validators.maxLength(200)]
		});
		this.FiltroCaixaForm = fb.group({
			'marca': ['', Validators.required],
			'material': [0, ],
			'capacidade': [0, ],
			'tipoVinho': [0, ],
			'categoria': [0, ]
		});
		this.FiltroGarrafaForm = fb.group({
			'marca': ['', Validators.required],
			'ano': [0, ],
			'capacidade': [0, ],
			'tipoVinho': [0, ],
			'categoria': [0, ]
		});
	}

	ngOnInit() {	
		this.getVinhos();
		this.getCaixasEVinhos();
		this.getGarrafasEVinhos();
		this.getEncomendas();
		this.iniDadosCaixasForm();
	}

	ngOnDestroy(){
		this.subVinhos.unsubscribe();
		this.subCaixasEVinhos.unsubscribe();
		this.subGarrafasEVinhos.unsubscribe();
		this.subEncomendas.unsubscribe();
	}

	// Subcrição do service VinhoService e obtenção dos dados de todos os vinhos provenientes da BD
	getVinhos(){
		this.subVinhos = this.vinhoService.getVinhos().subscribe(
			data => { 
				this.vinhos = data 
			},
			err => console.error(err),
			() => {
				this.categorias = this.filtroService.iniFiltroCategoria(this.vinhos);
			}
		);
	}

	// Subcrição do service CaixaService e obtenção dos dados de todos as caixas com a operação JOIN com os vinhos provenientes da BD
	getCaixasEVinhos(){
		this.subCaixasEVinhos = this.caixaService.getCaixasEVinhos().subscribe(
			data => { 
				this.caixasEVinhos = data;
				this.caixasEVinhosAux = data 
			},
			err => console.error(err)
		);
	}

	// Subcrição do service GarrafaService e obtenção dos dados de todos as garrafas com a operação JOIN com os vinhos provenientes da BD
	getGarrafasEVinhos(){
		this.subGarrafasEVinhos = this.garrafaService.getGarrafasEVinhos().subscribe(
			data => { 
				this.garrafasEVinhos = data;
				this.garrafasEVinhosAux = data 
			},
			err => console.error(err),
			() => {
				this.anos = this.filtroService.iniFiltroAno(this.garrafasEVinhos);
				this.iniDadosCaixasForm();
			}
		);
	}

	// Subcrição do service EncomendaService e obtenção dos dados de todas as encomendas provenientes da BD
	getEncomendas(){
		this.subEncomendas = this.encomendaService.getEncomendas().subscribe(
			data => { 
				this.encomendas = data 
			},
			err => console.error(err)
		);
	}
	
	// Inserir nova encomenda
	createEncomenda(newEncomenda: EncomendaSId){
		const createEncomendas = this.encomendaService.createEncomenda(newEncomenda).subscribe(
			data => data,
			err => console.error(err),
			() => {
				setTimeout(() => {
					alert("Operação realizada com sucesso!");			
					this.router.navigate(['func/encomendas']);	
				}, 500);
			}
		);
	}

	// Criar encomenda após verificações
	novoRegisto(dadosEncomenda, dadosCaixas){
		var currentUser = JSON.parse(localStorage.getItem('currentUser'));
		var id: number = currentUser.userID;
		var novaEncomenda: EncomendaSId = {
			Id_utilizador: id,
			Comentario: dadosEncomenda.comentario,
			Estado: 0,
			NFatura: dadosEncomenda.nFatura,
			_Data: new Date().toISOString().slice(0, 19).replace('T', ' '),
			DataEntrega: null,
			Caixas: []
		}
		var caixasNormais: any = dadosCaixas.linhaCaixas;
		var caixasEspeciais: any = dadosCaixas.linhaModelo;
		if (caixasNormais[0].caixa == "") novaEncomenda.Caixas = this.formatCaixaEspecial(caixasEspeciais);		 
		else{
			if (caixasEspeciais[0].caixa == "") novaEncomenda.Caixas = this.formatCaixaNormal(caixasNormais); 
			else{
				novaEncomenda.Caixas = this.formatCaixaEspecial(caixasEspeciais);				
				novaEncomenda.Caixas = novaEncomenda.Caixas.concat(this.formatCaixaNormal(caixasNormais));
			}
		}
		this.createEncomenda(novaEncomenda);
	}

	// Função que formata os dados recebidos para uma caixa especial
	formatCaixaEspecial(caixasEspeciais): TipoCaixaSId[]{
		var caixas: TipoCaixaSId[] = [];
		for (let i = 0; i < caixasEspeciais.length; i++){
			var novaCaixa: TipoCaixaSId = {
				Id_Caixa: caixasEspeciais[i].caixa,
				QuantidadeCaixa: caixasEspeciais[i].quantidadeCaixa,
				Tipo: "E",
				Garrafas: []
			}
			var linhaGarrafa: any = caixasEspeciais[i].linhaGarrafa;
			for (let j = 0; j < linhaGarrafa.length; j++){
				var garrafas: TipoGarrafaSId = {
					Garrafa_ID: linhaGarrafa[j].garrafa,
					QuantidadeGarrafa: linhaGarrafa[j].quantidadeGarrafa
				}					
			}
			novaCaixa.Garrafas.push(garrafas);
			caixas.push(novaCaixa);
		}	
		return caixas;
	}

	// Função que formata os dados recebidos para uma caixa normal
	formatCaixaNormal(caixasNormais): TipoCaixaSId[]{
		var caixas: TipoCaixaSId[] = [];
		for (let i = 0; i < caixasNormais.length; i++){
			var caixa: CaixaEVinho = this.caixasEVinhosAux.find(x => x.ID == caixasNormais[i].caixa);
			var novaCaixa: TipoCaixaSId = {
				Id_Caixa: caixasNormais[i].caixa,
				QuantidadeCaixa: caixasNormais[i].quantidade,
				Tipo: "N",
				Garrafas: []
			}
			var garrafas: TipoGarrafaSId = {
				Garrafa_ID: caixasNormais[i].garrafa,
				QuantidadeGarrafa: caixa.NGarrafas
			}		
			novaCaixa.Garrafas.push(garrafas);
			caixas.push(novaCaixa);
		}	
		return caixas;
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
					ValidatorEncomendaQuantidadeCaixas(this.caixasEVinhos), 
					ValidatorEncomendaQuantidadeGarrafas(this.caixasEVinhos, this.garrafasEVinhos)] 
				}
		);
	}

	// Inicializar objeto formArray linhaModelo do objeto form DadosCaixasForm - Caixas Especiais
	iniLinhaModelo(){
		return this.fb.group({
			'caixa': ['', Validators.required],
			'quantidadeCaixa': ['', Validators.compose([Validators.required, Validators.min(1)])],
			linhaGarrafa: this.fb.array([this.iniLinhaGarrafa()])
			}, { 
				validator: ValidatorEncomendaQuantidadeCaixasEspeciais(this.caixasEVinhos) 
			}
		);
	}

	// Inicializar objeto formArray linhaGarrafa do objeto formArray linhaModelo do objeto form DadosCaixasForm - Caixas Especiais
	iniLinhaGarrafa(){
		return this.fb.group({			
			'garrafa': ['', Validators.required],
			'quantidadeGarrafa': ['', Validators.compose([Validators.required, Validators.min(1)])],
			}, { validator: [
					ValidatorEncomendaCaixasEspeciaisRegisto(), 
					ValidatorEncomendaQuantidadeGarrafasEspeciais(this.caixasEVinhos, this.garrafasEVinhos),
					ValidatorEncomendaQuantidadeGarrafasEspeciaisPreenchida(this.caixasEVinhos)] 
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
		var caixa: CaixaEVinho = this.caixasEVinhos.find(x => x.ID == idCaixa);
		var garrafas: number = caixa.NGarrafas;
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
		var modeloCaixa: CaixaEVinho = this.caixasEVinhos.find(x => x.ID == id);
		var listaGarrafas: GarrafaEVinho[] = this.garrafasEVinhos.filter(
			x => x.Capacidade === modeloCaixa.CapacidadeGarrafa && 
			x.Marca == modeloCaixa.Marca && 
			x.Tipo == modeloCaixa.Tipo &&
			x.Categoria == modeloCaixa.Categoria
		);
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
		var modeloCaixa: CaixaEVinho = this.caixasEVinhos.find(x => x.ID == id);
		var listaGarrafas: GarrafaEVinho[] = this.garrafasEVinhos.filter(			
			x => x.Capacidade === modeloCaixa.CapacidadeGarrafa && 
			x.Marca == modeloCaixa.Marca && 
			x.Tipo == modeloCaixa.Tipo &&
			x.Categoria == modeloCaixa.Categoria	
		);
		this.modeloCapacidadeGarrafaEspecial[index] = listaGarrafas;
		for (let i = linhaGarrafa.length; i > 0; i--) linhaGarrafa.removeAt(i);
	}

	// Ver se o formulário é válido
	getValidForm(){
		if (this.DadosCaixaForm.get('linhaModelo').valid || this.DadosCaixaForm.get('linhaCaixas').valid) return false;
		return true;
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
				if (this.caixasEVinhosFiltro.length != 0) this.caixasEVinhos = this.filtroService.pesquisaMarca(this.caixasEVinhosFiltro, marca);
				else this.caixasEVinhos = this.filtroService.pesquisaMarca(this.caixasEVinhos, marca);
			}
			else{
				this.reloadCaixasEVinhos();
				this.caixasEVinhos = this.filtroService.pesquisaMarca(this.caixasEVinhos, marca);
			} 
			if (this.caixasEVinhos.length == 0){
				this.reloadCaixasEVinhos();
				this.estadoTabelaCaixa = false;
			}
			else this.estadoTabelaCaixa = true;
		}
	}

	// Filtragem caixa
	onChangeCaixa(){
		var filtro: any = this.FiltroCaixaForm.value;
		this.reloadCaixasEVinhos();
		if (filtro.marca != "") this.caixasEVinhos = this.filtroService.pesquisaMarca(this.caixasEVinhos, filtro.marca);		
		if (filtro.material != "" || filtro.capacidade != "" || filtro.tipoVinho != "" || filtro.categoria != ""){
			this.caixasEVinhosFiltro = this.filtroService.filtroMaterialCapacidadeTipoVinhoCategoria(filtro, this.caixasEVinhos);
			this.caixasEVinhos = this.caixasEVinhosFiltro;
			if (this.caixasEVinhos.length == 0) this.estadoTabelaCaixa = false;
			else this.estadoTabelaCaixa = true;
		}
		else{
			if (filtro.marca != "") this.caixasEVinhos = this.filtroService.pesquisaMarca(this.caixasEVinhos, filtro.marca);
			else this.reloadCaixasEVinhos();
			this.caixasEVinhosFiltro = [];
			this.estadoTabelaCaixa = true;
		}
	}

	// Limpar pesquisa Caixa
	clearTabelaCaixa(){
		this.reloadCaixasEVinhos();
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

	// Recarregamento de todos as garrafas
	reloadCaixasEVinhos(){
		this.caixasEVinhos = [];
		this.caixasEVinhos = this.caixasEVinhosAux;
	}

	// Pesquisa na tabela garrafa
	pesquisaMarcaGarrafa(form){
		var marca = form.marca;		
		if (marca != ""){
			if (form.ano != 0 || form.capacidade != 0 || form.tipoVinho != 0 || form.categoria != 0){
				if (this.garrafasEVinhosFiltro.length != 0) this.garrafasEVinhos = this.filtroService.pesquisaMarca(this.garrafasEVinhosFiltro, marca);
				else this.garrafasEVinhos = this.filtroService.pesquisaMarca(this.garrafasEVinhos, marca);
			}
			else{
				this.reloadGarrafasEVinhos();
				this.garrafasEVinhos = this.filtroService.pesquisaMarca(this.garrafasEVinhos, marca);
			}
			if (this.garrafasEVinhos.length == 0) {
				this.reloadGarrafasEVinhos();
				this.estadoTabelaGarrafa = false;
			}				
			else this.estadoTabelaGarrafa = true;
		}
	}

	// Filtragem Garrafa
	onChangeGarrafa(){
		var filtro: any = this.FiltroGarrafaForm.value;
		this.reloadGarrafasEVinhos();
		if (filtro.marca != "") this.garrafasEVinhos = this.filtroService.pesquisaMarca(this.garrafasEVinhos, filtro.marca);
		if (filtro.ano != 0 || filtro.capacidade != 0 || filtro.tipoVinho != 0 || filtro.categoria != 0){
			this.garrafasEVinhosFiltro = this.filtroService.filtroAnoCapacidadeTipoVinhoCategoria(filtro, this.garrafasEVinhos);
			this.garrafasEVinhos = this.garrafasEVinhosFiltro;
			if (this.garrafasEVinhos.length == 0) this.estadoTabelaGarrafa = false;
			else this.estadoTabelaGarrafa = true;
		}
		else{
			if (filtro.marca != "") this.garrafasEVinhos = this.filtroService.pesquisaMarca(this.garrafasEVinhos, filtro.marca);
			else this.reloadGarrafasEVinhos();
			this.garrafasEVinhosFiltro = [];
			this.estadoTabelaGarrafa = true;
		}
	}

	// Limpar pesquisa garrafa
	clearTabelaGarrafa(){
		this.reloadGarrafasEVinhos();
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

	// Recarregamento de todos as garrafas
	reloadGarrafasEVinhos(){
		this.garrafasEVinhos = [];
		this.garrafasEVinhos = this.garrafasEVinhosAux;
	}

}