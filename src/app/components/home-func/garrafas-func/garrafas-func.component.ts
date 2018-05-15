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
	capacidades: number[] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500];
	estadoTabela: boolean = true;

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
			'ano': ['', ],
			'capacidade': ['', ],
			'tipoVinho': ['', ]
		});
	}

	ngOnInit() {
		this.iniListaGarrafas();
		this.iniListaRegistos();
		this.tabelaGarrafaRegistos = this.iniListatTableGarrafaRegistos(this.garrafas, this.registos);
		
		this.iniListaVinhos();
		this.tabelaRegistos = this.iniListatTableRegistos(this.tabelaGarrafaRegistos, this.vinhos);

		this.iniFiltroAno();
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

	// Filtros 
	onChange(){
		var filtro: any = this.FiltroForm.value;
		this.tabelaRegistos = this.iniListatTableRegistos(this.tabelaGarrafaRegistos, this.vinhos);

		if (filtro.ano != "" || filtro.capacidade != "" || filtro.tipoVinho != ""){
			if (filtro.ano != "" && filtro.capacidade != "" && filtro.tipoVinho != ""){
				this.tabelaRegistos = this.filtrarAno(filtro);
				this.tabelaRegistos = this.filtrarCapacidade(filtro);
				this.tabelaRegistos = this.filtrarTipoVinho(filtro);
			}
			else{
				if (filtro.ano != "" && filtro.capacidade != ""){
					this.tabelaRegistos = this.filtrarAno(filtro);
					this.tabelaRegistos = this.filtrarCapacidade(filtro);				
				}
				else{
					if (filtro.capacidade != "" && filtro.tipoVinho != ""){
						this.tabelaRegistos = this.filtrarCapacidade(filtro);
						this.tabelaRegistos = this.filtrarTipoVinho(filtro);
					}
					else{
						if (filtro.ano != "" && filtro.tipoVinho != ""){
							this.tabelaRegistos = this.filtrarAno(filtro);
							this.tabelaRegistos = this.filtrarTipoVinho(filtro);
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
									this.tabelaRegistos = this.filtrarTipoVinho(filtro);
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
			if (this.tabelaRegistos[i].tipoVinho == filtro.tipoVinho){
				tabelaTipoVinho.push(this.tabelaRegistos[i]);
			}
		}
		return tabelaTipoVinho;
	}

	// Ordenar por Ano
	public ordemAno(): tableRegisto[]{
		var tabela: tableRegisto[] = this.tabelaRegistos;
		tabela.sort(
			function(obj1, obj2){
				return obj1.ano - obj2.ano;
			}
		);
		return tabela;
	} 

	// Ordenar por Capacidade
	public ordemCapacidade(): tableRegisto[]{
		var tabela: tableRegisto[] = this.tabelaRegistos;
		tabela.sort(
			function(obj1, obj2){
				return obj1.capacidade - obj2.capacidade;
			}
		);
		return tabela;
	}

	// Ordenar por Tipo de Vinho
	public ordemTipoVinho(): tableRegisto[]{
		var tabela: tableRegisto[] = this.tabelaRegistos;
		tabela.sort(
			function(obj1, obj2){
				if (obj1.tipoVinho < obj2.tipoVinho){
					return -1;
				}
				if (obj1.tipoVinho > obj2.tipoVinho){
					return 1;
				}
				return 0;
			}
		);
		return tabela;
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

	// Dados criados (A ser subsituido pela ligação à BD)
   public iniListaGarrafas(){
		this.garrafas = [{
			id: 1,
			lote: 3599,
			ano: 2004,
			tipoVinho: 1,
			capacidade: 1.000,
			cRotulo: 250,
			sRotulo: 100
		},
		{
			id: 2,
			lote: 3999,
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
      	sRotulo: null 
		}];
	}
	
	// Dados criados (A ser subsituido pela ligação à BD)
	public iniListaVinhos(){
		this.vinhos = [{
			id: 1,
			tipo: 'Verde'
		},
		{
			id: 2,
			tipo: 'Rosé'
		},
		{
			id: 3,
			tipo: 'Tinto'
		},
		{
			id: 4,
			tipo: 'Branco'
		},
		{
			id: 5,
			tipo: 'Espumante'
		},
		{
			id: 6,
			tipo: 'Quinta'
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
						lote: garrafas[i].lote,
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
						lote: tabelaRegistos[i].lote,
						ano: tabelaRegistos[i].ano,
						tipoVinho: vinhos[j].tipo,
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
	lote: number,
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
	lote: number,
	ano: number,
	tipoVinho: string,
	capacidade: number,
	data: Date,
	comentario: string,
	cRotulo: number,
	sRotulo: number
}