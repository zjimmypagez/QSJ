import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { TipoVinho } from '../../../interfaces/tipoVinho';
import { Caixa } from '../../../interfaces/caixa';
import { Garrafa } from '../../../interfaces/garrafa';

import { FiltrosService } from '../../../services/funcoes-service/filtros.service';
import { JoinTablesService } from '../../../services/funcoes-service/join-tables.service';
import { OrdenarTablesService } from '../../../services/funcoes-service/ordenar-tables.service';

@Component({
	selector: 'app-vinhos-admin',
	templateUrl: './vinhos-admin.component.html',
	styleUrls: ['./vinhos-admin.component.css']
})
export class VinhosAdminComponent implements OnInit {
	// Dados filtros
	FiltroForm: FormGroup;
	tipoVinhos: string[] = ["Verde", "Rosé", "Tinto", "Branco", "Espumante", "Quinta"];
	categorias: string[] = [];
	estadoTabela: boolean = true;

	// Lista de tipos de vinho a ler da BD
	vinhos: TipoVinho[];
	// Lista de modelos caixa a ler da BD
	caixas: Caixa[];
	// Lista de modelos garrafa a ler da BD
	garrafas: Garrafa[];

	tabelaFiltro: TipoVinho[] = [];

	constructor( private router: Router, private fb: FormBuilder, private filtroService: FiltrosService, private ordenarService: OrdenarTablesService ) { 
		this.FiltroForm = fb.group({
			'marca': ['', ],
			'tipoVinho': [0, ],
			'categoria': [0, ]
		});
	}

	ngOnInit() {
		this.iniListaVinhos();
		this.iniListaCaixas();
		this.iniListaGarrafas();
		this.categorias = this.filtroService.iniFiltroCategoria(this.vinhos);
	}

	// Função responsável por selecionar o tipo de vinho a ser editado
   editarVinho(id: number){
		this.router.navigate(['/admin/vinhos/editar', id]);
	}
	
	// Função responsável por eliminar o tipo de vinho selecionado
	eliminarVinho(id: number){
		// Variavel que verifica se um vinho pode ser eliminado (false) ou não (true)
		var estadoVinho: boolean = true;
		var erro: number[] = [0, 0, 0]; // Index: 0 - existe em modelos de garrafas
												  // Index: 1 - existe em modelos de caixas
												  // Index: 2 - existe em ambos os modelos
		// Ver se o tipo de vinho selecionado esta em uso em modelos de garrafa
		for (let i = 0; i < this.garrafas.length; i++){
			if (this.garrafas[i].tipoVinho == id){
				estadoVinho = false;
				erro[0] = 1;
			}
		}
		// Ver se o tipo de vinho selecionado esta em uso em modelos de caixa
		for (let i = 0; i < this.caixas.length; i++){
			if (this.caixas[i].tipoVinho == id){
				estadoVinho = false;
				erro[1] = 1;
			}
		}
		if ((erro[0] * erro[1]) == 1) erro[2] = 1;
		if (estadoVinho){
			if (confirm("Quer mesmo eliminar este tipo de vinho?")){
				alert("O tipo de vinho foi eliminado com sucesso!");
				this.router.navigate(['/admin/vinhos']);
			}
		}
		else{
			if (erro[2] == 1) alert("O tipo de vinho que pretende eliminar está em uso, quer em modelos de garrafa quer em modelos de caixa.");
			else
				if (erro[0] == 1) alert("O tipo de vinho que pretende eliminar está em uso, em modelos de garrafa.");
				if (erro[1] == 1) alert("O tipo de vinho que pretende eliminar está em uso, em modelos de caixa.");			
		}
	}

	// Pesquisa a um determinada marca
	pesquisaMarca(form){
		var marca = form.marca;		
		if (marca != ""){
			if (this.tabelaFiltro.length != 0) this.vinhos = this.filtroService.pesquisaMarca(this.tabelaFiltro, marca);
			else this.vinhos = this.filtroService.pesquisaMarca(this.vinhos, marca);
			if (this.vinhos.length == 0) {
				this.iniListaVinhos();
				this.estadoTabela = false;
			}				
			else this.estadoTabela = true;
		}
		else {
			this.estadoTabela = true;
			if (this.tabelaFiltro.length != 0) this.vinhos = this.tabelaFiltro;
			alert("Pesquisa inválida!");
		}
	}

	// Filtros 
	onChange(){
		var filtro: any = this.FiltroForm.value;
		this.iniListaVinhos();
		if (filtro.marca != "") this.vinhos = this.filtroService.pesquisaMarca(this.vinhos, filtro.marca);
		if (filtro.tipoVinho != 0 || filtro.categoria != 0){
			this.tabelaFiltro = this.filtroService.filtroTipoVinhoCategoria(filtro, this.vinhos);
			this.vinhos = this.tabelaFiltro;
			if (this.vinhos.length == 0) this.estadoTabela = false;
			else this.estadoTabela = true;
		}
		else{
			if (filtro.marca != "") this.vinhos = this.filtroService.pesquisaMarca(this.vinhos, filtro.marca);
			else this.iniListaVinhos();
			this.tabelaFiltro = [];
			this.estadoTabela = true;
		}
	}

	// Limpar pesquisa
	clearTabela(){
		this.iniListaVinhos();
		this.estadoTabela = true;
		this.clearForm();
	}

	// Limpar Form
	clearForm(){
		this.FiltroForm.controls['marca'].reset('');
		this.FiltroForm.controls['tipoVinho'].reset(0);
		this.FiltroForm.controls['categoria'].reset(0);
	}

	// Dados criados (A ser subsituido pela ligação à BD)
	iniListaVinhos(){
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
		this.ordenarService.ordenarTabelaMV(this.vinhos);
	}

	// Dados criados (A ser subsituido pela ligação à BD)
	iniListaCaixas(){
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
	iniListaGarrafas(){
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

}
