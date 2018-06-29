import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from "rxjs/observable";
import { Subscription } from "rxjs/Subscription";

import { TipoVinho } from '../../../interfaces/tipoVinho';
import { Caixa } from '../../../interfaces/caixa';
import { Garrafa } from '../../../interfaces/garrafa';

import { FiltrosService } from '../../../services/funcoes-service/filtros.service';
import { OrdenarTablesService } from '../../../services/funcoes-service/ordenar-tables.service';

import { VinhoServiceService } from '../../../services/vinho/vinho-service.service';
import { CaixaServiceService } from '../../../services/caixa/caixa-service.service';
import { GarrafaServiceService } from '../../../services/garrafa/garrafa-service.service';

@Component({
	selector: 'app-vinhos-admin',
	templateUrl: './vinhos-admin.component.html',
	styleUrls: ['./vinhos-admin.component.css']
})
export class VinhosAdminComponent implements OnInit, OnDestroy {
	FiltroForm: FormGroup;
	// Dados filtros
	tipoVinhos: string[] = ["Verde", "Rosé", "Tinto", "Branco", "Espumante", "Quinta"];
	categorias: string[] = [];
	// Estado que determina se resulta alguma tabela do processo de filtragem
	estadoTabela: boolean = true;
	// Tabela auxiliar no processo de filtragem
	tabelaFiltro: TipoVinho[] = [];
	// Lista de tipos de vinho a ler da BD
	vinhos: TipoVinho[] = [];
	// Lista auxiliar total de vinhos a ler da BD
	vinhosAux: TipoVinho[] = [];
	// Lista de modelos caixa a ler da BD
	caixas: Caixa[] = [];
	// Lista de modelos garrafa a ler da BD
	garrafas: Garrafa[] = [];

	private subVinhos: Subscription;
	private subCaixas: Subscription;
	private subGarrafas: Subscription;

	constructor( 
		private router: Router, 
		private fb: FormBuilder, 
		private filtroService: FiltrosService, 
		private ordenarService: OrdenarTablesService, 
		private vinhoService: VinhoServiceService, 
		private caixaService: CaixaServiceService, 
		private garrafaService: GarrafaServiceService 
	) { 
		this.FiltroForm = fb.group({
			'marca': ['', Validators.required],
			'tipoVinho': [0, ],
			'categoria': [0, ]
		});
	}

	ngOnInit() {
		this.getVinhos();
		this.getCaixas();
		this.getGarrafas();
	}

	ngOnDestroy(){
		this.subVinhos.unsubscribe();
		this.subCaixas.unsubscribe();
		this.subGarrafas.unsubscribe();
	}

	// Subcrição do service VinhoService e obtenção dos dados de todos os vinhos provenientes da BD
	getVinhos(){
		this.subVinhos = this.vinhoService.getVinhos().subscribe(
			data => { 
				this.vinhos = data;
				this.vinhosAux = data 
			},
			err => console.error(err),
			() => {
				// Ordenar o array após a leitura dos dados a partir da BD
				this.ordenarService.ordenarTabelaMV(this.vinhos);
				this.ordenarService.ordenarTabelaMV(this.vinhosAux);
				this.categorias = this.filtroService.iniFiltroCategoria(this.vinhos);
			}
		);
	}

	// Subcrição do service CaixaService e obtenção dos dados de todas as caixas provenientes da BD
	getCaixas(){
		this.subCaixas = this.caixaService.getCaixas().subscribe(
			data => { 
				this.caixas = data 
			},
			err => console.error(err)
		);
	}

	// Subcrição do service GarrafaService e obtenção dos dados de todas as garrafas provenientes da BD
	getGarrafas(){
		this.subGarrafas = this.garrafaService.getGarrafas().subscribe(
			data => { 
				this.garrafas = data 
			},
			err => console.error(err)
		);
	}

	// Eliminar vinho por Id e recarregamento dos dados de todos os vinhos provenientes da BD
	deleteVinhoById(id: number){
		const deleteVinho = this.vinhoService.deleteVinhoById(id).subscribe(
			data => data,
			err => console.error(err),
			() => {
				setTimeout(() => {
					alert("O tipo de vinho foi eliminado com sucesso!");
					this.getVinhos();
					this.getCaixas();
					this.getGarrafas();					
				}, 500);
			}
		);		
	}

	// Função responsável por selecionar o tipo de vinho a ser editado
   editarVinho(id: number){
		this.router.navigate(['/admin/vinhos/editar', id]);
	}
	
	// Função responsável por eliminar o tipo de vinho selecionado
	eliminarVinho(id: number){
		// Array com caixas com o tipo de vinho selecionado
		var caixasComIdVinho: Caixa[] = this.caixas.filter(x => x.TipoDeVinho_ID == id);
		// Array com garrafas com o tipo de vinho selecionado
		var garrafasComIdVinho: Garrafa[] = this.garrafas.filter(x => x.TipoDeVinho_ID == id);
		if (caixasComIdVinho.length == 0 && garrafasComIdVinho.length == 0){
			if (confirm("Quer mesmo eliminar este tipo de vinho?")) this.deleteVinhoById(id);
		}
		else{
			if (caixasComIdVinho.length != 0 && garrafasComIdVinho.length != 0) alert("O tipo de vinho que pretende eliminar está em uso, quer em modelos de garrafa quer em modelos de caixa.");
			else{
				if (caixasComIdVinho.length != 0) alert("O tipo de vinho que pretende eliminar está em uso, em modelos de caixa.");
				else alert("O tipo de vinho que pretende eliminar está em uso, em modelos de garrafa.");
			}
		}
	}

	// Pesquisa a um determinada marca
	pesquisaMarca(form){
		var marca = form.marca;		
		if (marca != ""){
			if (this.tabelaFiltro.length != 0) this.vinhos = this.filtroService.pesquisaMarca(this.tabelaFiltro, marca);
			else this.vinhos = this.filtroService.pesquisaMarca(this.vinhos, marca);
			if (this.vinhos.length == 0) {
				this.reloadVinhos();
				this.estadoTabela = false;
			}				
			else this.estadoTabela = true;
		}
	}

	// Filtros 
	onChange(){
		var filtro: any = this.FiltroForm.value;
		this.reloadVinhos();
		if (filtro.marca != "") this.vinhos = this.filtroService.pesquisaMarca(this.vinhos, filtro.marca);
		if (filtro.tipoVinho != 0 || filtro.categoria != 0){
			this.tabelaFiltro = this.filtroService.filtroTipoVinhoCategoria(filtro, this.vinhos);
			this.vinhos = this.tabelaFiltro;
			if (this.vinhos.length == 0) this.estadoTabela = false;
			else this.estadoTabela = true;
		}
		else{
			if (filtro.marca != "") this.vinhos = this.filtroService.pesquisaMarca(this.vinhos, filtro.marca);
			else this.reloadVinhos();
			this.tabelaFiltro = [];
			this.estadoTabela = true;
		}
	}

	// Limpar pesquisa
	clearTabela(){
		this.reloadVinhos();
		this.estadoTabela = true;
		this.clearForm();
	}

	// Limpar Form
	clearForm(){
		this.FiltroForm.controls['marca'].reset('');
		this.FiltroForm.controls['tipoVinho'].reset(0);
		this.FiltroForm.controls['categoria'].reset(0);
	}

	// Recarregamento de todos os vinhos
	reloadVinhos(){
		this.vinhos = [];
		this.vinhos = this.vinhosAux;
	}

}
