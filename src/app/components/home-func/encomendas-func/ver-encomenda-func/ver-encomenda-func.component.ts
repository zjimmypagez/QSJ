import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Encomenda } from '../../../../interfaces/encomenda';
import { TipoCaixa } from '../../../../interfaces/tipoCaixa';
import { ECaixa } from '../../../../interfaces/encomendaCaixa';
import { Caixa } from '../../../../interfaces/caixa';
import { Garrafa } from '../../../../interfaces/garrafa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

import { JoinTablesService } from '../../../../services/funcoes-service/join-tables.service';

@Component({
	selector: 'app-ver-encomenda-func',
	templateUrl: './ver-encomenda-func.component.html',
	styleUrls: ['./ver-encomenda-func.component.css']
})
export class VerEncomendaFuncComponent implements OnInit {
	// Encomenda selecionada
	id: number;
	private sub: any;
	// Encomenda selecionada
	encomenda: Encomenda;
	// Caixas Encomendadas
	caixasEncomendada: TipoCaixa[];
	// Lista de caixas a ler da BD
  	caixas: Caixa[];
	// Lista de garrafas a ler da BD
  	garrafas: Garrafa[];
	// Lista de garrafas a ler da BD
	vinhos: TipoVinho[];
	// Lista de encomendas a ler da BD
  	encomendas: Encomenda[];
	// Lista de caixas encomendadas a ler da BD
	caixasEncomendadas: TipoCaixa[];
	// Lista de modelos de caixa encomendadas a ler da BD
	tipoCaixasEncomendadas: ECaixa[];
	// Tabela interligada entre tipo caixa e ecaixa
	tableTECaixa: tableTECaixa[];
	// Tabela interligada entre teCaixas e caixa
	tableTECaixaCaixas: tableTECaixaCaixas[];
	// Tabela interligada entre teCaixasCaixas e garrafa
	tableTECaixaCaixasGarrafas: tableTECaixaCaixasGarrafas[];
	// Tabela interligada entre teCaixasCaixasGarrafas e tipo de vinho
	tableTECaixaCaixasGarrafasTVinho: tableTECaixaCaixasGarrafasTVinho[];
	// Tabela interligada entre teCaixasCaixasGarrafasTVinho e tipo de vinho
	tableRegisto: tableRegisto[];
	// Tabela com as caixas Normais
	tableRegistoNormal: tableRegisto[] = [];
	// Tabela com as caixas Especiais
	tableRegistoEspeciais: tableRegisto[] = [];

	constructor( private route: ActivatedRoute, private router: Router, private joinTableService: JoinTablesService ) { }

	ngOnInit() {
		// Subscrição dos parametros do modelo da caixa escolhido para editar
		this.sub = this.route.params.subscribe(
			params => { this.id = +params['id']; }
		)
		this.iniListaEncomendas();
		this.encomenda = this.encomendas.find(x => x.id == this.id);
		this.iniListaTipoCaixas();
		this.caixasEncomendada = this.caixasEncomendadas.filter(x => x.idEncomenda == this.id);
		this.iniListaECaixas();
		this.tableTECaixa = this.joinTableService.iniListaTableTECaixa(this.caixasEncomendada, this.tipoCaixasEncomendadas);
		this.iniListaCaixas();
		this.tableTECaixaCaixas = this.joinTableService.iniListaTableTECaixaCaixas(this.tableTECaixa, this.caixas);
		this.iniListaGarrafas();
		this.tableTECaixaCaixasGarrafas = this.joinTableService.iniListaTableTECaixaCaixasGarrafas(this.tableTECaixaCaixas, this.garrafas);
		this.iniListaVinhos();
		this.tableTECaixaCaixasGarrafasTVinho = this.joinTableService.iniListaTableTECaixaCaixasGarrafasTVinho(this.tableTECaixaCaixasGarrafas, this.vinhos);
		this.tableRegisto = this.joinTableService.iniListaTableTECaixaCaixasGarrafasTVinho2(this.tableTECaixaCaixasGarrafasTVinho, this.vinhos);
		this.filtraCaixas();
	}

	// Entregar Encomenda
	entregarEncomenda(){
		// update de datas - check da existencia do numero de fatura
	}

	// Eliminar Encomenda
	eliminarEncomenda(){

	}

