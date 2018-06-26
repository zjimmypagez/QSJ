import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { Observable } from "rxjs/observable";
import { Subscription } from 'rxjs/Subscription';

import { Garrafa, GarrafaEVinho } from '../../../interfaces/garrafa';
import { TipoVinho } from '../../../interfaces/tipoVinho';

import { JoinTablesService } from '../../../services/funcoes-service/join-tables.service';
import { FiltrosService } from '../../../services/funcoes-service/filtros.service';

import { VinhoServiceService } from '../../../services/vinho/vinho-service.service';
import { GarrafaServiceService } from '../../../services/garrafa/garrafa-service.service';

@Component({
	selector: 'app-garrafas-admin',
	templateUrl: './garrafas-admin.component.html',
	styleUrls: ['./garrafas-admin.component.css']
})
export class GarrafasAdminComponent implements OnInit, OnDestroy {
	FiltroForm: FormGroup;
	// Dados filtros
	anos: number[] = [];
	capacidades: number[] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500, 3.000, 6.000, 12.000];
	tipoVinhos: string[] = ["Verde", "Rosé", "Tinto", "Branco", "Espumante", "Quinta"];
	categorias: string[] = [];
	// Estado que determina se resulta alguma tabela do processo de filtragem
	estadoTabela: boolean = true;
	// Tabela auxiliar no processo de filtragem
	garrafasEVinhosFiltro: GarrafaEVinho[] = [];
  	// Lista de modelos de garrafa a ler da BD
	garrafasEVinhos: GarrafaEVinho[] = [];	
	// Lista auxiliar total de garrafas a ler da BD
	garrafasEVinhosAux: GarrafaEVinho[];
	// Lista de modelos de caixa a ler da BD
	vinhos: TipoVinho[] = [];

	private subVinhos: Subscription;
	private subGarrafasEVinhos: Subscription;

  	constructor( 
		  private router: Router, 
		  private fb: FormBuilder, 
		  private filtroService: FiltrosService, 
		  private joinTableService: JoinTablesService, 
		  private vinhoService: VinhoServiceService, 
		  private garrafaService: GarrafaServiceService 
		) { 
		this.FiltroForm = fb.group({
			'marca': ['', Validators.required],
			'ano': [0, ],
			'capacidade': [0, ],
			'tipoVinho': [0, ],
			'categoria': [0, ]
		});
	  }

	ngOnInit() {
		this.getVinhos();
		this.getGarrafasEVinhos();		
	}

	ngOnDestroy(){		
		this.subVinhos.unsubscribe();
		this.subGarrafasEVinhos.unsubscribe();		
	}

	// Subcrição do service VinhoService e obtenção dos dados de todos os vinhos provenientes da BD
	getVinhos(){
		this.subVinhos = this.vinhoService.getVinhos().subscribe(
			data => { 
				this.vinhos = data 
			},
			err => console.error(err),
			() => {
				this.categorias = this.filtroService.iniFiltroCategoria(this.vinhos);
			}
		);
	}

	// Subcrição do service GarrafaService e obtenção dos dados de todos as garrafas com a operação JOIN com os vinhos provenientes da BD
	getGarrafasEVinhos(){
		this.subGarrafasEVinhos = this.garrafaService.getGarrafasEVinhos().subscribe(
			data => { 
				this.garrafasEVinhos = data;
				this.garrafasEVinhosAux = data 
			},
			err => console.error(err),
			() => {
				this.anos = this.filtroService.iniFiltroAno(this.garrafasEVinhos);
			}
		);
	}

	// Eliminar garrafa por Id e recarregamento dos dados de todos as caixas provenientes da BD
	deleteGarrafaById(id: number){
		const deleteGarrafa = this.garrafaService.deleteGarrafaById(id).subscribe(
			data => data,
			err => console.error(err),
			() => {
				setTimeout(() => {
					alert("O modelo de garrafa foi eliminado com sucesso!");
					this.getGarrafasEVinhos();
					this.getVinhos();					
				}, 500);
			}
		);		
	}

	// Função responsável por selecionar o modelo de garrafa a ser editado
   editarGarrafa(id: number){
		this.router.navigate(['/admin/garrafas/editar', id]);
	}
	
	// Função responsável por eliminar o modelo de garrafa selecionado
	eliminarGarrafa(id: number){
		// Garrafa selecionada
		var garrafa: GarrafaEVinho = this.garrafasEVinhosAux.find(x => x.Id == id);
		var quantidade: number = garrafa.CRotulo + garrafa.SRotulo;
		if (quantidade == 0){
			if (confirm("Quer mesmo eliminar este modelo?")) this.deleteGarrafaById(id);
		}
		else alert("O modelo de garrafa que pretende eliminar existe, em stock, no armazém. [STOCK TOTAL] = " + quantidade);
	}

	// Pesquisa a um determinada marca
	pesquisaMarca(form){
		var marca = form.marca;		
		if (marca != ""){
			if (form.ano != 0 || form.capacidade != 0 || form.tipoVinho != 0 || form.categoria != 0){
				if (this.garrafasEVinhosFiltro.length != 0) this.garrafasEVinhos = this.filtroService.pesquisaMarca(this.garrafasEVinhosFiltro, marca);
				else this.garrafasEVinhos = this.filtroService.pesquisaMarca(this.garrafasEVinhos, marca);
			}
			else{
				this.reloadGarrafasEVinhos();
				this.garrafasEVinhos = this.filtroService.pesquisaMarca(this.garrafasEVinhos, marca);
			}
			if (this.garrafasEVinhos.length == 0){
				this.reloadGarrafasEVinhos();
				this.estadoTabela = false;
			}
			else this.estadoTabela = true;
		}
	}

	// Filtros 
	onChange(){
		var filtro: any = this.FiltroForm.value;
		this.reloadGarrafasEVinhos();
		if (filtro.marca != "") this.garrafasEVinhos = this.filtroService.pesquisaMarca(this.garrafasEVinhos, filtro.marca);
		if (filtro.ano != "" || filtro.capacidade != "" || filtro.tipoVinho != "" || filtro.categoria != ""){
			this.garrafasEVinhosFiltro = this.filtroService.filtroAnoCapacidadeTipoVinhoCategoria(filtro, this.garrafasEVinhos);
			this.garrafasEVinhos = this.garrafasEVinhosFiltro;
			if (this.garrafasEVinhos.length == 0) this.estadoTabela = false;
			else this.estadoTabela = true;
		}
		else{
			if (filtro.marca != "") this.garrafasEVinhos = this.filtroService.pesquisaMarca(this.garrafasEVinhos, filtro.marca);
			else this.reloadGarrafasEVinhos();
			this.garrafasEVinhosFiltro = [];
			this.estadoTabela = true;
		}
	}

	// Limpar pesquisa
	clearTabela(){
		this.reloadGarrafasEVinhos();
		this.estadoTabela = true;
		this.clearForm();
	}

	// Limpar Form
	clearForm(){
		this.FiltroForm.controls['marca'].reset('');
		this.FiltroForm.controls['ano'].reset(0);
		this.FiltroForm.controls['capacidade'].reset(0);
		this.FiltroForm.controls['tipoVinho'].reset(0);
		this.FiltroForm.controls['categoria'].reset(0);
	}

	// Recarregamento de todos as garrafas
	reloadGarrafasEVinhos(){
		this.garrafasEVinhos = [];
		this.garrafasEVinhos = this.garrafasEVinhosAux;
	}

}