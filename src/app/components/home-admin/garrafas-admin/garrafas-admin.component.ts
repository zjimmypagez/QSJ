import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { Garrafa } from '../../../interfaces/garrafa';
import { TipoVinho } from '../../../interfaces/tipoVinho';

import { JoinTablesService } from '../../../services/funcoes-service/join-tables.service';
import { FiltrosService } from '../../../services/funcoes-service/filtros.service';

@Component({
	selector: 'app-garrafas-admin',
	templateUrl: './garrafas-admin.component.html',
	styleUrls: ['./garrafas-admin.component.css']
})
export class GarrafasAdminComponent implements OnInit {
	// Dados filtros
	FiltroForm: FormGroup;
	anos: number[] = [];
	categorias: string[] = [];
	capacidades: number[] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500, 3.000, 6.000, 12.000];
	estadoTabela: boolean = true;

	tipoVinhos: string[] = ["Verde", "Rosé", "Tinto", "Branco", "Espumante", "Quinta"];

  	// Lista de modelos de garrafa a ler da BD
	garrafas: Garrafa[];
	// Lista de modelos de caixa a ler da BD
	vinhos: TipoVinho[];
	// Tabela interligada entre garrafas e vinhos
	tabelaGarrafas: tableGarrafa[];

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
		this.iniListaVinhos();
		this.tabelaGarrafas = this.joinTableService.iniListaTableGarrafas(this.garrafas, this.vinhos);

		this.anos = this.filtroService.iniFiltroAno(this.garrafas);
		this.categorias = this.filtroService.iniFiltroCategoria(this.vinhos);
	}

	// Função responsável por selecionar o modelo de garrafa a ser editado
   editarGarrafa(id: number){
		this.router.navigate(['/admin/garrafas/editar', id]);
	}
	
	// Função responsável por eliminar o modelo de garrafa selecionado
	eliminarGarrafa(id: number){
		// Variavel que verifica se um modelo de garrafa pode ser eliminado (false) ou não (true)
		var estadoGarrafa: boolean = true;

		for (let i = 0; i < this.garrafas.length; i++){
			if (id == this.garrafas[i].id){
				var quantidade: number = this.garrafas[i].cRotulo + this.garrafas[i].sRotulo;
				if (quantidade > 0){
					estadoGarrafa = false;
				}
			}
		}

		if (estadoGarrafa){
			if (confirm("Quer mesmo eliminar este modelo?")){
				alert("O modelo de garrafa foi eliminado com sucesso!");
				this.router.navigate(['/admin/garrafas']);
			}
		}
		else
			alert("O modelo de garrafa que pretende eliminar existe, em stock, no armazém.")
	}

	// Pesquisa a um determinada marca
	pesquisaMarca(form){
		var marca = form.marca;
		
		if (marca != ""){
			this.tabelaGarrafas = this.filtroService.pesquisaMarca(this.tabelaGarrafas, marca);
			if (this.tabelaGarrafas.length == 0)
				this.estadoTabela = false;
			else
				this.estadoTabela = true;
		}
		else{
			this.estadoTabela = true;
			this.tabelaGarrafas = this.joinTableService.iniListaTableGarrafas(this.garrafas, this.vinhos);
			this.clearForm();				
			alert("Pesquisa inválida!");
		}
	}

	// Filtros 
	onChange(){
		var filtro: any = this.FiltroForm.value;
		this.tabelaGarrafas = this.joinTableService.iniListaTableGarrafas(this.garrafas, this.vinhos);
		this.FiltroForm.controls['marca'].setValue('');

		if (filtro.ano != "" || filtro.capacidade != "" || filtro.tipoVinho != "" || filtro.categoria != ""){
			this.tabelaGarrafas = this.filtroService.filtroAnoCapacidadeTipoVinhoCategoria(filtro, this.tabelaGarrafas);
			if (this.tabelaGarrafas.length == 0)
				this.estadoTabela = false;
			else
				this.estadoTabela = true;
		}
		else{
			this.FiltroForm.controls['marca'].setValue('');
			this.tabelaGarrafas = this.joinTableService.iniListaTableGarrafas(this.garrafas, this.vinhos);
			this.estadoTabela = true;
		}
	}

	// Limpar pesquisa
	clearTabela(){
		this.tabelaGarrafas = this.joinTableService.iniListaTableGarrafas(this.garrafas, this.vinhos);
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

// Interface que interliga 2 tabelas = Garrafa + Tipo de Vinho 
interface tableGarrafa{
	id: number,
	lote: string, // Atributo que junta, para mostrar, marca, ano e cuba
   cuba: number,
	ano: number,
	marca: string, // Atributo marca da tabela Tipo de vinho
	tipo: string, // Atributo tipo da tabela Tipo de Vinho
	categoria: string; // Atributo categoria da tabela Tipo de Vinho
   capacidade: number,
	cRotulo: number,
	sRotulo: number
}