import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { Router } from '@angular/router';
import { Observable } from "rxjs/observable";
import { Subscription } from 'rxjs/Subscription';

import { Garrafa, GarrafaEVinho } from '../../../../interfaces/garrafa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';
import { RegistoGarrafaSId } from '../../../../interfaces/registoGarrafa';

import { FiltrosService } from '../../../../services/funcoes-service/filtros.service';

import { ValidatorGarrafa, ValidatorCRotulo, ValidatorSRotulo, ValidatorRotular } from '../../../../validators/validator-garrafas';

import { VinhoServiceService } from '../../../../services/vinho/vinho-service.service';
import { GarrafaServiceService } from '../../../../services/garrafa/garrafa-service.service';
import { RegistoGarrafaService } from '../../../../services/registo-garrafa/registo-garrafa.service';

@Component({
	selector: 'app-inserir-remover-garrafas-func',
	templateUrl: './inserir-remover-garrafas-func.component.html',
	styleUrls: ['./inserir-remover-garrafas-func.component.css']
})
export class InserirRemoverGarrafasFuncComponent implements OnInit, OnDestroy {
	RegistoForm: FormGroup;	
	InserirForm: FormGroup;
	RemoverForm: FormGroup;
	RotularForm: FormGroup;
	FiltroForm: FormGroup;
	// Dados filtros
	anos: number[] = [];
	capacidades: number[] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500, 3.000, 6.000, 12.000];
	tipoVinhos: string[] = ["Verde", "Rosé", "Tinto", "Branco", "Espumante", "Quinta"];
	categorias: string[] = [];
	// Estado que determina se resulta alguma tabela do processo de filtragem
	estadoTabela: boolean = true;
	// Tabela auxiliar no processo de filtragem
	garrafasEVinhosFiltro: GarrafaEVinho[] = [];
  	// Lista de modelos de garrafa a ler da BD
	garrafasEVinhos: GarrafaEVinho[] = [];	
	// Lista auxiliar total de garrafas a ler da BD
	garrafasEVinhosAux: GarrafaEVinho[];
	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[] = [];
	// Selecionar opção de registo
	inserirSelecionado: boolean = false;
	removerSelecionado: boolean = false;
	rotularSelecionado: boolean = false;
	// Lista de modelos de caixa a ler da BD
	garrafas: Garrafa[] = [];

	private subVinhos: Subscription;
	private subGarrafas: Subscription;
	private subGarrafasEVinhos: Subscription;
	
	constructor( 
		private router: Router, 
		private fb: FormBuilder, 
		private filtroService: FiltrosService,
		private vinhoService: VinhoServiceService,
		private garrafaService: GarrafaServiceService,
		private registoGarrafaService: RegistoGarrafaService
	) { 
		this.RegistoForm = fb.group({
			'idGarrafa': ['', Validators.required],
			'comentario': ['', Validators.maxLength(200)],
			'opcao': ['', Validators.required]
		});
		this.InserirForm = fb.group({
			'cRotulo': [null, Validators.min(1)],
			'sRotulo': [null, Validators.min(1)]
		}, { 
			validator: ValidatorGarrafa 
		}
		);	
		this.FiltroForm = fb.group({
			'marca': ['', Validators.required],
			'ano': [0, ],
			'capacidade': [0, ],
			'tipoVinho': [0, ],
			'categoria': [0, ]
		});
	}			

	ngOnInit() {
		this.getVinhos();
		this.getGarrafas();
		this.getGarrafasEVinhos();		
		this.iniRemoverForm();
		this.iniRotularForm();
	}

	ngOnDestroy(){
		this.subVinhos.unsubscribe();
		this.subGarrafas.unsubscribe();
		this.subGarrafasEVinhos.unsubscribe();	
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

	// Subcrição do service GarrafaService e obtenção dos dados de todas as garrafas provenientes da BD
	getGarrafas(){
		this.subGarrafas = this.garrafaService.getGarrafas().subscribe(
			data => { 
				this.garrafas = data 
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
				this.iniRemoverForm();
				this.iniRotularForm();
			}
		);
	}
	
	// Inserir novo registo garrafa
	createRegistoGarrafa(newRegistoGarrafa: RegistoGarrafaSId){
		const createRegistoGarrafas = this.registoGarrafaService.createRegistoGarrafa(newRegistoGarrafa).subscribe(
			data => data,
			err => console.error(err),
			() => {
				setTimeout(() => {
					alert("Operação realizada com sucesso!");				
				}, 500);
			}
		);
	}
	
	// Editar uma garrafa selecionada
	editGarrafa(editGarrafa){
		const editGarrafas = this.garrafaService.editGarrafaV1(editGarrafa).subscribe(
			data => data,
			err => console.error(err),
			() => {
				setTimeout(() => {
					this.router.navigate(['/func/garrafas']);					
				}, 500);
			}
		);
	}

	// Inicializar a form RemoverForm
	iniRemoverForm(){
		this.RemoverForm = this.fb.group({
			'cRotulo': [null, [Validators.min(1), ValidatorCRotulo(this.garrafasEVinhos, this.RegistoForm)]],
			'sRotulo': [null, [Validators.min(1), ValidatorSRotulo(this.garrafasEVinhos, this.RegistoForm)]]
			}, { 
				validator: ValidatorGarrafa 
			}
		);
	}

	// Inicializar a form RotularForm
	iniRotularForm(){			
		this.RotularForm = this.fb.group({
			'sRotulo': [null, [Validators.min(1), ValidatorRotular(this.garrafasEVinhos, this.RegistoForm)]]
		});
	}

	// Criação de um novo registo de garrafa após verificações 
	novoRegisto(form){
		var currentUser = JSON.parse(localStorage.getItem('currentUser'));
		var id: number = currentUser.userID;
		var novoRegisto: RegistoGarrafaSId = {
			Garrafa_ID: this.RegistoForm.get('idGarrafa').value,
			Utilizador_ID: id,
			Comentario: this.RegistoForm.get('comentario').value,
			QTSRotulo: 0,
			QTCRotulo: 0,
			Data: new Date().toISOString().slice(0, 19).replace('T', ' ')
		}
		var garrafaEscolhida: Garrafa = this.garrafas.find(x => x.Id == novoRegisto.Garrafa_ID);
		switch (this.RegistoForm.get('opcao').value){
			case "Inserir":{
				if (form.cRotulo != null) novoRegisto.QTCRotulo = form.cRotulo;
				if (form.sRotulo != null) novoRegisto.QTSRotulo = form.sRotulo;
				this.createRegistoGarrafa(novoRegisto);
				garrafaEscolhida.CRotulo += novoRegisto.QTCRotulo;
				garrafaEscolhida.SRotulo += novoRegisto.QTSRotulo;
				this.editGarrafa(garrafaEscolhida);
				break;
			}
			case "Remover":{
				if (form.cRotulo != null) novoRegisto.QTCRotulo = form.cRotulo * -1;
				if (form.sRotulo != null) novoRegisto.QTSRotulo = form.sRotulo * -1;
				this.createRegistoGarrafa(novoRegisto);
				garrafaEscolhida.CRotulo += novoRegisto.QTCRotulo;
				garrafaEscolhida.SRotulo += novoRegisto.QTSRotulo;
				this.editGarrafa(garrafaEscolhida);
				break;
			}
			case "Rotular":{
				novoRegisto.QTCRotulo = form.sRotulo;
				novoRegisto.QTSRotulo = form.sRotulo * -1;
				this.createRegistoGarrafa(novoRegisto);
				garrafaEscolhida.CRotulo += novoRegisto.QTCRotulo;
				garrafaEscolhida.SRotulo += novoRegisto.QTSRotulo;
				this.editGarrafa(garrafaEscolhida);
				break;
			}
		}
	}

	// Select da view escolhida
	onChange(op){
		if (op != ""){
			switch (op){
				case "Inserir":{
					this.rotularSelecionado = false;
					this.clearFormRotular();
					this.removerSelecionado = false;
					this.clearFormRemover();
					this.inserirSelecionado = true;
					break;
				}
				case "Remover":{
					this.rotularSelecionado = false;
					this.clearFormRotular();
					this.inserirSelecionado = false;
					this.clearFormInserir();
					this.removerSelecionado = true;
					break;
				}
				case "Rotular":{
					this.removerSelecionado = false;
					this.clearFormRemover();
					this.inserirSelecionado = false;
					this.clearFormInserir();
					this.rotularSelecionado = true;
					break;
				}
			}
		}
	}

	// Verficações sobre a validação do form
	getEstadoForm(){		
		if (this.RegistoForm.valid && this.InserirForm.valid) return false;
		else
			if (this.RegistoForm.valid && this.RemoverForm.valid) return false;
			else
				if (this.RegistoForm.valid && this.RotularForm.valid) return false;
				else return true;
	}

	// Pesquisa a um determinada marca
	pesquisaMarca(form){
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
			if (this.garrafasEVinhos.length == 0){
				this.reloadGarrafasEVinhos();
				this.estadoTabela = false;
			}
			else this.estadoTabela = true;
		}
	}

	// Filtros 
	onChangeFiltro(){
		var filtro: any = this.FiltroForm.value;
		this.RegistoForm.controls['idGarrafa'].reset('');
		this.reloadGarrafasEVinhos();
		if (filtro.marca != "") this.garrafasEVinhos = this.filtroService.pesquisaMarca(this.garrafasEVinhos, filtro.marca);
		if (filtro.ano != "" || filtro.capacidade != "" || filtro.tipoVinho != "" || filtro.categoria != ""){
			this.garrafasEVinhosFiltro = this.filtroService.filtroAnoCapacidadeTipoVinhoCategoria(filtro, this.garrafasEVinhos);
			this.garrafasEVinhos = this.garrafasEVinhosFiltro;
			if (this.garrafasEVinhos.length == 0) this.estadoTabela = false;
			else this.estadoTabela = true;
		}
		else{
			if (filtro.marca != "") this.garrafasEVinhos = this.filtroService.pesquisaMarca(this.garrafasEVinhos, filtro.marca);
			else this.reloadGarrafasEVinhos();
			this.garrafasEVinhosFiltro = [];
			this.estadoTabela = true;
		}
	}

	// Limpar pesquisa
	clearTabela(){
		this.reloadGarrafasEVinhos();
		this.estadoTabela = true;
		this.clearFiltroForm();
	}

	// Limpar FiltroForm
	clearFiltroForm(){
		this.FiltroForm.controls['marca'].reset('');
		this.FiltroForm.controls['ano'].reset(0);
		this.FiltroForm.controls['capacidade'].reset(0);
		this.FiltroForm.controls['tipoVinho'].reset(0);
		this.FiltroForm.controls['categoria'].reset(0);
	}

	// Limpa os dados do Formulário
	clearDados(){
		this.clearFormRegisto();
		this.clearFormInserir();
		this.inserirSelecionado = false;
		this.clearFormRemover();
		this.removerSelecionado = false;		
		this.clearFormRotular();
		this.rotularSelecionado = false;		
	}

	// Função que limpa os dados do form RegistoForm
	clearFormRegisto(){
		this.RegistoForm.controls['idGarrafa'].reset('');
		this.RegistoForm.controls['comentario'].reset('');
		this.RegistoForm.controls['opcao'].reset('');	
		this.RegistoForm.markAsUntouched();	
	}

	// Função que limpa os dados do form InserirForm
	clearFormInserir(){
		this.InserirForm.controls['cRotulo'].reset(null);
		this.InserirForm.controls['sRotulo'].reset(null);
		this.InserirForm.markAsUntouched();	
	}

	// Função que limpa os dados do form RemoverForm
	clearFormRemover(){
		this.RemoverForm.controls['cRotulo'].reset(null);
		this.RemoverForm.controls['sRotulo'].reset(null);
		this.RemoverForm.markAsUntouched();	
	}

	// Função que limpa os dados do form RotularForm
	clearFormRotular(){
		this.RotularForm.controls['sRotulo'].reset(null);
		this.RotularForm.markAsUntouched();	
	}

	// Recarregamento de todos as garrafas
	reloadGarrafasEVinhos(){
		this.garrafasEVinhos = [];
		this.garrafasEVinhos = this.garrafasEVinhosAux;
	}

}