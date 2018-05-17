import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { Garrafa } from '../../../../interfaces/garrafa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

import { JoinTablesService } from '../../../../services/funcoes-service/join-tables.service';

@Component({
	selector: 'app-inserir-remover-garrafas-func',
	templateUrl: './inserir-remover-garrafas-func.component.html',
	styleUrls: ['./inserir-remover-garrafas-func.component.css']
})
export class InserirRemoverGarrafasFuncComponent implements OnInit {
	RegistoForm: FormGroup;	
	Registo: formRegisto;

	InserirForm: FormGroup;
	Inserir: formInserirRemover;

	RemoverForm: FormGroup;
	Remover: formInserirRemover;

	RotularForm: FormGroup;
	Rotular: formRotular;

	inserirSelecionado: boolean = false;
	removerSelecionado: boolean = false;
	rotularSelecionado: boolean = false;

	// Lista de modelos de garrafa a ler da BD
	garrafas: Garrafa[];
	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[];
	// Tabela interligada entre caixas e vinhos
	tabelaGarrafas: tableGarrafa[];
	
	constructor( private router: Router, private fb: FormBuilder, private joinTableService: JoinTablesService ) { 
		this.RegistoForm = fb.group({
			'idGarrafa': ['', Validators.required],
			'comentario': ['', Validators.maxLength(200)],
			'opcao': ['', Validators.required]
		});
		this.InserirForm = fb.group({
			'cRotulo': ['', Validators.compose([Validators.required, Validators.min(0)])],
			'sRotulo': ['', Validators.compose([Validators.required, Validators.min(0)])]
		});
		this.RemoverForm = fb.group({
			'cRotulo': ['', Validators.compose([Validators.required, Validators.min(0)])],
			'sRotulo': ['', Validators.compose([Validators.required, Validators.min(0)])]
		});
		this.RotularForm = fb.group({
			'sRotulo': ['', Validators.compose([Validators.required, Validators.min(0)])]
		});
	}

	ngOnInit() {
		this.iniForms();
		this.iniListaGarrafas();
		this.iniListaVinhos();
		this.tabelaGarrafas = this.joinTableService.iniListaTableGarrafas(this.garrafas, this.vinhos);
	}

	// Criação de um novo registo de garrafa após verificações 
	novoRegisto(form, formInserir, formRemover, formRotular){
		this.Registo = form;

		if (formInserir.cRotulo != 0 || formInserir.sRotulo != 0 || formRemover.cRotulo != 0 || formRemover.sRotulo != 0 || formRotular.sRotulo != 0){
			switch (this.Registo.opcao){
				case "Inserir":{
					this.Inserir = formInserir;
					// inserir dados na bd
					alert("Foram inseridas: [" + this.Inserir.cRotulo + " C/Rótulo e " + this.Inserir.sRotulo + " S/Rótulo] garrafas!");
					this.router.navigate(['/func/garrafas']);
					break;
				}
				case "Remover":{
					this.Remover = formRemover;
					var quantidades: number[] = this.getQuantidade(this.Registo.idGarrafa);
					if (quantidades[0] >= this.Remover.cRotulo && quantidades[1] >= this.Remover.sRotulo){
						// remover quantidades da bd
						alert("Foram removidas: [" + this.Remover.cRotulo + " C/Rótulo e " + this.Remover.sRotulo + " S/Rótulo] garrafas!");
						this.router.navigate(['/func/garrafas']);
					}
					else{
						alert("As quantidades que pretende remover não se encontram em stock!");
						this.clearFormRemover();
					}
					break;
				}
				case "Rotular":{
					this.Rotular = formRotular;
					var quantidade: number = this.getQuantidadeSRotulo(this.Registo.idGarrafa);
					if (quantidade >= this.Rotular.sRotulo){
						// retirar a quantidade de garrafas a rotular da quantidade s/rotulo e adicionar a c/rotulo bd
						alert("Foram rotuladas: [" + this.Rotular.sRotulo + " S/Rótulo] garrafas!");
						this.router.navigate(['/func/garrafas']);
					}
					else{
						alert("Não existe a quantidade de garrafas em stock a serem rotuladas!");
						this.clearFormRotular();
					}
					break;
				}
			}
		}
		else{
			this.clearFormInserir();
			this.clearFormRemover();
			this.clearFormRotular();
			alert("Insira pelo menos uma quantidade positiva!");
		}
	}

	// Select da opção escolhida
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
		else{
			this.clearDados();
			this.removerSelecionado = false;
			this.inserirSelecionado = false;
			this.rotularSelecionado = false;
		}
	}

	getEstadoForm(){		
		if (this.RegistoForm.valid && this.InserirForm.valid)
			return false;
		else
			if (this.RegistoForm.valid && this.RemoverForm.valid)
				return false;
			else
				if (this.RegistoForm.valid && this.RotularForm.valid)
					return false;
				else
					return true;
	}

	// Limpa os dados do Formulário
	clearDados(){
		this.clearFormRegisto();
		this.clearFormInserir();
		this.clearFormRemover();
		this.clearFormRotular();
	}

	// Função que limpa os dados do form RegistoForm
	clearFormRegisto(){
		this.RegistoForm.controls['idGarrafa'].setValue('');
		this.RegistoForm.controls['comentario'].setValue('');
		this.RegistoForm.controls['opcao'].setValue('');	
		this.RegistoForm.markAsUntouched();	
	}

	// Função que limpa os dados do form InserirForm
	clearFormInserir(){
		this.InserirForm.controls['cRotulo'].setValue('');
		this.InserirForm.controls['sRotulo'].setValue('');
		this.InserirForm.markAsUntouched();	
	}

	// Função que limpa os dados do form RemoverForm
	clearFormRemover(){
		this.RemoverForm.controls['cRotulo'].setValue('');
		this.RemoverForm.controls['sRotulo'].setValue('');
		this.RemoverForm.markAsUntouched();	
	}

	// Função que limpa os dados do form RotularForm
	clearFormRotular(){
		this.RotularForm.controls['sRotulo'].setValue('');
		this.RotularForm.markAsUntouched();	
	}

	// Iniciar os objetos Registo, Inserir, Remover e Rotular
	iniForms(){
		this.Registo = {
			idGarrafa: null,
			comentario: '',
			opcao: ''
		}
		this.Inserir = {
			cRotulo: null,
			sRotulo: null
		}
		this.Remover = {
			cRotulo: null,
			sRotulo: null
		}
		this.Rotular = {
			sRotulo: null
		}
	}

	// Função que devolve as quantidades c/rotulo e s/rotulo
	getQuantidade(id: number): number[]{
		var quantidades: number[] = [];
		for (let i = 0; i < this.garrafas.length; i++){
			if (id == this.garrafas[i].id){
				quantidades.push(this.garrafas[i].cRotulo);
				quantidades.push(this.garrafas[i].sRotulo);
			}
		}
		return quantidades;
	}

	// Função que devolve a quantidade s/rotulo
	getQuantidadeSRotulo(id: number): number{
		var quantidade: number;
		for (let i = 0; i < this.garrafas.length; i++){
			if (id == this.garrafas[i].id){
				quantidade = this.garrafas[i].sRotulo;
			}
		}
		return quantidade;
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

}

interface formRegisto{
	idGarrafa: number,
	comentario: string,
	opcao: string
}

interface formInserirRemover{
	cRotulo: number,
	sRotulo: number
}

interface formRotular{
	sRotulo: number
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