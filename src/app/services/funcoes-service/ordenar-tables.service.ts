import { Injectable } from '@angular/core';

@Injectable()
export class OrdenarTablesService {
	// Ordenar array vinhos por Marca
	ordenarVinhos(vinhos: any[]): any[]{
		var tabelaOrdenada: any[] = [];
		tabelaOrdenada = vinhos.sort(
			function(obj1, obj2){
				if (obj1.marca < obj2.marca){
					return -1;
				}
				if (obj1.marca > obj2.marca){
					return 1;
				}
				return 0;
			}
		);
		return tabelaOrdenada;
	}
}
