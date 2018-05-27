import { Injectable } from '@angular/core';

@Injectable()
export class FiltrosService {

	// Função utilizada para retornar uma tabela a partir da pesquisa da marca do vinho
	pesquisaMarca(tabela: any[], marca: string): any[]{
		var tabelaMarca: any[] = tabela.filter(x => x.marca.toUpperCase() == marca.toUpperCase());
		return tabelaMarca;
	}

	// Função utilizada para retornar uma tabela a partir da pesquisa do num de fatura de uma encomenda
	pesquisaNFatura(tabela: any[], nFatura: number): any[]{
		var tabelaNFatura: any[] = tabela.filter(x => x.nFatura == nFatura);
		return tabelaNFatura;
	}

	// Função utilizada para retornar uma tabela a partir da pesquisa do username de utilizador
	pesquisaUsername(tabela: any[], username: string): any[]{
		var tabelaUsername: any[] = tabela.filter(x => x.username == username);
		return tabelaUsername;
	}

	// Função que cruza os filtros TipoVinho - Categoria e devolve a tabela que desse cruzamento é originada
	filtroTipoVinhoCategoria(filtro: any, tabela: any[]): any[]{
		var tabelaFiltro: any[] = tabela;	
		if (filtro.tipoVinho != "" && filtro.categoria != ""){
			tabelaFiltro = this.filtrarTipoVinho(filtro, tabelaFiltro);
			tabelaFiltro = this.filtrarCategoriaVinho(filtro, tabelaFiltro);
		}
		else{
			if (filtro.tipoVinho != "") tabelaFiltro = this.filtrarTipoVinho(filtro, tabelaFiltro);	
			else tabelaFiltro = this.filtrarCategoriaVinho(filtro, tabelaFiltro);
		}
		return tabelaFiltro;
	}

	// Função que filtra por Estado de encomenda e devolve a tabela que desse cruzamento é originada
	filtroEstado(filtro: any, tabela: any[]): any[]{
		var tabelaFiltro: any[] = tabela;	
		if (filtro.estado != "") tabelaFiltro = this.filtrarEstado(filtro, tabelaFiltro);
		return tabelaFiltro;
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
													if (filtro.material != "") tabelaFiltro = this.filtrarMaterial(filtro, tabelaFiltro);
													else
														if (filtro.capacidade != "") tabelaFiltro = this.filtrarCapacidade(filtro, tabelaFiltro);
														else
															if (filtro.tipoVinho != "") tabelaFiltro = this.filtrarTipoVinho(filtro, tabelaFiltro);
															else tabelaFiltro = this.filtrarCategoriaVinho(filtro, tabelaFiltro);
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
													if (filtro.ano != "") tabelaFiltro = this.filtrarAno(filtro, tabelaFiltro);
													else
														if (filtro.capacidade != "") tabelaFiltro = this.filtrarCapacidade(filtro, tabelaFiltro);
														else
															if (filtro.tipoVinho != "") tabelaFiltro = this.filtrarTipoVinho(filtro, tabelaFiltro);
															else tabelaFiltro = this.filtrarCategoriaVinho(filtro, tabelaFiltro);
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
	filtrarAno(filtro: any, tabela: any[]): any[]{
		var tabelaAno: any[] = tabela.filter(x => x.ano == filtro.ano);
		return tabelaAno;
	}

	// Função que filtra ano, tabela representa a tabela da qual é filtrado o material
	filtrarMaterial(filtro: any, tabela: any[]): any[]{
		var tabelaAno: any[] = tabela.filter(x => x.material == filtro.material);
		return tabelaAno;
	}

	// Função que filtra capacidade, tabela representa a tabela da qual é filtrado a capacidade
	filtrarCapacidade(filtro: any, tabela: any[]): any[]{
		var tabelaCapacidade: any[] = tabela.filter(x => x.capacidade == filtro.capacidade);
		return tabelaCapacidade;
	}

	// Função que filtra tipo de vinho, tabela representa a tabela da qual é filtrado o tipo de vinho
	filtrarTipoVinho(filtro: any, tabela: any[]): any[]{
		var tabelaTipoVinho: any[] = tabela.filter(x => x.tipo == filtro.tipoVinho);
		return tabelaTipoVinho;
	}

	// Função que filtra categoria do vinho, tabela representa a tabela da qual é filtrado a categoria do vinho
	filtrarCategoriaVinho(filtro: any, tabela: any[]): any[]{
		var tabelaCategoriaVinho: any[] = [];
		if (filtro.categoria != "Normal") tabelaCategoriaVinho = tabela.filter(x => x.categoria == filtro.categoria);
		else tabelaCategoriaVinho = tabela.filter(x => x.categoria == "");
		return tabelaCategoriaVinho;
	}

	// Função que filtra estado, tabela representa a tabela da qual é filtrado o estado
	filtrarEstado(filtro: any, tabela: any[]): any[]{
		var tabelaEstado: any[] = tabela.filter(x => x.ano == filtro.ano);
		if (filtro.estado != "EmEspera") tabelaEstado = tabela.filter(x => x.estado == true);
		else tabelaEstado = tabela.filter(x => x.estado == false);
		return tabelaEstado;
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
					if (vinhos[i].categoria == categorias[j]) count++;
				}
				if (count == 0) categorias.push(vinhos[i].categoria);
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
			if (garrafas[i].ano > anoMax) anoMax = garrafas[i].ano;
			if (garrafas[i].ano < anoMin) anoMin = garrafas[i].ano;
		}
		for (let i = anoMin; i <= anoMax; i++){
			anos.push(i);
		}
		return anos;
	}

}
