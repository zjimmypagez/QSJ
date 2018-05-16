import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { Caixa } from '../../../interfaces/caixa';
import { TipoVinho } from '../../../interfaces/tipoVinho';

import { FiltrosService } from '../../../services/funcoes-service/filtros.service';
import { JoinTablesService } from '../../../services/funcoes-service/join-tables.service';

@Component({
    selector: 'app-caixas-admin',
    templateUrl: './caixas-admin.component.html',
    styleUrls: ['./caixas-admin.component.css']
})
export class CaixasAdminComponent implements OnInit {	
	// Dados filtros
	FiltroForm: FormGroup;
	materiais: string[] = ["Cartão", "Madeira"];
	capacidades: number[] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500, 3.000, 6.000, 12.000];
	tipoVinhos: string[] = ["Verde", "Rosé", "Tinto", "Branco", "Espumante", "Quinta"];
	categorias: string[] = [];
	estadoTabela: boolean = true;
	
	// Lista de modelos de caixa a ler da BD
	caixas: Caixa[];
	// Lista de modelos de vinho a ler da BD
	vinhos: TipoVinho[];
	// Tabela interligada entre caixas e vinhos
	tabelaCaixas: tableCaixa[];	

   constructor( private router: Router, private fb: FormBuilder, private filtroService: FiltrosService, private joinTableService: JoinTablesService ) { 
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
	  this.tabelaCaixas = this.joinTableService.iniListaTableCaixas(this.caixas, this.vinhos);
	  this.categorias = this.filtroService.iniFiltroCategoria(this.vinhos);
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
		var marca = form.marca;
		
		if (marca != ""){
			this.tabelaCaixas = this.filtroService.pesquisaMarca(this.tabelaCaixas, marca);
			if (this.tabelaCaixas.length == 0)
				this.estadoTabela = false;
			else
				this.estadoTabela = true;
		}
		else{
			this.estadoTabela = true;
			this.tabelaCaixas = this.joinTableService.iniListaTableCaixas(this.caixas, this.vinhos);
			this.clearForm();				
			alert("Pesquisa inválida!");
		}
	}

	// Filtros 
	onChange(){
		var filtro: any = this.FiltroForm.value;
		this.tabelaCaixas = this.joinTableService.iniListaTableCaixas(this.caixas, this.vinhos);

		if (filtro.material != "" || filtro.capacidade != "" || filtro.tipoVinho != "" || filtro.categoria != ""){
			this.tabelaCaixas = this.filtroService.filtroMaterialCapacidadeTipoVinhoCategoria(filtro, this.tabelaCaixas);
			if (this.tabelaCaixas.length == 0)
				this.estadoTabela = false;
			else
				this.estadoTabela = true;
		}
		else{
			this.FiltroForm.controls['marca'].setValue('');
			this.tabelaCaixas = this.joinTableService.iniListaTableCaixas(this.caixas, this.vinhos);
			this.estadoTabela = true;
		}
	}

	// Limpar pesquisa
	clearTabela(){
		this.tabelaCaixas = this.joinTableService.iniListaTableCaixas(this.caixas, this.vinhos);
		this.estadoTabela = true;
		this.clearForm();
	}

	// Limpar Form
	clearForm(){
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