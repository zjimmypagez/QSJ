import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { RegistoGarrafa } from '../../../../interfaces/registoGarrafa';

import { Garrafa } from '../../../../interfaces/garrafa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

@Component({
	selector: 'app-editar-garrafas-func',
	templateUrl: './editar-garrafas-func.component.html',
	styleUrls: ['./editar-garrafas-func.component.css']
})
export class EditarGarrafasFuncComponent implements OnInit {
	id: number;
	private sub: any;
	RegistoForm: FormGroup;
	Registo: formRegistoEditar;

	registo: RegistoGarrafa;
	opcao: string;
	garrafa: tableGarrafa;

	// Lista de modelos de garrafa a ler da BD
	garrafas: Garrafa[];
	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[];
	// Tabela interligada entre caixas e vinhos
	tabelaGarrafas: tableGarrafa[];
	// Lista de registos de caixa a ler da BD
	registos: RegistoGarrafa[];

	constructor( private route: ActivatedRoute, private router: Router, private fb: FormBuilder ) { 
		this.RegistoForm = fb.group({
			'comentario': ['', Validators.maxLength(200)]
		});
	}

	ngOnInit() {
		this.iniListaRegistos();
		this.iniListaGarrafas();
		this.iniListaVinhos();
		this.tabelaGarrafas = this.iniListatTableGarrafas(this.garrafas, this.vinhos);

		// Subscrição dos parametros do modelo da caixa escolhido para editar
		this.sub = this.route.params.subscribe(
			params => { this.id = +params['id']; }
		)

		// Procura na lista de garrafas (a ser lida da BD)
		for (let i = 0; i < this.registos.length; i++){
			if (this.registos[i].id == this.id)
			  this.registo = this.registos[i];
		}

		// Selecção da opção escolhida
		if ((this.registo.cRotulo + this.registo.sRotulo) > 0)
			this.opcao = "Inserir";
		else{
			this.opcao = "Remover";
		}

		// Seleção do modelo de garrafa escolhido
		for (let i = 0; i < this.tabelaGarrafas.length; i++){
			if (this.tabelaGarrafas[i].id == this.registo.idGarrafa)
				this.garrafa = this.tabelaGarrafas[i];
		}

		this.resetForm(this.registo);
	}

	// Editar o registo de garrafa após verificações
	editarRegisto(form){
		this.Registo = form;
		
		alert("O comentário foi editado com sucesso!");
		this.router.navigate(['/func/garrafas']);
	}

	// Reset dos dados da form
	clearDados(){
		this.resetForm(this.registo);
	}


	ngOnDestroy(){
		this.sub.unsubscribe();
	}

	// Coloca a form com os dados pre-selecionados
	public resetForm(registo: RegistoGarrafa){
		this.RegistoForm.controls['comentario'].setValue(registo.comentario);
	}

	// Obter iniciais da marca do vinho
	public getIniciaisMarca(id: number): string{
		var iniciais: string = "";
		var marca: string;
		for (let i = 0; i < this.vinhos.length; i++){
			if (id == this.vinhos[i].id)
				marca = this.vinhos[i].marca;
		}

		for (let i = 0; i < marca.length; i++){
			if(marca[i].match(/[A-Z]/) != null){
				iniciais = iniciais + marca[i];
		  }
		}
		return iniciais;
	}

	// Dados criados (A ser subsituido pela ligação à BD)
	public iniListaRegistos(){
		this.registos = [{
			id: 1,
			idGarrafa: 2,
			data: new Date(2012,3,25),
			comentario: "2 c/ defeito",
			cRotulo: 24,
			sRotulo: 24     
		},
		{
			id: 2,
			idGarrafa: 1,
			data: new Date(2017,4,2),
			comentario: "",
			cRotulo: 200,
      	sRotulo: 200  
		},
		{
			id: 3,
			idGarrafa: 1,
			data: new Date(2001,11,22),
			comentario: "5 partidas",
			cRotulo: 21,
      	sRotulo: null 
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

	// Interligação entre duas listas: Garrafa e Tipo de Vinho
	public iniListatTableGarrafas(garrafas: Garrafa[], vinhos: TipoVinho[]): tableGarrafa[]{
		var table: tableGarrafa[] = [];

		for (let i = 0; i < garrafas.length; i++){
			for (let j = 0; j < vinhos.length; j++){
				if (garrafas[i].tipoVinho == vinhos[j].id){
					var tableObj: tableGarrafa = {
						id: garrafas[i].id,
						lote: "LT-" + this.getIniciaisMarca(vinhos[j].id) + "-" + garrafas[i].ano + "-" + garrafas[i].cuba,
						cuba: garrafas[i].cuba,
						ano: garrafas[i].ano,
						marca: vinhos[j].marca,
						tipo: vinhos[j].tipo, 
						categoria: vinhos[j].categoria,
						capacidade: garrafas[i].capacidade,
						cRotulo: garrafas[i].cRotulo,
						sRotulo: garrafas[i].sRotulo  
					}
					table.push(tableObj);
				}
			}
		}

		return table;
	}

}

interface formRegistoEditar{
	comentario: string
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