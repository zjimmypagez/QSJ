import { Injectable } from '@angular/core';

@Injectable()
export class OrdenarTablesService {
	// Ordenar array vinhos por Marca
	ordenarVinhos(vinhos: any[]): any[]{
		var tabelaOrdenada: any[] = [];
		tabelaOrdenada = vinhos.sort(
			function(obj1, obj2){
				if (obj1.marca < obj2.marca) return -1;
				if (obj1.marca > obj2.marca) return 1;
				return 0;
			}
		);
		return tabelaOrdenada;
	}

	
	// Ordenar array caixas por Marca e tipo vinho
	ordenarTabelaMV(tabela: any[]): any[]{
		var tabelaOrdenada: any[] = [];
		tabelaOrdenada = tabela.sort(
			function(obj1, obj2){
				var aConcat = obj1.marca + obj1.tipo + obj1.categoria;
				var bConcat = obj2.marca + obj2.tipo + obj2.categoria;
				if (aConcat > bConcat) return 1;
				if (aConcat < bConcat) return -1;
				return 0;
			}
		);
		return tabelaOrdenada;
	}
}
