import { Injectable } from '@angular/core';

@Injectable()
export class FiltrosService {

	// Função utilizada para retornar uma tabela a partir da pesquisa da marca do vinho
	pesquisaMarca(tabela: any[], marca: string): any[]{
		var tabelaMarca: any[] = [];
		// Pesquisa na tabela por objetos com a propriedade marca igual a pesquisada
		for (let i = 0; i < tabela.length; i++){
			if (marca.toUpperCase() === tabela[i].marca.toUpperCase()){
				tabelaMarca.push(tabela[i]);
			}
		}
		return tabelaMarca;
	}

	// Função utilizada para retornar uma tabela a partir da pesquisa do num de fatura de uma encomenda
	pesquisaNFatura(tabela: any[], nFatura: number): any[]{
		var tabelaNFatura: any[] = [];
		// Pesquisa na tabela por objetos com a propriedade nfatura igual a pesquisada
		for (let i = 0; i < tabela.length; i++){
			if (tabela[i].nFatura == nFatura)
				tabelaNFatura.push(tabela[i]);
		}
		return tabelaNFatura;
	}

	// Função que cruza os filtros Material - Capacidade - TipoVinho - Categoria e devolve a tabela que desse cruzamento é originada
	filtroMaterialCapacidadeTipoVinhoCategoria(filtro: any, tabela: any[]): any[]{
		var tabelaFiltro: any[] = tabela;		
		if (filtro.material != "" && filtro.capacidade != "" && filtro.tipoVinho != "" && filtro.categoria != ""){
			tabelaFiltro = this.filtrarMaterial(filtro, tabelaFiltro);
			tabelaFiltro = this.filtrarCapacidade(filtro, tabelaFiltro);
			tabelaFiltro = this.filtrarTipoVinho(filtro, tabelaFiltro);
			tabelaFiltro = this.filtrarCategoriaVinho(filtro, tabelaFiltro);
		}
		else{
			if (filtro.material != "" && filtro.capacidade != "" && filtro.tipoVinho != ""){
				tabelaFiltro = this.filtrarMaterial(filtro, tabelaFiltro);
				tabelaFiltro = this.filtrarCapacidade(filtro, tabelaFiltro);	
				tabelaFiltro = this.filtrarTipoVinho(filtro, tabelaFiltro);	
			}
			else{
				if (filtro.material != "" && filtro.capacidade != "" && filtro.categoria != ""){
					tabelaFiltro = this.filtrarMaterial(filtro, tabelaFiltro);
					tabelaFiltro = this.filtrarCapacidade(filtro, tabelaFiltro);
					tabelaFiltro = this.filtrarCategoriaVinho(filtro, tabelaFiltro);
				}
				else{
					if (filtro.material != "" && filtro.tipoVinho != "" && filtro.categoria != ""){
						tabelaFiltro = this.filtrarMaterial(filtro, tabelaFiltro);
						tabelaFiltro = this.filtrarTipoVinho(filtro, tabelaFiltro);
						tabelaFiltro = this.filtrarCategoriaVinho(filtro, tabelaFiltro);
					}
					else{
						if (filtro.capacidade != "" && filtro.tipoVinho != "" && filtro.categoria != ""){
							tabelaFiltro = this.filtrarCapacidade(filtro, tabelaFiltro);
							tabelaFiltro = this.filtrarTipoVinho(filtro, tabelaFiltro);
							tabelaFiltro = this.filtrarCategoriaVinho(filtro, tabelaFiltro);
						}
						else{
							if (filtro.material != "" && filtro.capacidade != ""){
								tabelaFiltro = this.filtrarMaterial(filtro, tabelaFiltro);
								tabelaFiltro = this.filtrarCapacidade(filtro, tabelaFiltro);
							}
							else{
								if (filtro.material != "" && filtro.tipoVinho != ""){
									tabelaFiltro = this.filtrarMaterial(filtro, tabelaFiltro);
									tabelaFiltro = this.filtrarTipoVinho(filtro, tabelaFiltro);
								}
								else{
									if (filtro.material != "" && filtro.categoria != ""){
										tabelaFiltro = this.filtrarMaterial(filtro, tabelaFiltro);
										tabelaFiltro = this.filtrarCategoriaVinho(filtro, tabelaFiltro);
									}
									else{
										if (filtro.capacidade != "" && filtro.tipoVinho != ""){
											tabelaFiltro = this.filtrarCapacidade(filtro, tabelaFiltro);
											tabelaFiltro = this.filtrarTipoVinho(filtro, tabelaFiltro);
										}
										else{
											if (filtro.capacidade != "" && filtro.categoria != ""){
												tabelaFiltro = this.filtrarCapacidade(filtro, tabelaFiltro);
												tabelaFiltro = this.filtrarCategoriaVinho(filtro, tabelaFiltro);
											}
											else{
												if (filtro.tipoVinho != "" && filtro.categoria != ""){
													tabelaFiltro = this.filtrarTipoVinho(filtro, tabelaFiltro);
													tabelaFiltro = this.filtrarCategoriaVinho(filtro, tabelaFiltro);
												}
												else{
													if (filtro.material != ""){
														tabelaFiltro = this.filtrarMaterial(filtro, tabelaFiltro);
													}
													else{
														if (filtro.capacidade != ""){
															tabelaFiltro = this.filtrarCapacidade(filtro, tabelaFiltro);
														}
														else{
															if (filtro.tipoVinho != ""){
																tabelaFiltro = this.filtrarTipoVinho(filtro, tabelaFiltro);
															}
															else{
																tabelaFiltro = this.filtrarCategoriaVinho(filtro, tabelaFiltro);
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
		return tabelaFiltro;
	}

	// Função que cruza os filtros Ano - Capacidade - TipoVinho - Categoria e devolve a tabela que desse cruzamento é originada
	filtroAnoCapacidadeTipoVinhoCategoria(filtro: any, tabela: any[]): any[]{
		var tabelaFiltro: any[] = tabela;		
		if (filtro.ano != "" && filtro.capacidade != "" && filtro.tipoVinho != "" && filtro.categoria != ""){
			tabelaFiltro = this.filtrarAno(filtro, tabelaFiltro);
			tabelaFiltro = this.filtrarCapacidade(filtro, tabelaFiltro);
			tabelaFiltro = this.filtrarTipoVinho(filtro, tabelaFiltro);
			tabelaFiltro = this.filtrarCategoriaVinho(filtro, tabelaFiltro);
		}
		else{
			if (filtro.ano != "" && filtro.capacidade != "" && filtro.tipoVinho != ""){
				tabelaFiltro = this.filtrarAno(filtro, tabelaFiltro);
				tabelaFiltro = this.filtrarCapacidade(filtro, tabelaFiltro);	
				tabelaFiltro = this.filtrarTipoVinho(filtro, tabelaFiltro);	
			}
			else{
				if (filtro.ano != "" && filtro.capacidade != "" && filtro.categoria != ""){
					tabelaFiltro = this.filtrarAno(filtro, tabelaFiltro);
					tabelaFiltro = this.filtrarCapacidade(filtro, tabelaFiltro);
					tabelaFiltro = this.filtrarCategoriaVinho(filtro, tabelaFiltro);
				}
				else{
					if (filtro.ano != "" && filtro.tipoVinho != "" && filtro.categoria != ""){
						tabelaFiltro = this.filtrarAno(filtro, tabelaFiltro);
						tabelaFiltro = this.filtrarTipoVinho(filtro, tabelaFiltro);
						tabelaFiltro = this.filtrarCategoriaVinho(filtro, tabelaFiltro);
					}
					else{
						if (filtro.capacidade != "" && filtro.tipoVinho != "" && filtro.categoria != ""){
							tabelaFiltro = this.filtrarCapacidade(filtro, tabelaFiltro);
							tabelaFiltro = this.filtrarTipoVinho(filtro, tabelaFiltro);
							tabelaFiltro = this.filtrarCategoriaVinho(filtro, tabelaFiltro);
						}
						else{
							if (filtro.ano != "" && filtro.capacidade != ""){
								tabelaFiltro = this.filtrarAno(filtro, tabelaFiltro);
								tabelaFiltro = this.filtrarCapacidade(filtro, tabelaFiltro);
							}
							else{
								if (filtro.ano != "" && filtro.tipoVinho != ""){
									tabelaFiltro = this.filtrarAno(filtro, tabelaFiltro);
									tabelaFiltro = this.filtrarTipoVinho(filtro, tabelaFiltro);
								}
								else{
									if (filtro.ano != "" && filtro.categoria != ""){
										tabelaFiltro = this.filtrarAno(filtro, tabelaFiltro);
										tabelaFiltro = this.filtrarCategoriaVinho(filtro, tabelaFiltro);
									}
									else{
										if (filtro.capacidade != "" && filtro.tipoVinho != ""){
											tabelaFiltro = this.filtrarCapacidade(filtro, tabelaFiltro);
											tabelaFiltro = this.filtrarTipoVinho(filtro, tabelaFiltro);
										}
										else{
											if (filtro.capacidade != "" && filtro.categoria != ""){
												tabelaFiltro = this.filtrarCapacidade(filtro, tabelaFiltro);
												tabelaFiltro = this.filtrarCategoriaVinho(filtro, tabelaFiltro);
											}
											else{
												if (filtro.tipoVinho != "" && filtro.categoria != ""){
													tabelaFiltro = this.filtrarTipoVinho(filtro, tabelaFiltro);
													tabelaFiltro = this.filtrarCategoriaVinho(filtro, tabelaFiltro);
												}
												else{
													if (filtro.ano != ""){
														tabelaFiltro = this.filtrarAno(filtro, tabelaFiltro);
													}
													else{
														if (filtro.capacidade != ""){
															tabelaFiltro = this.filtrarCapacidade(filtro, tabelaFiltro);
														}
														else{
															if (filtro.tipoVinho != ""){
																tabelaFiltro = this.filtrarTipoVinho(filtro, tabelaFiltro);
															}
															else{
																tabelaFiltro = this.filtrarCategoriaVinho(filtro, tabelaFiltro);
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
		return tabelaFiltro;
	}

	// Função que filtra ano, tabela representa a tabela da qual é filtrado o ano
	public filtrarAno(filtro: any, tabela: any[]): any[]{
		var tabelaAno: any[] = [];
		for (let i = 0; i < tabela.length; i++){
			if (tabela[i].ano == filtro.ano){
				tabelaAno.push(tabela[i]);
			}
		}
		return tabelaAno;
	}

	// Função que filtra ano, tabela representa a tabela da qual é filtrado o material
	filtrarMaterial(filtro: any, tabela: any[]): any[]{
		var tabelaAno: any[] = [];
		for (let i = 0; i < tabela.length; i++){
			if (tabela[i].material == filtro.material){
				tabelaAno.push(tabela[i]);
			}
		}
		return tabelaAno;
	}

	// Função que filtra capacidade, tabela representa a tabela da qual é filtrado a capacidade
	filtrarCapacidade(filtro: any, tabela: any[]): any[]{
		var tabelaCapacidade: any[] = [];
		for (let i = 0; i < tabela.length; i++){
			if (tabela[i].capacidade == filtro.capacidade){
				tabelaCapacidade.push(tabela[i]);
			}
		}
		return tabelaCapacidade;
	}

	// Função que filtra tipo de vinho, tabela representa a tabela da qual é filtrado o tipo de vinho
	filtrarTipoVinho(filtro: any, tabela: any[]): any[]{
		var tabelaTipoVinho: any[] = [];
		for (let i = 0; i < tabela.length; i++){
			if (tabela[i].tipo == filtro.tipoVinho){
				tabelaTipoVinho.push(tabela[i]);
			}
		}
		return tabelaTipoVinho;
	}

	// Função que filtra categoria do vinho, tabela representa a tabela da qual é filtrado a categoria do vinho
	filtrarCategoriaVinho(filtro: any, tabela: any[]): any[]{
		var tabelaCategoriaVinho: any[] = [];
		if (filtro.categoria != "Normal"){
			for (let i = 0; i < tabela.length; i++){
				if (tabela[i].categoria == filtro.categoria){
					tabelaCategoriaVinho.push(tabela[i]);
				}
			}
		}
		else{
			for (let i = 0; i < tabela.length; i++){
				if (tabela[i].categoria == ""){
					tabelaCategoriaVinho.push(tabela[i]);
				}
			}
		}
		return tabelaCategoriaVinho;
	}

	// Função que incializa o filtro categorias
	iniFiltroCategoria(vinhos: any[]): string[]{
		var categorias: string[] = [];
		var first: number = 0;

		for (let i = 0; i < vinhos.length; i++){
			if (vinhos[i].categoria != "" && first == 0){
				categorias.push(vinhos[i].categoria);
				first++;
			}
		}

		for (let i = 1; i < vinhos.length; i++){
			var count: number = 0;
			if (vinhos[i].categoria != ""){
				for (let j = 0; j < categorias.length; j++){
					if (vinhos[i].categoria == categorias[j])
						count++;
				}
				if (count == 0)
					categorias.push(vinhos[i].categoria);
			}
		}

		return categorias;
	}

	// Função que inicializa o filtro ano
	public iniFiltroAno(garrafas: any[]): number[]{
		var anos: number[] = [];
		var anoMax: number = 0;
		var anoMin: number = 2100;		

		for (let i = 0; i < garrafas.length; i++){
			if (garrafas[i].ano > anoMax)
				anoMax = garrafas[i].ano;
			if (garrafas[i].ano < anoMin)
				anoMin = garrafas[i].ano;
		}

		for (let i = anoMin; i <= anoMax; i++){
			anos.push(i);
		}
		return anos;
	}

}
