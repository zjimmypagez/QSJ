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
	capacidades: number[] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500];
	estadoTabela: boolean = true;

  	// Lista de modelos de garrafa a ler da BD
	garrafas: Garrafa[];
	// Lista de modelos de caixa a ler da BD
	vinhos: TipoVinho[];
	// Tabela interligada entre garrafas e vinhos
	tabelaGarrafas: tableGarrafa[];

  	constructor( private router: Router, private fb: FormBuilder ) { 
		this.FiltroForm = fb.group({
			'ano': ['', ],
			'capacidade': ['', ],
			'tipoVinho': ['', ]
		});
	  }

	ngOnInit() {
		this.iniListaGarrafas();
		this.iniListaVinhos();
		this.tabelaGarrafas = this.iniListatTableGarrafas(this.garrafas, this.vinhos);

		this.iniFiltroAno();
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
				if (this.garrafas[i].quantidade > 0){
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

	// Filtros 
	onChange(){
		var filtro: any = this.FiltroForm.value;
		this.tabelaGarrafas = this.iniListatTableGarrafas(this.garrafas, this.vinhos);

		if (filtro.ano != "" || filtro.capacidade != "" || filtro.tipoVinho != ""){
			if (filtro.ano != "" && filtro.capacidade != "" && filtro.tipoVinho != ""){
				this.tabelaGarrafas = this.filtrarAno(filtro);
				this.tabelaGarrafas = this.filtrarCapacidade(filtro);
				this.tabelaGarrafas = this.filtrarTipoVinho(filtro);
			}
			else{
				if (filtro.ano != "" && filtro.capacidade != ""){
					this.tabelaGarrafas = this.filtrarAno(filtro);
					this.tabelaGarrafas = this.filtrarCapacidade(filtro);				
				}
				else{
					if (filtro.capacidade != "" && filtro.tipoVinho != ""){
						this.tabelaGarrafas = this.filtrarCapacidade(filtro);
						this.tabelaGarrafas = this.filtrarTipoVinho(filtro);
					}
					else{
						if (filtro.ano != "" && filtro.tipoVinho != ""){
							this.tabelaGarrafas = this.filtrarAno(filtro);
							this.tabelaGarrafas = this.filtrarTipoVinho(filtro);
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
									this.tabelaGarrafas = this.filtrarTipoVinho(filtro);
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
			if (this.tabelaGarrafas[i].tipoVinho == filtro.tipoVinho){
				tabelaTipoVinho.push(this.tabelaGarrafas[i]);
			}
		}
		return tabelaTipoVinho;
	}

	// Ordenar por Ano
	public ordemAno(): tableGarrafa[]{
		var tabela: tableGarrafa[] = this.tabelaGarrafas;
		tabela.sort(
			function(obj1, obj2){
				return obj1.ano - obj2.ano;
			}
		);
		return tabela;
	} 

	// Ordenar por Capacidade
	public ordemCapacidade(): tableGarrafa[]{
		var tabela: tableGarrafa[] = this.tabelaGarrafas;
		tabela.sort(
			function(obj1, obj2){
				return obj1.capacidade - obj2.capacidade;
			}
		);
		return tabela;
	}

	// Ordenar por Tipo de Vinho
	public ordemTipoVinho(): tableGarrafa[]{
		var tabela: tableGarrafa[] = this.tabelaGarrafas;
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
			quantidade: 250
		},
		{
			id: 2,
			lote: 3999,
			ano: 2015,
			tipoVinho: 3,
			capacidade: 0.750,
			quantidade: 100
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

	// Interligação entre duas listas: Garrafa e Tipo de Vinho
	public iniListatTableGarrafas(garrafas: Garrafa[], vinhos: TipoVinho[]): tableGarrafa[]{
		var table: tableGarrafa[] = [];

		for (let i = 0; i < garrafas.length; i++){
			for (let j = 0; j < vinhos.length; j++){
				if (garrafas[i].tipoVinho == vinhos[j].id){
					var tableObj: tableGarrafa = {
						id: garrafas[i].id,
						lote: garrafas[i].lote,
						ano: garrafas[i].ano,
						tipoVinho: vinhos[j].tipo, 
						capacidade: garrafas[i].capacidade,
						quantidade: garrafas[i].quantidade
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
   lote: number,
   ano: number,
	tipoVinho: string, // Atributo tipo da tabela Tipo de Vinho
   capacidade: number,
	quantidade: number
}