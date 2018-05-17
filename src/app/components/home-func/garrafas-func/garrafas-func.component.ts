import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { Garrafa } from '../../../interfaces/garrafa';
import { TipoVinho } from '../../../interfaces/tipoVinho';
import { RegistoGarrafa } from '../../../interfaces/registoGarrafa';

import { JoinTablesService } from '../../../services/funcoes-service/join-tables.service';
import { FiltrosService } from '../../../services/funcoes-service/filtros.service';

@Component({
	selector: 'app-garrafas-func',
	templateUrl: './garrafas-func.component.html',
	styleUrls: ['./garrafas-func.component.css']
})
export class GarrafasFuncComponent implements OnInit {
	// Dados filtros
	FiltroForm: FormGroup;
	anos: number[] = [];
	capacidades: number[] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500, 3.000, 6.000, 12.000];
	tipoVinhos: string[] = ["Verde", "Rosé", "Tinto", "Branco", "Espumante", "Quinta"];
	categorias: string[] = [];
	estadoTabela: boolean = true;

	// Lista de modelos de garrafa a ler da BD
	garrafas: Garrafa[];
	// Lista de modelos de vinho a ler da BD
	vinhos: TipoVinho[];
	// Lista de registo de garrafas a ler da BD
	registos: RegistoGarrafa[];
	// Tabela interligada entre garrafa e registo garrafas
	tabelaGarrafaRegistos: tableGarrafaRegisto[];
	// Tabela interligada entre tabelaregisto garrafas e vinhos
	tabelaRegistos: tableRegisto[];

	constructor( private router: Router, private fb: FormBuilder, private filtroService: FiltrosService, private joinTableService: JoinTablesService ) { 
		this.FiltroForm = fb.group({
			'marca': ['', Validators.minLength(1)],
			'ano': ['', ],
			'capacidade': ['', ],
			'tipoVinho': ['', ],
			'categoria': ['', ]
		});
	}

	ngOnInit() {
		this.iniListaGarrafas();
		this.iniListaRegistos();
		this.tabelaGarrafaRegistos = this.joinTableService.iniListaTableGarrafaRegistos(this.garrafas, this.registos);		
		this.iniListaVinhos();
		this.tabelaRegistos = this.joinTableService.iniListaTableRegistosGarrafa(this.tabelaGarrafaRegistos, this.vinhos);
		this.anos = this.filtroService.iniFiltroAno(this.garrafas);
		this.categorias = this.filtroService.iniFiltroCategoria(this.vinhos);
	}

	// Função responsável por selecionar o registo de garrafa a ser editado
   editarRegisto(id: number){
		this.router.navigate(['/func/garrafas/editar', id]);
	}
	
	// Função responsável por eliminar o registo de garrafa selecionado
	eliminarRegisto(id: number){
		var estadoRegisto = prompt("Insira as credenciais necessárias para eliminar o registo:");;

		if (estadoRegisto == "password"){
			if (confirm("Quer mesmo eliminar este registo?")){
				alert("O registo de garrafa foi eliminado com sucesso!");
				this.router.navigate(['/func/garrafas']);
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
			this.tabelaRegistos = this.joinTableService.iniListaTableRegistosGarrafa(this.tabelaGarrafaRegistos, this.vinhos);
			this.clearForm();				
			alert("Pesquisa inválida!");
		}
	}

	// Filtros 
	onChange(){
		var filtro: any = this.FiltroForm.value;
		this.tabelaRegistos = this.joinTableService.iniListaTableRegistosGarrafa(this.tabelaGarrafaRegistos, this.vinhos);

		if (filtro.ano != "" || filtro.capacidade != "" || filtro.tipoVinho != "" || filtro.categoria != ""){
			this.tabelaRegistos = this.filtroService.filtroAnoCapacidadeTipoVinhoCategoria(filtro, this.tabelaRegistos);
			if (this.tabelaRegistos.length == 0)
				this.estadoTabela = false;
			else
				this.estadoTabela = true;
		}
		else{
			this.FiltroForm.controls['marca'].setValue('');
			this.tabelaRegistos = this.joinTableService.iniListaTableRegistosGarrafa(this.tabelaGarrafaRegistos, this.vinhos);
			this.estadoTabela = true;
		}
	}

	// Limpar pesquisa
	clearTabela(){
		this.tabelaRegistos = this.joinTableService.iniListaTableRegistosGarrafa(this.tabelaGarrafaRegistos, this.vinhos);
		this.estadoTabela = true;
		this.clearForm();
	}

	// Limpar Form
	clearForm(){
		this.FiltroForm.controls['marca'].setValue('');
		this.FiltroForm.controls['ano'].setValue('');
		this.FiltroForm.controls['capacidade'].setValue('');
		this.FiltroForm.controls['tipoVinho'].setValue('');
		this.FiltroForm.controls['categoria'].setValue('');
	}

	// Dados criados (A ser subsituido pela ligação à BD)
   public iniListaGarrafas(){
		this.garrafas = [{
			id: 1,
			cuba: 5000,
			ano: 2004,
			tipoVinho: 1,
			capacidade: 1.000,
			cRotulo: 250,
			sRotulo: 100
		},
		{
			id: 2,
			cuba: 10000,
			ano: 2015,
			tipoVinho: 3,
			capacidade: 0.750,
			cRotulo: 150,
			sRotulo: 0
		}];
	}

	// Dados criados (A ser subsituido pela ligação à BD)
	public iniListaRegistos(){
		this.registos = [{
			id: 1,
			idGarrafa: 2,
			data: new Date(2012,3,25),
			comentario: "2 c/ defeito",
			opcao: "Inserir",
			cRotulo: 24,
			sRotulo: 24     
		},
		{
			id: 2,
			idGarrafa: 1,
			data: new Date(2017,4,2),
			comentario: "",
			opcao: "Remover",
			cRotulo: 200,
      		sRotulo: 200  
		},
		{
			id: 3,
			idGarrafa: 1,
			data: new Date(2001,11,22),
			comentario: "5 partidas",
			opcao: "Rotular",
			cRotulo: 0,
      		sRotulo: 25 
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

// Interface que interliga 2 tabelas = Garrafa + Registo de Garrafa 
interface tableGarrafaRegisto{
	id: number,
	idGarrafa: number,	
	cuba: number,
	ano: number,
	tipoVinho: number,
	capacidade: number,
	data: Date,
	comentario: string,
	opcao: string,
	cRotulo: number,
	sRotulo: number
}

// Interface que interliga 2 tabelas = tableRegisto + Vinho 
interface tableRegisto{
	id: number,
	idGarrafa: number,
	lote: string, // Atributo que junta, para mostrar, marca, ano e cuba
	cuba: number,
	ano: number,
	marca: string, // Atributo marca da tabela Tipo de vinho
	tipo: string, // Atributo tipo da tabela Tipo de Vinho
	categoria: string; // Atributo categoria da tabela Tipo de Vinho
	capacidade: number,
	data: Date,
	comentario: string,
	opcao: string
	cRotulo: number,
	sRotulo: number
}