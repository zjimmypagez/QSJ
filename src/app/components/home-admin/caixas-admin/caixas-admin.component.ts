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
	capacidades: number[] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500];
	estadoTabela: boolean = true;
	
	// Lista de modelos de caixa a ler da BD
	caixas: Caixa[];
	// Lista de modelos de vinho a ler da BD
	vinhos: TipoVinho[];
	// Tabela interligada entre caixas e vinhos
	tabelaCaixas: tableCaixa[];	

   constructor( private router: Router, private fb: FormBuilder ) { 
		this.FiltroForm = fb.group({
			'material': ['', ],
			'capacidade': ['', ],
			'tipoVinho': ['', ]
		});
	}

	ngOnInit() {
	  this.iniListaCaixas();
	  this.iniListaVinhos();
	  this.tabelaCaixas = this.iniListatTableCaixas(this.caixas, this.vinhos);
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

	// Filtros 
	onChange(){
		var filtro: any = this.FiltroForm.value;
		this.tabelaCaixas = this.iniListatTableCaixas(this.caixas, this.vinhos);

		if (filtro.material != "" || filtro.capacidade != "" || filtro.tipoVinho != ""){
			if (filtro.material != "" && filtro.capacidade != "" && filtro.tipoVinho != ""){
				this.tabelaCaixas = this.filtrarMaterial(filtro);
				this.tabelaCaixas = this.filtrarCapacidade(filtro);
				this.tabelaCaixas = this.filtrarTipoVinho(filtro);
			}
			else{
				if (filtro.material != "" && filtro.capacidade != ""){
					this.tabelaCaixas = this.filtrarMaterial(filtro);
					this.tabelaCaixas = this.filtrarCapacidade(filtro);				
				}
				else{
					if (filtro.capacidade != "" && filtro.tipoVinho != ""){
						this.tabelaCaixas = this.filtrarCapacidade(filtro);
						this.tabelaCaixas = this.filtrarTipoVinho(filtro);
					}
					else{
						if (filtro.material != "" && filtro.tipoVinho != ""){
							this.tabelaCaixas = this.filtrarMaterial(filtro);
							this.tabelaCaixas = this.filtrarTipoVinho(filtro);
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
									this.tabelaCaixas = this.filtrarTipoVinho(filtro);
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
			if (this.tabelaCaixas[i].tipoVinho == filtro.tipoVinho){
				tabelaTipoVinho.push(this.tabelaCaixas[i]);
			}
		}
		return tabelaTipoVinho;
	}

	// Ordenar por Material
	public ordemMaterial(): tableCaixa[]{
		var tabela: tableCaixa[] = this.tabelaCaixas;
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
	public ordemCapacidade(): tableCaixa[]{
		var tabela: tableCaixa[] = this.tabelaCaixas;
		tabela.sort(
			function(obj1, obj2){
				return obj1.capacidade - obj2.capacidade;
			}
		);
		return tabela;
	}

	// Ordenar por Tipo de Vinho
	public ordemTipoVinho(): tableCaixa[]{
		var tabela: tableCaixa[] = this.tabelaCaixas;
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
						tipoVinho: vinhos[j].tipo,
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
	tipoVinho: string, // Atributo tipo da tabela Tipo de Vinho
	quantidade: number
}