	// Função que separa as caixas encomendadas por normais ou especiais
	filtraCaixas(){
		for (let i = 0; i < this.tableRegisto.length; i++){
			var count: number = 0;
			for (let j = i; j < this.tableRegisto.length; j++){
				if (this.tableRegisto[i].id == this.tableRegisto[j].id)
					count++;
			}
			if (count > 1){
				var tableAux: tableRegisto[] = [];
				tableAux = this.tableRegisto.filter(x => x.id == this.tableRegisto[i].id);
				for (let i = 0; i < tableAux.length; i++){
					this.tableRegistoEspeciais.push(tableAux[i]);
				}
				this.tableRegisto = this.tableRegisto.filter(x => x.id != this.tableRegisto[i].id);
			}
			else{
				this.tableRegistoNormal.push(this.tableRegisto[i]);
				this.tableRegisto = this.tableRegisto.filter(x => x.id != this.tableRegisto[i].id);				
			}
			i = -1;
		}
	}

	// Dados criados (A ser subsituido pela ligação à BD)
	iniListaEncomendas(){
		this.encomendas = [{
			id: 1,
			idUser: 2,
			data: new Date(2017, 4, 2),
			dataFinal: null,
			nFatura: 11568920,
			comentario: 'Restaurante XPTO',
			estado: false // false - Em espera; true - Finalizado
		 },
		 {
			id: 2,
			idUser: 1,
			data: new Date(2012, 3, 25),
			dataFinal: new Date(2012, 4, 25),
			nFatura: 25134859,
			comentario: '',
			estado: true
		 }];
	}

	// Dados criados (A ser subsituido pela ligação à BD)
	iniListaTipoCaixas(){
		this.caixasEncomendadas = [{
			id: 1,
			idEncomenda: 2,
			quantidade: 25
		},
		{
			id: 2,
			idEncomenda: 1,
			quantidade: 20
		},
		{
			id: 3,
			idEncomenda: 2,
			quantidade: 10
		},
		{
			id: 4,
			idEncomenda: 1,
			quantidade: 28
		}];
	}

	// Dados criados (A ser subsituido pela ligação à BD)
	iniListaECaixas(){
		this.tipoCaixasEncomendadas = [{
			idCaixa: 2,
			idGarrafa: 2,
			idTCaixa: 2,
			quantidade: 12
		},
		{
			idCaixa: 1,
			idGarrafa: 1,
			idTCaixa: 4,
			quantidade: 2
		},
		{
			idCaixa: 1,
			idGarrafa: 3,
			idTCaixa: 4,
			quantidade: 1
		},
		{
			idCaixa: 1,
			idGarrafa: 1,
			idTCaixa: 1,
			quantidade: 2
		},
		{
			idCaixa: 1,
			idGarrafa: 3,
			idTCaixa: 3,
			quantidade: 1
		}]
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
		},
		{
			id: 3,
			cuba: 10000,
			ano: 2015,
			tipoVinho: 2,
			capacidade: 1.000,
			cRotulo: 1500,
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

// Join entre tabela do tipo caixa com a Ecaixa
interface tableTECaixa{
	id: number,
	idEncomenda: number,
	idCaixa: number,
	idGarrafa: number,
	quantidade: number,
	quantidadeCaixa: number
}

// Join entre tabela do tableTECaixa com a Caixa
interface tableTECaixaCaixas{
	id: number,
	idEncomenda: number,
	capacidadeCaixa: number,
   garrafas: number,
   material: string,
	tipoVinho: number,
	idGarrafa: number,
	quantidade: number,
	quantidadeCaixa: number
}

// Join entre tabela do tableTECaixaCaixas com a Garrafa
interface tableTECaixaCaixasGarrafas{
	id: number,
	idEncomenda: number,
	capacidadeCaixa: number,
   garrafas: number,
   material: string,
	tipoVinhoCaixa: number,
	cuba: number,
	ano: number,
	capacidadeGarrafa: number,
	tipoVinhoGarrafa: number,
	quantidade: number,
	quantidadeCaixa: number
}

// Join entre tabela do tableTECaixaCaixasGarrafas com o tipo de vinho
interface tableTECaixaCaixasGarrafasTVinho{
	id: number,
	idEncomenda: number,
	capacidadeCaixa: number,
   garrafas: number,
	material: string,
	marcaCaixa: string,
	tipoCaixa: string,
	categoriaCaixa: string,
	cuba: number,
	ano: number,
	capacidadeGarrafa: number,
	tipoVinhoGarrafa: number,
	quantidade: number,
	quantidadeCaixa: number
}

// Join entre tabela do tableTECaixaCaixasGarrafasTVinho com o tipo de vinho
interface tableRegisto{
	id: number,
	idEncomenda: number,
	capacidadeCaixa: number,
   garrafas: number,
	material: string,
	marcaCaixa: string,
	tipoCaixa: string,
	categoriaCaixa: string,
	cuba: number,
	ano: number,
	capacidadeGarrafa: number,
	marcaGarrafa: string,
	tipoGarrafa: string,
	categoriaGarrafa: string,
	quantidade: number,
	quantidadeCaixa: number
}