import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { Router } from '@angular/router';

import { Garrafa } from '../../../../interfaces/garrafa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

import { JoinTablesService } from '../../../../services/funcoes-service/join-tables.service';
import { FiltrosService } from '../../../../services/funcoes-service/filtros.service';

import { ValidatorGarrafa, ValidatorCRotulo, ValidatorSRotulo, ValidatorRotular } from '../../../../validators/validator-garrafas';

@Component({
	selector: 'app-inserir-remover-garrafas-func',
	templateUrl: './inserir-remover-garrafas-func.component.html',
	styleUrls: ['./inserir-remover-garrafas-func.component.css']
})
export class InserirRemoverGarrafasFuncComponent implements OnInit {
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
	tabelaFiltro: tableGarrafa[] = [];
	// Selecionar opção de registo
	inserirSelecionado: boolean = false;
	removerSelecionado: boolean = false;
	rotularSelecionado: boolean = false;
	// Lista de modelos de garrafa a ler da BD
	garrafas: Garrafa[];
	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[];
	// Tabela interligada entre caixas e vinhos
	tabelaGarrafas: tableGarrafa[];
	
	constructor( private router: Router, private fb: FormBuilder, private joinTableService: JoinTablesService, private filtroService: FiltrosService ) { 
		this.RegistoForm = fb.group({
			'idGarrafa': ['', Validators.required],
			'comentario': ['', Validators.maxLength(200)],
			'opcao': ['', Validators.required]
		});
		this.InserirForm = fb.group({
			'cRotulo': [null, Validators.min(1)],
			'sRotulo': [null, Validators.min(1)]
		}, { validator: ValidatorGarrafa }
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
		this.iniListaGarrafas();
		this.iniListaVinhos();
		this.tabelaGarrafas = this.joinTableService.iniListaTableGarrafas(this.garrafas, this.vinhos);
		this.iniRemoverForm();
		this.iniRotularForm();
		this.anos = this.filtroService.iniFiltroAno(this.garrafas);
		this.categorias = this.filtroService.iniFiltroCategoria(this.vinhos);
	}

	// Inicializar a form RemoverForm
	iniRemoverForm(){
		this.RemoverForm = this.fb.group({
			'cRotulo': [null, [Validators.min(1), ValidatorCRotulo(this.garrafas, this.RegistoForm)]],
			'sRotulo': [null, [Validators.min(1), ValidatorSRotulo(this.garrafas, this.RegistoForm)]]
		}, { validator: ValidatorGarrafa }
		);
	}

	// Inicializar a form RotularForm
	iniRotularForm(){			
		this.RotularForm = this.fb.group({
			'sRotulo': [null, [Validators.min(1), ValidatorRotular(this.garrafas, this.RegistoForm)]]
		});
	}

	// Criação de um novo registo de garrafa após verificações 
	novoRegisto(f){
		var form: any = f;
		switch (this.RegistoForm.get('opcao').value){
			case "Inserir":{
				if (form.cRotulo == null) var cR: number = 0;
				else cR = form.cRotulo;
				if (form.sRotulo == null) var sR: number = 0;
				else sR = form.sRotulo;
				// Inserção na BD
				alert("Foi criado um novo registo de Inserção: [" + cR + " C/Rótulo e " + sR + " S/Rótulo]");
				this.router.navigate(['/func/garrafas']);
				break;
			}
			case "Remover":{
				if (form.cRotulo == null) var cR: number = 0;
				else cR = form.cRotulo;
				if (form.sRotulo == null) var sR: number = 0;
				else sR = form.sRotulo;
				// Remoção na BD
				alert("Foi criado um novo registo de Remoção: [" + cR + " C/Rótulo e " + sR + " S/Rótulo]");
				this.router.navigate(['/func/garrafas']);
				break;
			}
			case "Rotular":{
				// Retirar quantidade de garrafas s/rotulo e adicionar a quantidade respetiva em garrafas c/rotulo
				alert("Foi criado um novo registo de Rotulagem: [" + form.sRotulo + " C/Rótulo]");
				this.router.navigate(['/func/garrafas']);
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
				if (this.tabelaFiltro.length != 0) this.tabelaGarrafas = this.filtroService.pesquisaMarca(this.tabelaFiltro, marca);
				else this.tabelaGarrafas = this.filtroService.pesquisaMarca(this.tabelaGarrafas, marca);
			}
			else{
				this.tabelaGarrafas = this.joinTableService.iniListaTableGarrafas(this.garrafas, this.vinhos);
				this.tabelaGarrafas = this.filtroService.pesquisaMarca(this.tabelaGarrafas, marca);
			}
			if (this.tabelaGarrafas.length == 0){
				this.tabelaGarrafas = this.joinTableService.iniListaTableGarrafas(this.garrafas, this.vinhos);
				this.estadoTabela = false;
			}
			else this.estadoTabela = true;
		}
	}

	// Filtros 
	onChangeFiltro(){
		var filtro: any = this.FiltroForm.value;
		this.RegistoForm.controls['idGarrafa'].reset('');
		this.tabelaGarrafas = this.joinTableService.iniListaTableGarrafas(this.garrafas, this.vinhos);
		if (filtro.marca != "") this.tabelaGarrafas = this.filtroService.pesquisaMarca(this.tabelaGarrafas, filtro.marca);
		if (filtro.ano != "" || filtro.capacidade != "" || filtro.tipoVinho != "" || filtro.categoria != ""){
			this.tabelaFiltro = this.filtroService.filtroAnoCapacidadeTipoVinhoCategoria(filtro, this.tabelaGarrafas);
			this.tabelaGarrafas = this.tabelaFiltro;
			if (this.tabelaGarrafas.length == 0) this.estadoTabela = false;
			else this.estadoTabela = true;
		}
		else{
			if (filtro.marca != "") this.tabelaGarrafas = this.filtroService.pesquisaMarca(this.tabelaGarrafas, filtro.marca);
			else this.tabelaGarrafas = this.joinTableService.iniListaTableGarrafas(this.garrafas, this.vinhos);
			this.tabelaFiltro = [];
			this.estadoTabela = true;
		}
	}

	// Limpar pesquisa
	clearTabela(){
		this.tabelaGarrafas = this.joinTableService.iniListaTableGarrafas(this.garrafas, this.vinhos);
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

	// Dados criados (A ser subsituido pela ligação à BD)
	iniListaGarrafas(){
		/*this.garrafas = [{
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
		}];*/
	}

	// Dados criados (A ser subsituido pela ligação à BD)
	iniListaVinhos(){
		/*this.vinhos = [{
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
		}];*/
	}

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