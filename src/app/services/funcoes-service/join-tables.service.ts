import { Injectable } from '@angular/core';

import { OrdenarTablesService } from './ordenar-tables.service';

@Injectable()
export class JoinTablesService {
	constructor( private ordenarService: OrdenarTablesService ){

	}

	// Interligação entre duas listas: Caixa e Tipo de Vinho
	iniListaTableCaixas(caixas: any[], vinhos: any[]): any[]{
		var table: any[] = [];
		// Junção entre os objetos das duas tabelas correspondentes
		for (let i = 0; i < caixas.length; i++){
			for (let j = 0; j < vinhos.length; j++){
				if (caixas[i].tipoVinho == vinhos[j].id){
					var tableObj: any = {
						id: caixas[i].id,
						capacidade: caixas[i].capacidade,
						garrafas: caixas[i].garrafas,
						material: caixas[i].material,
						marca: vinhos[j].marca,
						tipo: vinhos[j].tipo,
						categoria: vinhos[j].categoria,
						quantidade: caixas[i].quantidade 
					}
					table.push(tableObj);
				}
			}
		}
		this.ordenarService.ordenarTabelaMV(table);
		return table;
	}

	// Interligação entre duas listas: Garrafa e Tipo de Vinho
	iniListaTableGarrafas(garrafas: any[], vinhos: any[]): any[]{
		var table: any[] = [];
		// Junção entre os objetos das duas tabelas correspondentes
		for (let i = 0; i < garrafas.length; i++){
			for (let j = 0; j < vinhos.length; j++){
				if (garrafas[i].tipoVinho == vinhos[j].id){
					var tableObj: any = {
						id: garrafas[i].id,
						lote: "LT-" + this.getIniciaisMarca(vinhos[j].id, vinhos) + "-" + garrafas[i].ano,
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
		this.ordenarService.ordenarTabelaMV(table);
		return table;
	}

	// Interligação entre duas listas: Caixa e Registo Caixa
	public iniListaTableCaixaRegistos(caixas: any[], registos: any[]): any[]{
		var table: any[] = [];
		for (let i = 0; i < caixas.length; i++){
			for (let j = 0; j < registos.length; j++){
				if (caixas[i].id == registos[j].idCaixa){
					var tableObj: any = {
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
		// Ordenar as lista por data
		table.sort(
			function(obj1, obj2){
				return obj2.data.getTime() - obj1.data.getTime();
			}
		);		
		return table;
	}

	// Interligação entre duas listas: Tabela Registo + Caixa e vinhos
	public iniListaTableRegistosCaixa(tabelaRegistos: any[], vinhos: any[]): any[]{
		var table: any[] = [];
		for (let i = 0; i < tabelaRegistos.length; i++){
			for (let j = 0; j < vinhos.length; j++){
				if (tabelaRegistos[i].tipoVinho == vinhos[j].id){
					var tableObj: any = {
						id: tabelaRegistos[i].id,
						idCaixa: tabelaRegistos[i].idCaixa,
						capacidade: tabelaRegistos[i].capacidade,
						garrafas: tabelaRegistos[i].garrafas,
						material: tabelaRegistos[i].material,
						marca: vinhos[j].marca,
						tipo: vinhos[j].tipo,
						categoria: vinhos[j].categoria,
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

	// Interligação entre duas listas: Garrafa e Registo Garrafa
	public iniListaTableGarrafaRegistos(garrafas: any[], registos: any[]): any[]{
		var table: any[] = [];
		for (let i = 0; i < garrafas.length; i++){
			for (let j = 0; j < registos.length; j++){
				if (garrafas[i].id == registos[j].idGarrafa){
					var tableObj: any = {
						id: registos[j].id,
						idGarrafa: garrafas[i].id,
						cuba: garrafas[i].cuba,
						ano: garrafas[i].ano,
						tipoVinho: garrafas[i].tipoVinho,
						capacidade: garrafas[i].capacidade,
						data: registos[j].data,
						comentario: registos[j].comentario,
						opcao: registos[j].opcao,
						cRotulo: registos[j].cRotulo,
						sRotulo: registos[j].sRotulo
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

	// Interligação entre duas listas: Tabela Registo + Garrafa e vinhos
	public iniListaTableRegistosGarrafa(tabelaRegistos: any[], vinhos: any[]): any[]{
		var table: any[] = [];
		for (let i = 0; i < tabelaRegistos.length; i++){
			for (let j = 0; j < vinhos.length; j++){
				if (tabelaRegistos[i].tipoVinho == vinhos[j].id){
					var tableObj: any = {
						id: tabelaRegistos[i].id,
						idGarrafa: tabelaRegistos[i].idGarrafa,
						lote: "LT-" + this.getIniciaisMarca(vinhos[j].id, vinhos) + "-" + tabelaRegistos[i].ano,
						cuba: tabelaRegistos[i].cuba,
						ano: tabelaRegistos[i].ano,
						marca: vinhos[j].marca,
						tipo: vinhos[j].tipo,
						categoria: vinhos[j].categoria,
						capacidade: tabelaRegistos[i].capacidade,
						data: tabelaRegistos[i].data,
						comentario: tabelaRegistos[i].comentario,
						opcao: tabelaRegistos[i].opcao,
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

	// Interligação entre duas listas: User e Encomenda
	public iniListaTableEncomenda(users: any[], encomendas: any[]): any[]{
		var table: any[] = [];
		for (let i = 0; i < encomendas.length; i++){
			for (let j = 0; j < users.length; j++){
				if (encomendas[i].idUser == users[j].id){
					var tableObj: any = {
						id: encomendas[i].id,
						username: users[j].username,
						data: encomendas[i].data,
						dataFinal: encomendas[i].dataFinal,
						nFatura: encomendas[i].nFatura,
						comentario: encomendas[i].comentario,
						estado: encomendas[i].estado
					}
					table.push(tableObj);
				}
			}
		}
		table.sort(
			function(obj1, obj2){
				return obj2.data.getTime() - obj1.data.getTime();
		})		
		return table;
	}

	// Interligação entre duas listas: TipoCaixa e ECaixa
	public iniListaTableTECaixa(tipoCaixa: any[], ECaixa: any[]): any[]{
		var table: any[] = [];
		for (let i = 0; i < ECaixa.length; i++){
			for (let j = 0; j < tipoCaixa.length; j++){
				if (ECaixa[i].idTCaixa == tipoCaixa[j].id){
					var tableObj: any = {
						id: tipoCaixa[j].id,
						idEncomenda: tipoCaixa[j].idEncomenda,
						idCaixa: ECaixa[i].idCaixa,
						idGarrafa: ECaixa[i].idGarrafa,
						quantidade: ECaixa[i].quantidade,
						quantidadeCaixa: tipoCaixa[j].quantidade
					}
					table.push(tableObj);
				}
			}
		}	
		return table;
	}

	// Interligação entre duas listas: TECaixas e Caixa
	public iniListaTableTECaixaCaixas(teCaixas: any[], caixas: any[]): any[]{
		var table: any[] = [];
		for (let i = 0; i < caixas.length; i++){
			for (let j = 0; j < teCaixas.length; j++){
				if (caixas[i].id == teCaixas[j].idCaixa){
					var tableObj: any = {
						id: teCaixas[j].id,
						idEncomenda: teCaixas[j].idEncomenda,
						capacidadeCaixa: caixas[i].capacidade,
					   	garrafas: caixas[i].garrafas,
					   	material: caixas[i].material,
						tipoVinho: caixas[i].tipoVinho,
						idGarrafa: teCaixas[j].idGarrafa,
						quantidade: teCaixas[j].quantidade,
						quantidadeCaixa: teCaixas[j].quantidadeCaixa
					}
					table.push(tableObj);
				}
			}
		}	
		return table;
	}

	// Interligação entre duas listas: TECaixasCaixas e Garrafa
	public iniListaTableTECaixaCaixasGarrafas(teCaixasCaixas: any[], garrafas: any[]): any[]{
		var table: any[] = [];
		for (let i = 0; i < garrafas.length; i++){
			for (let j = 0; j < teCaixasCaixas.length; j++){
				if (garrafas[i].id == teCaixasCaixas[j].idGarrafa){
					var tableObj: any = {
						id: teCaixasCaixas[j].id,
						idEncomenda: teCaixasCaixas[j].idEncomenda,
						capacidadeCaixa: teCaixasCaixas[j].capacidadeCaixa,
						garrafas: teCaixasCaixas[j].garrafas,
						material: teCaixasCaixas[j].material,
						tipoVinhoCaixa: teCaixasCaixas[j].tipoVinho,
						cuba: garrafas[i].cuba,
						ano: garrafas[i].ano,
						capacidadeGarrafa: garrafas[i].capacidade,
						tipoVinhoGarrafa: garrafas[i].tipoVinho,
						quantidade: teCaixasCaixas[j].quantidade,
						quantidadeCaixa: teCaixasCaixas[j].quantidadeCaixa
					}
					table.push(tableObj);
				}
			}
		}	
		return table;
	}

	// Interligação entre duas listas: TECaixasCaixasGarrafas e Tipo de Vinho
	public iniListaTableTECaixaCaixasGarrafasTVinho(teCaixasCaixasGarrafas: any[], vinhos: any[]): any[]{
		var table: any[] = [];
		for (let i = 0; i < vinhos.length; i++){
			for (let j = 0; j < teCaixasCaixasGarrafas.length; j++){
				if (vinhos[i].id == teCaixasCaixasGarrafas[j].tipoVinhoCaixa){
					var tableObj: any = {
						id: teCaixasCaixasGarrafas[j].id,
						idEncomenda: teCaixasCaixasGarrafas[j].idEncomenda,
						capacidadeCaixa: teCaixasCaixasGarrafas[j].capacidadeCaixa,
						garrafas: teCaixasCaixasGarrafas[j].garrafas,
						material: teCaixasCaixasGarrafas[j].material,
						marcaCaixa: vinhos[i].marca,
						tipoCaixa: vinhos[i].tipo,
						categoriaCaixa: vinhos[i].categoria,
						cuba: teCaixasCaixasGarrafas[j].cuba,
						ano: teCaixasCaixasGarrafas[j].ano,
						capacidadeGarrafa: teCaixasCaixasGarrafas[j].capacidadeGarrafa,
						tipoVinhoGarrafa: teCaixasCaixasGarrafas[j].tipoVinhoGarrafa,
						quantidade: teCaixasCaixasGarrafas[j].quantidade,
						quantidadeCaixa: teCaixasCaixasGarrafas[j].quantidadeCaixa
					}
					table.push(tableObj);
				}
			}
		}	
		return table;
	}

	// Interligação entre duas listas: TECaixasCaixasGarrafasTVinho e Tipo de Vinho
	public iniListaTableTECaixaCaixasGarrafasTVinho2(teCaixasCaixasGarrafasTVinho: any[], vinhos: any[]): any[]{
		var table: any[] = [];
		for (let i = 0; i < vinhos.length; i++){
			for (let j = 0; j < teCaixasCaixasGarrafasTVinho.length; j++){
				if (vinhos[i].id == teCaixasCaixasGarrafasTVinho[j].tipoVinhoGarrafa){
					var tableObj: any = {
						id: teCaixasCaixasGarrafasTVinho[j].id,
						idEncomenda: teCaixasCaixasGarrafasTVinho[j].idEncomenda,
						capacidadeCaixa: teCaixasCaixasGarrafasTVinho[j].capacidadeCaixa,
						garrafas: teCaixasCaixasGarrafasTVinho[j].garrafas,
						material: teCaixasCaixasGarrafasTVinho[j].material,
						marcaCaixa: teCaixasCaixasGarrafasTVinho[j].marcaCaixa,
						tipoCaixa: teCaixasCaixasGarrafasTVinho[j].tipoCaixa,
						categoriaCaixa: teCaixasCaixasGarrafasTVinho[j].categoriaCaixa,
						cuba: teCaixasCaixasGarrafasTVinho[j].cuba,
						ano: teCaixasCaixasGarrafasTVinho[j].ano,
						capacidadeGarrafa: teCaixasCaixasGarrafasTVinho[j].capacidadeGarrafa,
						marcaGarrafa: vinhos[i].marca,
						tipoGarrafa: vinhos[i].tipo,
						categoriaGarrafa: vinhos[i].categoria,
						quantidade: teCaixasCaixasGarrafasTVinho[j].quantidade,
						quantidadeCaixa: teCaixasCaixasGarrafasTVinho[j].quantidadeCaixa
					}
					table.push(tableObj);
				}
			}
		}	
		return table;
	}

	// Função que obtem iniciais da marca do vinho - Função iniListaTableGarrafas(garrafas: any[], vinhos: any[])
	getIniciaisMarca(id: number, vinhos: any[]): string{
		var iniciais: string = "";
		var marca: string;
		for (let i = 0; i < vinhos.length; i++){
			if (id == vinhos[i].id) marca = vinhos[i].marca;
		}
		for (let i = 0; i < marca.length; i++){
			if (marca[i].match(/[A-Z]/) != null) iniciais = iniciais + marca[i];
		}
		return iniciais;
	}

}
