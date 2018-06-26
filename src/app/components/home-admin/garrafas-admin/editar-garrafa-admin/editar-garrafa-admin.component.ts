import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from "rxjs/Observable";
import { Subscription } from 'rxjs/Subscription';

import { Garrafa } from '../../../../interfaces/garrafa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

import { OrdenarTablesService } from '../../../../services/funcoes-service/ordenar-tables.service';

import { ValidatorModelo } from '../../../../validators/validator-garrafas';

import { VinhoServiceService } from '../../../../services/vinho/vinho-service.service';
import { GarrafaServiceService } from '../../../../services/garrafa/garrafa-service.service';

@Component({
	selector: 'app-editar-garrafa-admin',
	templateUrl: './editar-garrafa-admin.component.html',
	styleUrls: ['./editar-garrafa-admin.component.css']
})
export class EditarGarrafaAdminComponent implements OnInit, OnDestroy {
	// Garrafa selecionada
	id: number;
	private sub: any;	
	GarrafaForm: FormGroup;
	// DropDowns
	capacidades: number[] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500, 3.000, 6.000, 12.000];
	// Garrafa selecionada
	garrafa: Garrafa;
	// Lista de modelos de caixa a ler da BD
	garrafas: Garrafa[] = [];
	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[] = [];

	private subVinhos: Subscription;
	private subGarrafas: Subscription;

	constructor( 
		private route: ActivatedRoute, 
		private router: Router, 
		private fb: FormBuilder, 
		private ordenarTableService: OrdenarTablesService, 
		private vinhoService: VinhoServiceService, 
		private garrafaService: GarrafaServiceService 
	) { }

	ngOnInit() {
		// Subscrição dos parametros do modelo da garrafa escolhido para editar		
		this.sub = this.route.params.subscribe(
			params => { this.id = +params['id']; }
		)
		this.getVinhos();
		this.getGarrafas();
		this.iniGarrafaForm();			
	}

	ngOnDestroy(){
		this.subVinhos.unsubscribe();
		this.subGarrafas.unsubscribe();
	}

	// Subcrição do service VinhoService e obtenção dos dados de todos os vinhos provenientes da BD
	getVinhos(){
		this.subVinhos = this.vinhoService.getVinhos().subscribe(
			data => { 
				this.vinhos = data 
			},
			err => console.error(err),
			() => {
				this.vinhos = this.ordenarTableService.ordenarTabelaMV(this.vinhos);
			}
		);
	}

	// Subcrição do service GarrafaService e obtenção dos dados de todas as garrafas provenientes da BD
	getGarrafas(){
		this.subGarrafas = this.garrafaService.getGarrafas().subscribe(
			data => { 
				this.garrafas = data 
			},
			err => console.error(err),
			() => {
				this.iniGarrafaForm();
				this.getSelectedGarrafa();
			}
		);
	}

	// Editar uma garrafa selecionada
	editGarrafa(editGarrafa){
		const editGarrafas = this.garrafaService.editGarrafa(editGarrafa).subscribe(
			data => data,
			err => console.error(err),
			() => {
				setTimeout(() => {
					alert("O modelo de garrafa foi editado com sucesso!");				
					this.router.navigate(['/admin/garrafas']);					
				}, 500);
			}
		);
	}

	// Informação do utilizador selecionado
	getSelectedGarrafa(){
		this.garrafa = this.garrafas.find(x => x.Id == this.id);
		this.resetForm(this.garrafa);
	}

	// Inicializar objeto form GarrafaForm
	iniGarrafaForm(){
		this.GarrafaForm = this.fb.group({
			'cuba': ['', Validators.compose([Validators.required, Validators.min(1)])],
			'ano': ['', Validators.compose([Validators.required, Validators.min(1900), Validators.max(2100)])],
			'tipoVinho': ['', Validators.required],
			'capacidade': ['', Validators.required]
			}, { 
				validator: ValidatorModelo(this.garrafas) 
			}
		);
	}

	// Editar o modelo de caixa após verificações
	editarGarrafa(form){
		var editGarrafa: Garrafa = {
			Id: this.garrafa.Id,
			TipoDeVinho_ID: form.tipoVinho,
			Pipa: form.cuba,
			Ano: form.ano,
			Capacidade: form.capacidade,
			CRotulo: this.garrafa.CRotulo,
			SRotulo: this.garrafa.SRotulo
		}
		var qnt: number = editGarrafa.CRotulo + editGarrafa.SRotulo;
		if (confirm("Tem a certeza que pretende editar as características deste modelo? [Quantidade em stock] = " +  qnt)) this.editGarrafa(editGarrafa);	
	}

	// Reset dos dados da form
	clearDados(){
		this.resetForm(this.garrafa);
	}

	// Coloca a form com os dados pre-selecionados
	resetForm(garrafa: Garrafa){
		this.GarrafaForm.controls['cuba'].setValue(garrafa.Pipa);
		this.GarrafaForm.controls['ano'].setValue(garrafa.Ano);
		this.GarrafaForm.controls['tipoVinho'].setValue(garrafa.TipoDeVinho_ID);
		this.GarrafaForm.controls['capacidade'].setValue(garrafa.Capacidade);
	}

}