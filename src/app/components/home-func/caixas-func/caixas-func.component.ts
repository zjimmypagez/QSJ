import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { Caixa } from '../../../interfaces/caixa';
import { RegistoCaixa } from '../../../interfaces/registoCaixa';
import { TipoVinho } from '../../../interfaces/tipoVinho';

import { JoinTablesService } from '../../../services/funcoes-service/join-tables.service';
import { FiltrosService } from '../../../services/funcoes-service/filtros.service';

@Component({
	selector: 'app-caixas-func',
	templateUrl: './caixas-func.component.html',
	styleUrls: ['./caixas-func.component.css']
})
export class CaixasFuncComponent implements OnInit {
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
	// Lista de registo de caixas a ler da BD
	registos: RegistoCaixa[];
	// Tabela interligada entre caixa e registo caixas
	tabelaCaixaRegistos: tableCaixaRegisto[];
	// Tabela interligada entre tabelaregisto caixas e vinhos
	tabelaRegistos: tableRegisto[];

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
		this.iniListaRegistos();
		this.tabelaCaixaRegistos = this.joinTableService.iniListaTableCaixaRegistos(this.caixas, this.registos);		
		this.iniListaVinhos();
		this.tabelaRegistos = this.joinTableService.iniListaTableRegistosCaixa(this.tabelaCaixaRegistos, this.vinhos);	
		this.categorias = this.filtroService.iniFiltroCategoria(this.vinhos);
	}

	// Função responsável por selecionar o registo de caixa a ser editado
   editarRegisto(id: number){
		this.router.navigate(['/func/caixas/editar', id]);
	}
	
	// Função responsável por eliminar o registo de caixa selecionado
	eliminarRegisto(id: number){
		var estadoRegisto = prompt("Insira as credenciais necessárias para eliminar o registo:");;

		if (estadoRegisto == "password"){
			if (confirm("Quer mesmo eliminar este registo?")){
				alert("O registo de caixa foi eliminado com sucesso!");
				this.router.navigate(['/func/caixas']);
			}
		}
	}

	// Pesquisa a um determinada marca
	pesquisaMarca(form){
		var marca = form.marca;
		
		if (marca != ""){
			this.tabelaRegistos = this.filtroService.pesquisaMarca(this.tabelaRegistos, marca);
			if (this.tabelaRegistos.length == 0)
				this.estadoTabela = false;
			else
				this.estadoTabela = true;
		}
		else{
			this.estadoTabela = true;
			this.tabelaRegistos = this.joinTableService.iniListaTableRegistosCaixa(this.tabelaCaixaRegistos, this.vinhos);
			this.clearForm();				
			alert("Pesquisa inválida!");
		}
	}

	// Filtros 
	onChange(){
		var filtro: any = this.FiltroForm.value;
		this.tabelaRegistos = this.joinTableService.iniListaTableRegistosCaixa(this.tabelaCaixaRegistos, this.vinhos);

		if (filtro.material != "" || filtro.capacidade != "" || filtro.tipoVinho != "" || filtro.categoria != ""){
			this.tabelaRegistos = this.filtroService.filtroMaterialCapacidadeTipoVinhoCategoria(filtro, this.tabelaRegistos);
			if (this.tabelaRegistos.length == 0)
				this.estadoTabela = false;
			else
				this.estadoTabela = true;
		}
		else{
			this.FiltroForm.controls['marca'].setValue('');
			this.tabelaRegistos = this.joinTableService.iniListaTableRegistosCaixa(this.tabelaCaixaRegistos, this.vinhos);
			this.estadoTabela = true;
		}
	}
	
	// Limpar pesquisa
	clearTabela(){
		this.tabelaRegistos = this.joinTableService.iniListaTableRegistosCaixa(this.tabelaCaixaRegistos, this.vinhos);
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
	public iniListaRegistos(){
		this.registos = [{
			id: 1,
			idCaixa: 2,
			data: new Date(2005,12,17),
			comentario: "2 c/ defeito",
			quantidade: -2      
		},
		{
			id: 2,
			idCaixa: 1,
			data: new Date(2012,6,2),
			comentario: "",
			quantidade: 12 
		},
		{
			id: 3,
			idCaixa: 1,
			data: new Date(2013,4,26),
			comentario: "12 c/ defeito",
			quantidade: 120 
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

// Interface que interliga 2 tabelas = Caixa + Registo de Caixa 
interface tableCaixaRegisto{
	id: number,
	idCaixa: number,
	capacidade: number,
	garrafas: number,
	material: string,
	tipoVinho: number,
	data: Date,
	comentario: string,
	quantidade: number
}

// Interface que interliga 2 tabelas = tableRegisto + Vinho 
interface tableRegisto{
	id: number,
	idCaixa: number,
	capacidade: number,
	garrafas: number,
	material: string,
	marca: string, // Atributo marca da tabela Tipo de vinho
	tipo: string, // Atributo tipo da tabela Tipo de Vinho
	categoria: string; // Atributo categoria da tabela Tipo de Vinho
	data: Date,
	comentario: string,
	quantidade: number
}