import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { Garrafa } from '../../../interfaces/garrafa';
import { TipoVinho } from '../../../interfaces/tipoVinho';

@Component({
	selector: 'app-garrafas-admin',
	templateUrl: './garrafas-admin.component.html',
	styleUrls: ['./garrafas-admin.component.css']
})
export class GarrafasAdminComponent implements OnInit {
	// Dados filtros
	FiltroForm: FormGroup;
	anos: number[] = [];
	categorias: string[] = [];
	capacidades: number[] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500, 3.000, 6.000, 12.000];
	estadoTabela: boolean = true;

	tipoVinhos: string[] = ["Verde", "Rosé", "Tinto", "Branco", "Espumante", "Quinta"];

  	// Lista de modelos de garrafa a ler da BD
	garrafas: Garrafa[];
	// Lista de modelos de caixa a ler da BD
	vinhos: TipoVinho[];
	// Tabela interligada entre garrafas e vinhos
	tabelaGarrafas: tableGarrafa[];

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
		this.iniListaVinhos();
		this.tabelaGarrafas = this.iniListatTableGarrafas(this.garrafas, this.vinhos);

		this.iniFiltroAno();
		this.categorias = this.iniFiltroCategoria();
	}

	// Função responsável por selecionar o modelo de garrafa a ser editado
   editarGarrafa(id: number){
		this.router.navigate(['/admin/garrafas/editar', id]);
	}
	
	// Função responsável por eliminar o modelo de garrafa selecionado
	eliminarGarrafa(id: number){
		// Variavel que verifica se um modelo de garrafa pode ser eliminado (false) ou não (true)
		var estadoGarrafa: boolean = true;

		for (let i = 0; i < this.garrafas.length; i++){
			if (id == this.garrafas[i].id){
				var quantidade: number = this.garrafas[i].cRotulo + this.garrafas[i].sRotulo;
				if (quantidade > 0){
					estadoGarrafa = false;
				}
			}
		}

		if (estadoGarrafa){
			if (confirm("Quer mesmo eliminar este modelo?")){
				alert("O modelo de garrafa foi eliminado com sucesso!");
				this.router.navigate(['/admin/garrafas']);
			}
		}
		else
			alert("O modelo de garrafa que pretende eliminar existe, em stock, no armazém.")
	}

	// Pesquisa a um determinada marca
	pesquisaMarca(form){
		var frm = form;
		
		if (frm.marca != ""){
			var tabelaMarca: tableGarrafa[] = [];
			for (let i = 0; i < this.tabelaGarrafas.length; i++){
				if (frm.marca.toUpperCase() === this.tabelaGarrafas[i].marca.toUpperCase()){
					tabelaMarca.push(this.tabelaGarrafas[i]);
				}
			}
			if (tabelaMarca.length == 0){
				this.estadoTabela = false;
			}
			else{
				this.estadoTabela = true;
				this.tabelaGarrafas = tabelaMarca;
			}
		}
		else{
			this.estadoTabela = true;
			this.tabelaGarrafas = this.iniListatTableGarrafas(this.garrafas, this.vinhos);
			this.clearForm();				
			alert("Pesquisa inválida!");
		}
	}

	// Filtros 
	onChange(){
		var filtro: any = this.FiltroForm.value;
		this.tabelaGarrafas = this.iniListatTableGarrafas(this.garrafas, this.vinhos);
		this.FiltroForm.controls['marca'].setValue('');

		if (filtro.ano != "" || filtro.capacidade != "" || filtro.tipoVinho != "" || filtro.categoria != ""){
			if (filtro.ano != "" && filtro.capacidade != "" && filtro.tipoVinho != "" && filtro.categoria != ""){
				this.tabelaGarrafas = this.filtrarAno(filtro);
				this.tabelaGarrafas = this.filtrarCapacidade(filtro);
				this.tabelaGarrafas = this.filtrarTipoVinho(filtro);
				this.tabelaGarrafas = this.filtrarCategoriaVinho(filtro);
			}
			else{
				if (filtro.ano != "" && filtro.capacidade != "" && filtro.tipoVinho != ""){
					this.tabelaGarrafas = this.filtrarAno(filtro);
					this.tabelaGarrafas = this.filtrarCapacidade(filtro);	
					this.tabelaGarrafas = this.filtrarTipoVinho(filtro);	
				}
				else{
					if (filtro.ano != "" && filtro.capacidade != "" && filtro.categoria != ""){
						this.tabelaGarrafas = this.filtrarAno(filtro);
						this.tabelaGarrafas = this.filtrarCapacidade(filtro);
						this.tabelaGarrafas = this.filtrarCategoriaVinho(filtro);
					}
					else{
						if (filtro.ano != "" && filtro.tipoVinho != "" && filtro.categoria != ""){
							this.tabelaGarrafas = this.filtrarAno(filtro);
							this.tabelaGarrafas = this.filtrarTipoVinho(filtro);
							this.tabelaGarrafas = this.filtrarCategoriaVinho(filtro);
						}
						else{
							if (filtro.capacidade != "" && filtro.tipoVinho != "" && filtro.categoria != ""){
								this.tabelaGarrafas = this.filtrarCapacidade(filtro);
								this.tabelaGarrafas = this.filtrarTipoVinho(filtro);
								this.tabelaGarrafas = this.filtrarCategoriaVinho(filtro);
							}
							else{
								if (filtro.ano != "" && filtro.capacidade != ""){
									this.tabelaGarrafas = this.filtrarAno(filtro);
									this.tabelaGarrafas = this.filtrarCapacidade(filtro);
								}
								else{
									if (filtro.ano != "" && filtro.tipoVinho != ""){
										this.tabelaGarrafas = this.filtrarAno(filtro);
										this.tabelaGarrafas = this.filtrarTipoVinho(filtro);
									}
									else{
										if (filtro.ano != "" && filtro.categoria != ""){
											this.tabelaGarrafas = this.filtrarAno(filtro);
											this.tabelaGarrafas = this.filtrarCategoriaVinho(filtro);
										}
										else{
											if (filtro.capacidade != "" && filtro.tipoVinho != ""){
												this.tabelaGarrafas = this.filtrarCapacidade(filtro);
												this.tabelaGarrafas = this.filtrarTipoVinho(filtro);
											}
											else{
												if (filtro.capacidade != "" && filtro.categoria != ""){
													this.tabelaGarrafas = this.filtrarCapacidade(filtro);
													this.tabelaGarrafas = this.filtrarCategoriaVinho(filtro);
												}
												else{
													if (filtro.tipoVinho != "" && filtro.categoria != ""){
														this.tabelaGarrafas = this.filtrarTipoVinho(filtro);
														this.tabelaGarrafas = this.filtrarCategoriaVinho(filtro);
													}
													else{
														if (filtro.ano != ""){
															this.tabelaGarrafas = this.filtrarAno(filtro);
														}
														else{
															if (filtro.capacidade != ""){
																this.tabelaGarrafas = this.filtrarCapacidade(filtro);
															}
															else{
																if (filtro.tipoVinho != ""){
																	this.tabelaGarrafas = this.filtrarTipoVinho(filtro);
																}
																else{
																	this.tabelaGarrafas = this.filtrarCategoriaVinho(filtro);
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
			if (this.tabelaGarrafas.length == 0){
				this.estadoTabela = false;
			}
			else{
				this.estadoTabela = true;
			}
		}
		else{
			this.tabelaGarrafas = this.iniListatTableGarrafas(this.garrafas, this.vinhos);
			this.estadoTabela = true;
		}
	}

	// Função que filtra ano
	public filtrarAno(filtro: any): tableGarrafa[]{
		var tabelaAno: tableGarrafa[] = [];
		for (let i = 0; i < this.tabelaGarrafas.length; i++){
			if (this.tabelaGarrafas[i].ano == filtro.ano){
				tabelaAno.push(this.tabelaGarrafas[i]);
			}
		}
		return tabelaAno;
	}

	// Função que filtra capacidade
	public filtrarCapacidade(filtro: any): tableGarrafa[]{
		var tabelaCapacidade: tableGarrafa[] = [];
		for (let i = 0; i < this.tabelaGarrafas.length; i++){
			if (this.tabelaGarrafas[i].capacidade == filtro.capacidade){
				tabelaCapacidade.push(this.tabelaGarrafas[i]);
			}
		}
		return tabelaCapacidade;
	}

	// Função que filtra tipo de vinho
	public filtrarTipoVinho(filtro: any): tableGarrafa[]{
		var tabelaTipoVinho: tableGarrafa[] = [];
		for (let i = 0; i < this.tabelaGarrafas.length; i++){
			if (this.tabelaGarrafas[i].tipo == filtro.tipoVinho){
				tabelaTipoVinho.push(this.tabelaGarrafas[i]);
			}
		}
		return tabelaTipoVinho;
	}

	// Função que filtra categoria do vinho
	public filtrarCategoriaVinho(filtro: any): tableGarrafa[]{
		var tabelaCategoriaVinho: tableGarrafa[] = [];
		if (filtro.categoria != "Normal"){
			for (let i = 0; i < this.tabelaGarrafas.length; i++){
				if (this.tabelaGarrafas[i].categoria == filtro.categoria){
					tabelaCategoriaVinho.push(this.tabelaGarrafas[i]);
				}
			}
		}
		else{
			for (let i = 0; i < this.tabelaGarrafas.length; i++){
				if (this.tabelaGarrafas[i].categoria == ""){
					tabelaCategoriaVinho.push(this.tabelaGarrafas[i]);
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