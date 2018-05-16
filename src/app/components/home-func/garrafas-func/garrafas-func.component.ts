import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { Garrafa } from '../../../interfaces/garrafa';
import { TipoVinho } from '../../../interfaces/tipoVinho';
import { RegistoGarrafa } from '../../../interfaces/registoGarrafa';

@Component({
	selector: 'app-garrafas-func',
	templateUrl: './garrafas-func.component.html',
	styleUrls: ['./garrafas-func.component.css']
})
export class GarrafasFuncComponent implements OnInit {
	// Dados filtros
	FiltroForm: FormGroup;
	anos: number[] = [];
	categorias: string[] = [];
	capacidades: number[] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500, 3.000, 6.000, 12.000];
	estadoTabela: boolean = true;

	tipoVinhos: string[] = ["Verde", "Rosé", "Tinto", "Branco", "Espumante", "Quinta"];

	// Lista de modelos de garrafa a ler da BD
	garrafas: Garrafa[];
	// Lista de modelos de vinho a ler da BD
	vinhos: TipoVinho[];
	// Lista de registo de garrafas a ler da BD
	registos: RegistoGarrafa[];
	// Tabela interligada entre garrafa e registo garrafas
	tabelaGarrafaRegistos: tableGarrafaRegisto[];
	// Tabela interligada entre tabelaregisto garrafas e vinhos
	tabelaRegistos: tableRegisto[];

	constructor( private router: Router, private fb: FormBuilder ) { 
		this.FiltroForm = fb.group({
			'marca': ['', Validators.minLength(1)],
			'ano': ['', ],
			'capacidade': ['', ],
			'tipoVinho': ['', ],
			'categoria': ['', ]
		});
	}

	ngOnInit() {
		this.iniListaGarrafas();
		this.iniListaRegistos();
		this.tabelaGarrafaRegistos = this.iniListatTableGarrafaRegistos(this.garrafas, this.registos);
		
		this.iniListaVinhos();
		this.tabelaRegistos = this.iniListatTableRegistos(this.tabelaGarrafaRegistos, this.vinhos);

		this.iniFiltroAno();
		this.categorias = this.iniFiltroCategoria();
	}

	// Função responsável por selecionar o registo de garrafa a ser editado
   editarRegisto(id: number){
		this.router.navigate(['/func/garrafas/editar', id]);
	}
	
	// Função responsável por eliminar o registo de garrafa selecionado
	eliminarRegisto(id: number){
		var estadoRegisto = prompt("Insira as credenciais necessárias para eliminar o registo:");;

		if (estadoRegisto == "password"){
			if (confirm("Quer mesmo eliminar este registo?")){
				alert("O registo de garrafa foi eliminado com sucesso!");
				this.router.navigate(['/func/garrafas']);
			}
		}
	}

	// Pesquisa a um determinada marca
	pesquisaMarca(form){
		var frm = form;
		
		if (frm.marca != ""){
			var tabelaMarca: tableRegisto[] = [];
			for (let i = 0; i < this.tabelaRegistos.length; i++){
				if (frm.marca.toUpperCase() === this.tabelaRegistos[i].marca.toUpperCase()){
					tabelaMarca.push(this.tabelaRegistos[i]);
				}
			}
			if (tabelaMarca.length == 0){
				this.estadoTabela = false;
			}
			else{
				this.estadoTabela = true;
				this.tabelaRegistos = tabelaMarca;
			}
		}
		else{
			this.estadoTabela = true;
			this.tabelaRegistos = this.iniListatTableRegistos(this.tabelaGarrafaRegistos, this.vinhos);
			this.clearForm();				
			alert("Pesquisa inválida!");
		}
	}

	// Filtros 
	onChange(){
		var filtro: any = this.FiltroForm.value;
		this.tabelaRegistos = this.iniListatTableRegistos(this.tabelaGarrafaRegistos, this.vinhos);

		if (filtro.ano != "" || filtro.capacidade != "" || filtro.tipoVinho != "" || filtro.categoria != ""){
			if (filtro.ano != "" && filtro.capacidade != "" && filtro.tipoVinho != "" && filtro.categoria != ""){
				this.tabelaRegistos = this.filtrarAno(filtro);
				this.tabelaRegistos = this.filtrarCapacidade(filtro);
				this.tabelaRegistos = this.filtrarTipoVinho(filtro);
				this.tabelaRegistos = this.filtrarCategoriaVinho(filtro);
			}
			else{
				if (filtro.ano != "" && filtro.capacidade != "" && filtro.tipoVinho != ""){
					this.tabelaRegistos = this.filtrarAno(filtro);
					this.tabelaRegistos = this.filtrarCapacidade(filtro);	
					this.tabelaRegistos = this.filtrarTipoVinho(filtro);	
				}
				else{
					if (filtro.ano != "" && filtro.capacidade != "" && filtro.categoria != ""){
						this.tabelaRegistos = this.filtrarAno(filtro);
						this.tabelaRegistos = this.filtrarCapacidade(filtro);
						this.tabelaRegistos = this.filtrarCategoriaVinho(filtro);
					}
					else{
						if (filtro.ano != "" && filtro.tipoVinho != "" && filtro.categoria != ""){
							this.tabelaRegistos = this.filtrarAno(filtro);
							this.tabelaRegistos = this.filtrarTipoVinho(filtro);
							this.tabelaRegistos = this.filtrarCategoriaVinho(filtro);
						}
						else{
							if (filtro.capacidade != "" && filtro.tipoVinho != "" && filtro.categoria != ""){
								this.tabelaRegistos = this.filtrarCapacidade(filtro);
								this.tabelaRegistos = this.filtrarTipoVinho(filtro);
								this.tabelaRegistos = this.filtrarCategoriaVinho(filtro);
							}
							else{
								if (filtro.ano != "" && filtro.capacidade != ""){
									this.tabelaRegistos = this.filtrarAno(filtro);
									this.tabelaRegistos = this.filtrarCapacidade(filtro);
								}
								else{
									if (filtro.ano != "" && filtro.tipoVinho != ""){
										this.tabelaRegistos = this.filtrarAno(filtro);
										this.tabelaRegistos = this.filtrarTipoVinho(filtro);
									}
									else{
										if (filtro.ano != "" && filtro.categoria != ""){
											this.tabelaRegistos = this.filtrarAno(filtro);
											this.tabelaRegistos = this.filtrarCategoriaVinho(filtro);
										}
										else{
											if (filtro.capacidade != "" && filtro.tipoVinho != ""){
												this.tabelaRegistos = this.filtrarCapacidade(filtro);
												this.tabelaRegistos = this.filtrarTipoVinho(filtro);
											}
											else{
												if (filtro.capacidade != "" && filtro.categoria != ""){
													this.tabelaRegistos = this.filtrarCapacidade(filtro);
													this.tabelaRegistos = this.filtrarCategoriaVinho(filtro);
												}
												else{
													if (filtro.tipoVinho != "" && filtro.categoria != ""){
														this.tabelaRegistos = this.filtrarTipoVinho(filtro);
														this.tabelaRegistos = this.filtrarCategoriaVinho(filtro);
													}
													else{
														if (filtro.ano != ""){
															this.tabelaRegistos = this.filtrarAno(filtro);
														}
														else{
															if (filtro.capacidade != ""){
																this.tabelaRegistos = this.filtrarCapacidade(filtro);
															}
															else{
																if (filtro.tipoVinho != ""){
																	this.tabelaRegistos = this.filtrarTipoVinho(filtro);
																}
																else{
																	this.tabelaRegistos = this.filtrarCategoriaVinho(filtro);
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			if (this.tabelaRegistos.length == 0){
				this.estadoTabela = false;
			}
			else{
				this.estadoTabela = true;
			}
		}
		else{
			this.tabelaRegistos = this.iniListatTableRegistos(this.tabelaGarrafaRegistos, this.vinhos);
			this.estadoTabela = true;
		}
	}

	// Função que filtra ano
	public filtrarAno(filtro: any): tableRegisto[]{
		var tabelaAno: tableRegisto[] = [];
		for (let i = 0; i < this.tabelaRegistos.length; i++){
			if (this.tabelaRegistos[i].ano == filtro.ano){
				tabelaAno.push(this.tabelaRegistos[i]);
			}
		}
		return tabelaAno;
	}

	// Função que filtra capacidade
	public filtrarCapacidade(filtro: any): tableRegisto[]{
		var tabelaCapacidade: tableRegisto[] = [];
		for (let i = 0; i < this.tabelaRegistos.length; i++){
			if (this.tabelaRegistos[i].capacidade == filtro.capacidade){
				tabelaCapacidade.push(this.tabelaRegistos[i]);
			}
		}
		return tabelaCapacidade;
	}

	// Função que filtra tipo de vinho
	public filtrarTipoVinho(filtro: any): tableRegisto[]{
		var tabelaTipoVinho: tableRegisto[] = [];
		for (let i = 0; i < this.tabelaRegistos.length; i++){
			if (this.tabelaRegistos[i].tipo == filtro.tipoVinho){
				tabelaTipoVinho.push(this.tabelaRegistos[i]);
			}
		}
		return tabelaTipoVinho;
	}

	// Função que filtra categoria do vinho
	public filtrarCategoriaVinho(filtro: any): tableRegisto[]{
		var tabelaCategoriaVinho: tableRegisto[] = [];
		if (filtro.categoria != "Normal"){
			for (let i = 0; i < this.tabelaRegistos.length; i++){
				if (this.tabelaRegistos[i].categoria == filtro.categoria){
					tabelaCategoriaVinho.push(this.tabelaRegistos[i]);
				}
			}
		}
		else{
			for (let i = 0; i < this.tabelaRegistos.length; i++){
				if (this.tabelaRegistos[i].categoria == ""){
					tabelaCategoriaVinho.push(this.tabelaRegistos[i]);
				}
			}
		}
		return tabelaCategoriaVinho;
	}

	// Inicializar o filtro ano
	public iniFiltroAno(){
		var anoMax: number = 0;
		var anoMin: number = 2100;		

		for (let i = 0; i < this.garrafas.length; i++){
			if (this.garrafas[i].ano > anoMax)
				anoMax = this.garrafas[i].ano;
			if (this.garrafas[i].ano < anoMin)
				anoMin = this.garrafas[i].ano;
		}

		for (let i = anoMin; i <= anoMax; i++){
			this.anos.push(i);
		}
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

	// Incializar o filtro categorias
	public iniFiltroCategoria(): string[]{
		var categorias: string[] = [];
		var first: number = 0;

		for (let i = 0; i < this.vinhos.length; i++){
			if (this.vinhos[i].categoria != "" && first == 0){
				categorias.push(this.vinhos[i].categoria);
				first++;
			}
		}

		for (let i = 1; i < this.vinhos.length; i++){
			var count: number = 0;
			if (this.vinhos[i].categoria != ""){
				for (let j = 0; j < categorias.length; j++){
					if (this.vinhos[i].categoria == categorias[j])
						count++;
				}
				if (count == 0)
					categorias.push(this.vinhos[i].categoria);
			}
		}

		return categorias;
	}

	// Limpar Form
	public clearForm(){
		this.FiltroForm.controls['marca'].setValue('');
		this.FiltroForm.controls['ano'].setValue('');
		this.FiltroForm.controls['capacidade'].setValue('');
		this.FiltroForm.controls['tipoVinho'].setValue('');
		this.FiltroForm.controls['categoria'].setValue('');
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

	// Interligação entre duas listas: Garrafa e Registo Garrafa
	public iniListatTableGarrafaRegistos(garrafas: Garrafa[], registos: RegistoGarrafa[]): tableGarrafaRegisto[]{
		var table: tableGarrafaRegisto[] = [];

		for (let i = 0; i < garrafas.length; i++){
			for (let j = 0; j < registos.length; j++){
				if (garrafas[i].id == registos[j].idGarrafa){
					var tableObj: tableGarrafaRegisto = {
						id: registos[j].id,
						idGarrafa: garrafas[i].id,
						cuba: garrafas[i].cuba,
						ano: garrafas[i].ano,
						tipoVinho: garrafas[i].tipoVinho,
						capacidade: garrafas[i].capacidade,
						data: registos[j].data,
						comentario: registos[j].comentario,
						cRotulo: registos[j].cRotulo,
						sRotulo: registos[j].sRotulo
					}
					table.push(tableObj);
				}
			}
		}
		
		return table;
	}	

	// Interligação entre duas listas: Tabela Registo Caixa e vinhos
	public iniListatTableRegistos(tabelaRegistos: tableGarrafaRegisto[], vinhos: TipoVinho[]): tableRegisto[]{
		var table: tableRegisto[] = [];

		for (let i = 0; i < tabelaRegistos.length; i++){
			for (let j = 0; j < vinhos.length; j++){
				if (tabelaRegistos[i].tipoVinho == vinhos[j].id){
					var tableObj: tableRegisto = {
						id: tabelaRegistos[i].id,
						idGarrafa: tabelaRegistos[i].idGarrafa,
						lote: "LT-" + this.getIniciaisMarca(vinhos[j].id) + "-" + tabelaRegistos[i].ano + "-" + tabelaRegistos[i].cuba,
						ano: tabelaRegistos[i].ano,
						marca: vinhos[j].marca,
						tipo: vinhos[j].tipo,
						categoria: vinhos[j].categoria,
						capacidade: tabelaRegistos[i].capacidade,
						data: tabelaRegistos[i].data,
						comentario: tabelaRegistos[i].comentario,
						cRotulo: tabelaRegistos[i].cRotulo,
						sRotulo: tabelaRegistos[i].sRotulo
					}
					table.push(tableObj);
				}
			}
		}

		
		// Ordenar as lista por data
		table.sort(
			function(obj1, obj2){
				return obj2.data.getTime() - obj1.data.getTime();
			}
		);
		
		return table;
	}

}

// Interface que interliga 2 tabelas = Garrafa + Registo de Garrafa 
interface tableGarrafaRegisto{
	id: number,
	idGarrafa: number,	
	cuba: number,
	ano: number,
	tipoVinho: number,
	capacidade: number,
	data: Date,
	comentario: string,
	cRotulo: number,
	sRotulo: number
}

// Interface que interliga 2 tabelas = tableRegisto + Vinho 
interface tableRegisto{
	id: number,
	idGarrafa: number,
	lote: string, // Atributo que junta, para mostrar, marca, ano e cuba
	ano: number,
	marca: string, // Atributo marca da tabela Tipo de vinho
	tipo: string, // Atributo tipo da tabela Tipo de Vinho
	categoria: string; // Atributo categoria da tabela Tipo de Vinho
	capacidade: number,
	data: Date,
	comentario: string,
	cRotulo: number,
	sRotulo: number
}