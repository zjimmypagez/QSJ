import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { Observable } from "rxjs/observable";
import { Subscription } from 'rxjs/Subscription';

import { Caixa, CaixaEVinho } from '../../../../interfaces/caixa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

import { JoinTablesService } from '../../../../services/funcoes-service/join-tables.service';
import { FiltrosService } from '../../../../services/funcoes-service/filtros.service';

import { ValidatorRemover } from '../../../../validators/validator-caixas';

import { VinhoServiceService } from '../../../../services/vinho/vinho-service.service';
import { CaixaServiceService } from '../../../../services/caixa/caixa-service.service';
import { RegistoCaixaSId } from '../../../../interfaces/registoCaixa';
import { RegistoCaixaService } from '../../../../services/registo-caixa/registo-caixa.service';

@Component({
	selector: 'app-inserir-remover-caixa-func',
	templateUrl: './inserir-remover-caixa-func.component.html',
	styleUrls: ['./inserir-remover-caixa-func.component.css']
})
export class InserirRemoverCaixaFuncComponent implements OnInit, OnDestroy {
	RegistoForm: FormGroup;
	InserirForm: FormGroup;
	RemoverForm: FormGroup;
	FiltroForm: FormGroup;
	// Dados filtros
	materiais: string[] = ["Cartão", "Madeira"];
	capacidades: number[] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500, 3.000, 6.000, 12.000];
	tipoVinhos: string[] = ["Verde", "Rosé", "Tinto", "Branco", "Espumante", "Quinta"];
	categorias: string[] = [];
	// Estado que determina se resulta alguma tabela do processo de filtragem
	estadoTabela: boolean = true;
	// Tabela auxiliar no processo de filtragem
	caixasEVinhosFiltro: CaixaEVinho[] = [];
  	// Lista de modelos de garrafa a ler da BD
	caixasEVinhos: CaixaEVinho[] = [];	
	// Lista auxiliar total de garrafas a ler da BD
	caixasEVinhosAux: CaixaEVinho[];
	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[] = [];
	// Selecionar a opção de registo
	inserirSelecionado: boolean = false;
	removerSelecionado: boolean = false;
	// Lista de modelos de caixa a ler da BD
	caixas: Caixa[] = [];

	private subVinhos: Subscription;
	private subCaixas: Subscription;
	private subCaixasEVinhos: Subscription;	

	constructor( 
		private router: Router, 
		private fb: FormBuilder, 
		private joinTableService: JoinTablesService, 
		private filtroService: FiltrosService,
		private vinhoService: VinhoServiceService,
		private caixaService: CaixaServiceService,
		private registoCaixaService: RegistoCaixaService
	) { 
		this.RegistoForm = fb.group({
			'idCaixa': ['', Validators.required],
			'opcao': ['', Validators.required],
			'comentario': ['', Validators.maxLength(200)]
		});
		this.InserirForm = fb.group({
			'quantidade': [null, [Validators.required, Validators.min(1)]]
		})
		this.FiltroForm = fb.group({
			'marca': ['', Validators.required],
			'material': [0, ],
			'capacidade': [0, ],
			'tipoVinho': [0, ],
			'categoria': [0, ]
		});
	}

	ngOnInit() {
		this.getVinhos();
		this.getCaixas();
		this.getCaixasEVinhos();
		this.iniRemoverForm();
	}

	ngOnDestroy(){
		this.subVinhos.unsubscribe();
		this.subCaixas.unsubscribe();
		this.subCaixasEVinhos.unsubscribe();			
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

	// Subcrição do service CaixaService e obtenção dos dados de todas as caixas provenientes da BD
	getCaixas(){
		this.subCaixas = this.caixaService.getCaixas().subscribe(
			data => { 
				this.caixas = data 
			},
			err => console.error(err)
		);
	}

	// Subcrição do service CaixaService e obtenção dos dados de todos as caixas com a operação JOIN com os vinhos provenientes da BD
	getCaixasEVinhos(){
		this.subCaixasEVinhos = this.caixaService.getCaixasEVinhos().subscribe(
			data => { 
				this.caixasEVinhos = data;
				this.caixasEVinhosAux = data 
			},
			err => console.error(err),
			() => {
				this.iniRemoverForm();
			}
		);
	}
	
	// Inserir novo registo garrafa
	createRegistoCaixa(newRegistoCaixa: RegistoCaixaSId){
		const createRegistoCaixas = this.registoCaixaService.createRegistoCaixa(newRegistoCaixa).subscribe(
			data => data,
			err => console.error(err),
			() => {
				setTimeout(() => {
					alert("Operação realizada com sucesso!");				
				}, 500);
			}
		);
	}
	
	// Editar uma caixa selecionada
	editCaixa(editCaixa){
		const editCaixas = this.caixaService.editCaixaV1(editCaixa).subscribe(
			data => data,
			err => console.error(err),
			() => {
				setTimeout(() => {
					this.router.navigate(['/func/caixas']);					
				}, 500);
			}
		);
	}

	// Inicializar objeto form RemoverForm
	iniRemoverForm(){
		this.RemoverForm = this.fb.group({
			'quantidade': [null, [Validators.required, Validators.min(1), ValidatorRemover(this.caixas, this.RegistoForm)]]
		});
	}

	// Criação de um novo registo de caixa após verificações 
	novoRegisto(form){
		var currentUser = JSON.parse(localStorage.getItem('currentUser'));
		var id: number = currentUser.userID;
		var novoRegisto: RegistoCaixaSId = {
			Utilizador_ID: id,
			Caixa_ID: this.RegistoForm.get('idCaixa').value,
			Comentario: this.RegistoForm.get('comentario').value,
			Quantidade: 0,
			Data: new Date().toISOString().slice(0, 19).replace('T', ' ')
		}
		var caixaEscolhida: Caixa = this.caixas.find(x => x.ID == novoRegisto.Caixa_ID);
		switch (this.RegistoForm.get('opcao').value){
			case "Inserir":{
				novoRegisto.Quantidade = form.quantidade;
				this.createRegistoCaixa(novoRegisto);
				caixaEscolhida.Stock += novoRegisto.Quantidade;
				this.editCaixa(caixaEscolhida);
				break;
			}
			case "Remover":{
				novoRegisto.Quantidade = form.quantidade * -1;
				this.createRegistoCaixa(novoRegisto);
				caixaEscolhida.Stock += novoRegisto.Quantidade;
				this.editCaixa(caixaEscolhida);			
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

	// Pesquisa a um determinada marca
	pesquisaMarca(form){
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
				this.estadoTabela = false;
			}
			else this.estadoTabela = true;
		}
	}

	// Filtros 
	onChangeFiltro(){
		var filtro: any = this.FiltroForm.value;
		this.RegistoForm.controls['idCaixa'].reset('');
		this.reloadCaixasEVinhos();
		if (filtro.marca != "") this.caixasEVinhos = this.filtroService.pesquisaMarca(this.caixasEVinhos, filtro.marca);		
		if (filtro.material != "" || filtro.capacidade != "" || filtro.tipoVinho != "" || filtro.categoria != ""){
			this.caixasEVinhosFiltro = this.filtroService.filtroMaterialCapacidadeTipoVinhoCategoria(filtro, this.caixasEVinhos);
			this.caixasEVinhos = this.caixasEVinhosFiltro;
			if (this.caixasEVinhos.length == 0) this.estadoTabela = false;
			else this.estadoTabela = true;
		}
		else{
			if (filtro.marca != "") this.caixasEVinhos = this.filtroService.pesquisaMarca(this.caixasEVinhos, filtro.marca);
			else this.reloadCaixasEVinhos();
			this.caixasEVinhosFiltro = [];
			this.estadoTabela = true;
		}
	}
	
	// Limpar pesquisa
	clearTabela(){
		this.reloadCaixasEVinhos();
		this.estadoTabela = true;
		this.clearFiltroForm();
	}

	// Limpar FiltroForm
	clearFiltroForm(){
		this.FiltroForm.controls['marca'].reset('');
		this.FiltroForm.controls['material'].reset(0);
		this.FiltroForm.controls['capacidade'].reset(0);
		this.FiltroForm.controls['tipoVinho'].reset(0);
		this.FiltroForm.controls['categoria'].reset(0);
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

	// Recarregamento de todos as garrafas
	reloadCaixasEVinhos(){
		this.caixasEVinhos = [];
		this.caixasEVinhos = this.caixasEVinhosAux;
	}

}