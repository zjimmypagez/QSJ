import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { Caixa } from '../../../../interfaces/caixa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

import { JoinTablesService } from '../../../../services/funcoes-service/join-tables.service';
import { FiltrosService } from '../../../../services/funcoes-service/filtros.service';

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
	FiltroForm: FormGroup;
	// Dados filtros
	materiais: string[] = ["Cartão", "Madeira"];
	capacidades: number[] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500, 3.000, 6.000, 12.000];
	tipoVinhos: string[] = ["Verde", "Rosé", "Tinto", "Branco", "Espumante", "Quinta"];
	categorias: string[] = [];
	// Estado que determina se resulta alguma tabela do processo de filtragem
	estadoTabela: boolean = true;
	// Tabela auxiliar no processo de filtragem
	tabelaFiltro: tableCaixa[] = [];
	// Selecionar a opção de registo
	inserirSelecionado: boolean = false;
	removerSelecionado: boolean = false;
	// Lista de modelos de caixa a ler da BD
	caixas: Caixa[];
	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[];
	// Tabela interligada entre caixas e vinhos
	tabelaCaixas: tableCaixa[];	

	constructor( private router: Router, private fb: FormBuilder, private joinTableService: JoinTablesService, private filtroService: FiltrosService ) { 
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
		this.iniListaCaixas();
		this.iniListaVinhos();
		this.tabelaCaixas = this.joinTableService.iniListaTableCaixas(this.caixas, this.vinhos);
		this.iniRemoverForm();
		this.categorias = this.filtroService.iniFiltroCategoria(this.vinhos);
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

	// Pesquisa a um determinada marca
	pesquisaMarca(form){
		var marca = form.marca;		
		if (marca != ""){
			if (form.material != "" || form.capacidade != "" || form.tipoVinho != "" || form.categoria != ""){
				if (this.tabelaFiltro.length != 0) this.tabelaCaixas = this.filtroService.pesquisaMarca(this.tabelaFiltro, marca);
				else this.tabelaCaixas = this.filtroService.pesquisaMarca(this.tabelaCaixas, marca);
			}
			else{
				this.tabelaCaixas = this.joinTableService.iniListaTableCaixas(this.caixas, this.vinhos);
				this.tabelaCaixas = this.filtroService.pesquisaMarca(this.tabelaCaixas, marca);
			} 
			if (this.tabelaCaixas.length == 0){
				this.tabelaCaixas = this.joinTableService.iniListaTableCaixas(this.caixas, this.vinhos);
				this.estadoTabela = false;
			}
			else this.estadoTabela = true;
		}
	}

	// Filtros 
	onChangeFiltro(){
		var filtro: any = this.FiltroForm.value;
		this.RegistoForm.controls['idCaixa'].reset('');
		this.tabelaCaixas = this.joinTableService.iniListaTableCaixas(this.caixas, this.vinhos);
		if (filtro.marca != "") this.tabelaCaixas = this.filtroService.pesquisaMarca(this.tabelaCaixas, filtro.marca);		
		if (filtro.material != "" || filtro.capacidade != "" || filtro.tipoVinho != "" || filtro.categoria != ""){
			this.tabelaFiltro = this.filtroService.filtroMaterialCapacidadeTipoVinhoCategoria(filtro, this.tabelaCaixas);
			this.tabelaCaixas = this.tabelaFiltro;
			if (this.tabelaCaixas.length == 0) this.estadoTabela = false;
			else this.estadoTabela = true;
		}
		else{
			if (filtro.marca != "") this.tabelaCaixas = this.filtroService.pesquisaMarca(this.tabelaCaixas, filtro.marca);
			else this.tabelaCaixas = this.joinTableService.iniListaTableCaixas(this.caixas, this.vinhos);
			this.tabelaFiltro = [];
			this.estadoTabela = true;
		}
	}
	
	// Limpar pesquisa
	clearTabela(){
		this.tabelaCaixas = this.joinTableService.iniListaTableCaixas(this.caixas, this.vinhos);
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

	// Dados criados (A ser subsituido pela ligação à BD)
	iniListaCaixas(){
		/*this.caixas = [{
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