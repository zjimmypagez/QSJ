import { Injectable } from '@angular/core';

@Injectable()
export class OrdenarTablesService {	
	// Ordenar array users por username
	ordenarTabelaUsername(tabela: any[]): any[]{
		var tabelaOrdenada: any[] = [];
		tabelaOrdenada = tabela.sort(
			function(obj1, obj2){
				if (obj1.Username > obj2.Username) return 1;
				if (obj1.Username < obj2.Username) return -1;
				return 0;
			}
		);
		return tabelaOrdenada;
	}

	// Ordenar array caixas/garrafas por Marca e tipo vinho
	ordenarTabelaMV(tabela: any[]): any[]{
		var tabelaOrdenada: any[] = [];
		tabelaOrdenada = tabela.sort(
			function(obj1, obj2){
				var aConcat = obj1.Marca + obj1.tipo + obj1.Categoria;
				var bConcat = obj2.Marca + obj2.tipo + obj2.Categoria;
				if (aConcat > bConcat) return 1;
				if (aConcat < bConcat) return -1;
				return 0;
			}
		);
		return tabelaOrdenada;
	}

	// Ordenar array registos por data - registos caixa e garrafa
	ordenarTabelaData(tabela: any[]): any[]{
		var tabelaOrdenada: any[] = [];
		tabelaOrdenada = tabela.sort(
			function(obj1, obj2){
				var dataObj1 = new Date(obj1.Data);
				var dataObj2 = new Date(obj2.Data);
				if (dataObj1 > dataObj2) return -1;
				if (dataObj1 < dataObj2) return 1;
				return 0;
			}
		);
		return tabelaOrdenada;
	}

	// Ordenar array registos por data - registos encomendas
	ordenarTabelaDataV1(tabela: any[]): any[]{
		var tabelaOrdenada: any[] = [];
		tabelaOrdenada = tabela.sort(
			function(obj1, obj2){
				var dataObj1 = new Date(obj1._Data);
				var dataObj2 = new Date(obj2._Data);
				if (dataObj1 > dataObj2) return -1;
				if (dataObj1 < dataObj2) return 1;
				return 0;
			}
		);
		return tabelaOrdenada;
	}
}
