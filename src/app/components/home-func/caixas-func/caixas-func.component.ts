import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { Caixa } from '../../../interfaces/caixa';
import { RegistoCaixa } from '../../../interfaces/registoCaixa';
import { TipoVinho } from '../../../interfaces/tipoVinho';

@Component({
	selector: 'app-caixas-func',
	templateUrl: './caixas-func.component.html',
	styleUrls: ['./caixas-func.component.css']
})
export class CaixasFuncComponent implements OnInit {
	// Dados filtros
	FiltroForm: FormGroup;
	materiais: string[] = ["Cartão", "Madeira"];
	capacidades: number[] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500];
	estadoTabela: boolean = true;

	// Lista de modelos de caixa a ler da BD
	caixas: Caixa[];
	// Lista de modelos de vinho a ler da BD
	vinhos: TipoVinho[];
	// Lista de registo de caixas a ler da BD
	registos: RegistoCaixa[];
	// Tabela interligada entre caixa e registo caixas
	tabelaCaixaRegistos: tableCaixaRegisto[];
	// Tabela interligada entre tabelaregisto caixas e vinhos
	tabelaRegistos: tableRegisto[];

	constructor( private router: Router, private fb: FormBuilder ) { 
		this.FiltroForm = fb.group({
			'material': ['', ],
			'capacidade': ['', ],
			'tipoVinho': ['', ]
		});
	}

	ngOnInit() {
		this.iniListaCaixas();
		this.iniListaRegistos();
		this.tabelaCaixaRegistos = this.iniListatTableCaixaRegistos(this.caixas, this.registos);
		
		this.iniListaVinhos();
		this.tabelaRegistos = this.iniListatTableRegistos(this.tabelaCaixaRegistos, this.vinhos);	
	}

	// Função responsável por selecionar o registo de caixa a ser editado
   editarRegisto(id: number){
		this.router.navigate(['/func/caixas/editar', id]);
	}
	
	// Função responsável por eliminar o registo de caixa selecionado
	eliminarRegisto(id: number){
		var estadoRegisto = prompt("Insira as credenciais necessárias para eliminar o registo:");;

		if (estadoRegisto == "password"){
			if (confirm("Quer mesmo eliminar este registo?")){
				alert("O registo de caixa foi eliminado com sucesso!");
				this.router.navigate(['/func/caixas']);
			}
		}
	}

	// Filtros 
	onChange(){
		var filtro: any = this.FiltroForm.value;
		this.tabelaRegistos = this.iniListatTableRegistos(this.tabelaCaixaRegistos, this.vinhos);

		if (filtro.material != "" || filtro.capacidade != "" || filtro.tipoVinho != ""){
			if (filtro.material != "" && filtro.capacidade != "" && filtro.tipoVinho != ""){
				this.tabelaRegistos = this.filtrarMaterial(filtro);
				this.tabelaRegistos = this.filtrarCapacidade(filtro);
				this.tabelaRegistos = this.filtrarTipoVinho(filtro);
			}
			else{
				if (filtro.material != "" && filtro.capacidade != ""){
					this.tabelaRegistos = this.filtrarMaterial(filtro);
					this.tabelaRegistos = this.filtrarCapacidade(filtro);				
				}
				else{
					if (filtro.capacidade != "" && filtro.tipoVinho != ""){
						this.tabelaRegistos = this.filtrarCapacidade(filtro);
						this.tabelaRegistos = this.filtrarTipoVinho(filtro);
					}
					else{
						if (filtro.material != "" && filtro.tipoVinho != ""){
							this.tabelaRegistos = this.filtrarMaterial(filtro);
							this.tabelaRegistos = this.filtrarTipoVinho(filtro);
						}
						else{
							if (filtro.material != ""){
								this.tabelaRegistos = this.filtrarMaterial(filtro);
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
			this.tabelaRegistos = this.iniListatTableRegistos(this.tabelaCaixaRegistos, this.vinhos);
			this.estadoTabela = true;
		}
	}

	// Função que filtra ano
	public filtrarMaterial(filtro: any): tableRegisto[]{
		var tabelaAno: tableRegisto[] = [];
		for (let i = 0; i < this.tabelaRegistos.length; i++){
			if (this.tabelaRegistos[i].material == filtro.material){
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
	
	// Ordenar por Material
	public ordemMaterial(): tableRegisto[]{
		var tabela: tableRegisto[] = this.tabelaRegistos;
		tabela.sort(
			function(obj1, obj2){
				if (obj1.material < obj2.material){
					return -1;
				}
				if (obj1.material > obj2.material){
					return 1;
				}
				return 0;
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

	// Dados criados (A ser subsituido pela ligação à BD)
   public iniListaCaixas(){
   	this.caixas = [{
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
			tipoVinho: 6,
			quantidade: 50
      }];
	}

	// Dados criados (A ser subsituido pela ligação à BD)
	public iniListaRegistos(){
		this.registos = [{
			id: 1,
			idCaixa: 2,
			data: new Date(2005,12,17),
			comentario: "2 c/ defeito",
			quantidade: 23      
		},
		{
			id: 2,
			idCaixa: 1,
			data: new Date(2012,6,2),
			comentario: "",
			quantidade: 12 
		},
		{
			id: 3,
			idCaixa: 1,
			data: new Date(2013,4,26),
			comentario: "12 c/ defeito",
			quantidade: 120 
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
	
	// Interligação entre duas listas: Caixa e Registo Caixa
	public iniListatTableCaixaRegistos(caixas: Caixa[], registos: RegistoCaixa[]): tableCaixaRegisto[]{
		var table: tableCaixaRegisto[] = [];

		for (let i = 0; i < caixas.length; i++){
			for (let j = 0; j < registos.length; j++){
				if (caixas[i].id == registos[j].idCaixa){
					var tableObj: tableCaixaRegisto = {
						id: registos[j].id,
						idCaixa: caixas[i].id,
						capacidade: caixas[i].capacidade,
						garrafas: caixas[i].garrafas,
						material: caixas[i].material,
						tipoVinho: caixas[i].tipoVinho,
						data: registos[j].data,
						comentario: registos[j].comentario,
						quantidade: registos[j].quantidade 
					}
					table.push(tableObj);
				}
			}
		}
		
		return table;
	}	

	// Interligação entre duas listas: Tabela Registo Caixa e vinhos
	public iniListatTableRegistos(tabelaRegistos: tableCaixaRegisto[], vinhos: TipoVinho[]): tableRegisto[]{
		var table: tableRegisto[] = [];

		for (let i = 0; i < tabelaRegistos.length; i++){
			for (let j = 0; j < vinhos.length; j++){
				if (tabelaRegistos[i].tipoVinho == vinhos[j].id){
					var tableObj: tableRegisto = {
						id: tabelaRegistos[i].id,
						idCaixa: tabelaRegistos[i].idCaixa,
						capacidade: tabelaRegistos[i].capacidade,
						garrafas: tabelaRegistos[i].garrafas,
						material: tabelaRegistos[i].material,
						tipoVinho: vinhos[j].tipo,
						data: tabelaRegistos[i].data,
						comentario: tabelaRegistos[i].comentario,
						quantidade: tabelaRegistos[i].quantidade 
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

// Interface que interliga 2 tabelas = Caixa + Registo de Caixa 
interface tableCaixaRegisto{
	id: number,
	idCaixa: number,
	capacidade: number,
	garrafas: number,
	material: string,
	tipoVinho: number,
	data: Date,
	comentario: string,
	quantidade: number
}

// Interface que interliga 2 tabelas = tableRegisto + Vinho 
interface tableRegisto{
	id: number,
	idCaixa: number,
	capacidade: number,
	garrafas: number,
	material: string,
	tipoVinho: string,
	data: Date,
	comentario: string,
	quantidade: number
}