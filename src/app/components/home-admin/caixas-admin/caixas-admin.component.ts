import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { Caixa } from '../../../interfaces/caixa';
import { TipoVinho } from '../../../interfaces/tipoVinho';

@Component({
    selector: 'app-caixas-admin',
    templateUrl: './caixas-admin.component.html',
    styleUrls: ['./caixas-admin.component.css']
})
export class CaixasAdminComponent implements OnInit {	
	// Dados filtros
	FiltroForm: FormGroup;
	materiais: string[] = ["Cartão", "Madeira"];
	categorias: string[] = [];
	capacidades: number[] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500, 3.000, 6.000, 12.000];
	estadoTabela: boolean = true;
	
	// Lista de modelos de caixa a ler da BD
	caixas: Caixa[];
	// Lista de modelos de vinho a ler da BD
	vinhos: TipoVinho[];
	// Tabela interligada entre caixas e vinhos
	tabelaCaixas: tableCaixa[];	

   constructor( private router: Router, private fb: FormBuilder ) { 
		this.FiltroForm = fb.group({
			'marca': ['', Validators.minLength(1)],
			'material': ['', ],
			'capacidade': ['', ],
			'tipoVinho': ['', ],
			'categoria': ['', ]
		});
	}

	ngOnInit() {
	  this.iniListaCaixas();
	  this.iniListaVinhos();
	  this.tabelaCaixas = this.iniListatTableCaixas(this.caixas, this.vinhos);

	  this.categorias = this.iniFiltroCategoria();
   }

	// Função responsável por selecionar o modelo de caixa a ser editado
   editarCaixa(id: number){
		this.router.navigate(['/admin/caixas/editar', id]);
	}
	
	// Função responsável por eliminar o modelo de caixa selecionado
	eliminarCaixa(id: number){
		// Variavel que verifica se um modelo de caixa pode ser eliminado (false) ou não (true)
		var estadoCaixa: boolean = true;

		for (let i = 0; i < this.caixas.length; i++){
			if (id == this.caixas[i].id){
				if (this.caixas[i].quantidade > 0){
					estadoCaixa = false;
				}
			}
		}

		if (estadoCaixa){
			if (confirm("Quer mesmo eliminar este modelo?")){
				alert("O modelo de caixa foi eliminado com sucesso!");
				this.router.navigate(['/admin/caixas']);
			}
		}
		else
			alert("O modelo de caixa que pretende eliminar existe, em stock, no armazém.")
	}

	// Pesquisa a um determinada marca
	pesquisaMarca(form){
		var frm = form;
		
		if (frm.marca != ""){
			var tabelaMarca: tableCaixa[] = [];
			for (let i = 0; i < this.tabelaCaixas.length; i++){
				if (frm.marca.toUpperCase() === this.tabelaCaixas[i].marca.toUpperCase()){
					tabelaMarca.push(this.tabelaCaixas[i]);
				}
			}
			if (tabelaMarca.length == 0){
				this.estadoTabela = false;
			}
			else{
				this.estadoTabela = true;
				this.tabelaCaixas = tabelaMarca;
			}
		}
		else{
			this.estadoTabela = true;
			this.tabelaCaixas = this.iniListatTableCaixas(this.caixas, this.vinhos);
			this.clearForm();				
			alert("Pesquisa inválida!");
		}
	}

	// Filtros 
	onChange(){
		var filtro: any = this.FiltroForm.value;
		this.tabelaCaixas = this.iniListatTableCaixas(this.caixas, this.vinhos);

		if (filtro.material != "" || filtro.capacidade != "" || filtro.tipoVinho != "" || filtro.categoria != ""){
			if (filtro.material != "" && filtro.capacidade != "" && filtro.tipoVinho != "" && filtro.categoria != ""){
				this.tabelaCaixas = this.filtrarMaterial(filtro);
				this.tabelaCaixas = this.filtrarCapacidade(filtro);
				this.tabelaCaixas = this.filtrarTipoVinho(filtro);
				this.tabelaCaixas = this.filtrarCategoriaVinho(filtro);
			}
			else{
				if (filtro.material != "" && filtro.capacidade != "" && filtro.tipoVinho != ""){
					this.tabelaCaixas = this.filtrarMaterial(filtro);
					this.tabelaCaixas = this.filtrarCapacidade(filtro);	
					this.tabelaCaixas = this.filtrarTipoVinho(filtro);	
				}
				else{
					if (filtro.material != "" && filtro.capacidade != "" && filtro.categoria != ""){
						this.tabelaCaixas = this.filtrarMaterial(filtro);
						this.tabelaCaixas = this.filtrarCapacidade(filtro);
						this.tabelaCaixas = this.filtrarCategoriaVinho(filtro);
					}
					else{
						if (filtro.material != "" && filtro.tipoVinho != "" && filtro.categoria != ""){
							this.tabelaCaixas = this.filtrarMaterial(filtro);
							this.tabelaCaixas = this.filtrarTipoVinho(filtro);
							this.tabelaCaixas = this.filtrarCategoriaVinho(filtro);
						}
						else{
							if (filtro.capacidade != "" && filtro.tipoVinho != "" && filtro.categoria != ""){
								this.tabelaCaixas = this.filtrarCapacidade(filtro);
								this.tabelaCaixas = this.filtrarTipoVinho(filtro);
								this.tabelaCaixas = this.filtrarCategoriaVinho(filtro);
							}
							else{
								if (filtro.material != "" && filtro.capacidade != ""){
									this.tabelaCaixas = this.filtrarMaterial(filtro);
									this.tabelaCaixas = this.filtrarCapacidade(filtro);
								}
								else{
									if (filtro.material != "" && filtro.tipoVinho != ""){
										this.tabelaCaixas = this.filtrarMaterial(filtro);
										this.tabelaCaixas = this.filtrarTipoVinho(filtro);
									}
									else{
										if (filtro.material != "" && filtro.categoria != ""){
											this.tabelaCaixas = this.filtrarMaterial(filtro);
											this.tabelaCaixas = this.filtrarCategoriaVinho(filtro);
										}
										else{
											if (filtro.capacidade != "" && filtro.tipoVinho != ""){
												this.tabelaCaixas = this.filtrarCapacidade(filtro);
												this.tabelaCaixas = this.filtrarTipoVinho(filtro);
											}
											else{
												if (filtro.capacidade != "" && filtro.categoria != ""){
													this.tabelaCaixas = this.filtrarCapacidade(filtro);
													this.tabelaCaixas = this.filtrarCategoriaVinho(filtro);
												}
												else{
													if (filtro.tipoVinho != "" && filtro.categoria != ""){
														this.tabelaCaixas = this.filtrarTipoVinho(filtro);
														this.tabelaCaixas = this.filtrarCategoriaVinho(filtro);
													}
													else{
														if (filtro.material != ""){
															this.tabelaCaixas = this.filtrarMaterial(filtro);
														}
														else{
															if (filtro.capacidade != ""){
																this.tabelaCaixas = this.filtrarCapacidade(filtro);
															}
															else{
																if (filtro.tipoVinho != ""){
																	this.tabelaCaixas = this.filtrarTipoVinho(filtro);
																}
																else{
																	this.tabelaCaixas = this.filtrarCategoriaVinho(filtro);
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
			if (this.tabelaCaixas.length == 0){
				this.estadoTabela = false;
			}
			else{
				this.estadoTabela = true;
			}
		}
		else{
			this.tabelaCaixas = this.iniListatTableCaixas(this.caixas, this.vinhos);
			this.estadoTabela = true;
		}
	}

	// Função que filtra ano
	public filtrarMaterial(filtro: any): tableCaixa[]{
		var tabelaAno: tableCaixa[] = [];
		for (let i = 0; i < this.tabelaCaixas.length; i++){
			if (this.tabelaCaixas[i].material == filtro.material){
				tabelaAno.push(this.tabelaCaixas[i]);
			}
		}
		return tabelaAno;
	}

	// Função que filtra capacidade
	public filtrarCapacidade(filtro: any): tableCaixa[]{
		var tabelaCapacidade: tableCaixa[] = [];
		for (let i = 0; i < this.tabelaCaixas.length; i++){
			if (this.tabelaCaixas[i].capacidade == filtro.capacidade){
				tabelaCapacidade.push(this.tabelaCaixas[i]);
			}
		}
		return tabelaCapacidade;
	}

	// Função que filtra tipo de vinho
	public filtrarTipoVinho(filtro: any): tableCaixa[]{
		var tabelaTipoVinho: tableCaixa[] = [];
		for (let i = 0; i < this.tabelaCaixas.length; i++){
			if (this.tabelaCaixas[i].tipo == filtro.tipoVinho){
				tabelaTipoVinho.push(this.tabelaCaixas[i]);
			}
		}
		return tabelaTipoVinho;
	}

	// Função que filtra categoria do vinho
	public filtrarCategoriaVinho(filtro: any): tableCaixa[]{
		var tabelaCategoriaVinho: tableCaixa[] = [];
		if (filtro.categoria != "Normal"){
			for (let i = 0; i < this.tabelaCaixas.length; i++){
				if (this.tabelaCaixas[i].categoria == filtro.categoria){
					tabelaCategoriaVinho.push(this.tabelaCaixas[i]);
				}
			}
		}
		else{
			for (let i = 0; i < this.tabelaCaixas.length; i++){
				if (this.tabelaCaixas[i].categoria == ""){
					tabelaCategoriaVinho.push(this.tabelaCaixas[i]);
				}
			}
		}
		return tabelaCategoriaVinho;
	}

	// Incializar o filtro categorias
	public iniFiltroCategoria(): string[]{
		var categorias: string[] = [];
		var first: number = 0;

		for (let i = 0; i < this.vinhos.length; i++){
			if (this.vinhos[i].categoria != "" && first == 0){
				categorias.push(this.vinhos[i].categoria);
				first++;
			}
		}

		for (let i = 1; i < this.vinhos.length; i++){
			var count: number = 0;
			if (this.vinhos[i].categoria != ""){
				for (let j = 0; j < categorias.length; j++){
					if (this.vinhos[i].categoria == categorias[j])
						count++;
				}
				if (count == 0)
					categorias.push(this.vinhos[i].categoria);
			}
		}

		return categorias;
	}

	// Limpar Form
	public clearForm(){
		this.FiltroForm.controls['marca'].setValue('');
		this.FiltroForm.controls['material'].setValue('');
		this.FiltroForm.controls['capacidade'].setValue('');
		this.FiltroForm.controls['tipoVinho'].setValue('');
		this.FiltroForm.controls['categoria'].setValue('');
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
			tipoVinho: 2,
			quantidade: 50
      }];
	}
	
	// Dados criados (A ser subsituido pela ligação à BD)
	public iniListaVinhos(){
		this.vinhos = [{
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
		}];
	}

	// Interligação entre duas listas: Caixa e Tipo de Vinho
	public iniListatTableCaixas(caixas: Caixa[], vinhos: TipoVinho[]): tableCaixa[]{
		var table: tableCaixa[] = [];

		for (let i = 0; i < caixas.length; i++){
			for (let j = 0; j < vinhos.length; j++){
				if (caixas[i].tipoVinho == vinhos[j].id){
					var tableObj: tableCaixa = {
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

		return table;
	}

}

// Interface que interliga 2 tabelas = Caixa + Tipo de Vinho 
interface tableCaixa{
	id: number,
   capacidade: number,
   garrafas: number,
   material: string,
	marca: string, // Atributo marca da tabela Tipo de vinho
	tipo: string, // Atributo tipo da tabela Tipo de Vinho
	categoria: string; // Atributo categoria da tabela Tipo de Vinho
	quantidade: number
}