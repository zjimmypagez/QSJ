import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from "rxjs/Observable";
import { Subscription } from 'rxjs/Subscription';

import { Caixa } from '../../../../interfaces/caixa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

import { OrdenarTablesService } from '../../../../services/funcoes-service/ordenar-tables.service';

import { ValidatorModelo } from '../../../../validators/validator-caixas';

import { CaixaServiceService } from '../../../../services/caixa/caixa-service.service';
import { VinhoServiceService } from '../../../../services/vinho/vinho-service.service';

@Component({
	selector: 'app-editar-caixa-admin',
	templateUrl: './editar-caixa-admin.component.html',
	styleUrls: ['./editar-caixa-admin.component.css']
})
export class EditarCaixaAdminComponent implements OnInit, OnDestroy {
	// Selecionar o ID da caixa selecionada
	id: number;
  	private sub: any;
	CaixaForm: FormGroup;
	// DropDowns
	materiais: string [] = ['Cartão', 'Madeira'];
	capacidades: number [] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500];
	// Lista que, consoante o material escolhido, apresenta a quantidade pré-definida
	garrafas: number[] = [];
	// Caixa selecionada
	caixa: Caixa;	
	// Lista de modelos de caixa a ler da BD
	caixas: Caixa[] = [];
	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[] = [];

	private subVinhos: Subscription;	
	private subCaixas: Subscription;	

	constructor( private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private ordenarTableService: OrdenarTablesService, private caixaService: CaixaServiceService, private vinhoService: VinhoServiceService ) { }

	ngOnInit() {
		// Subscrição dos parametros do modelo da caixa escolhido para editar
		this.sub = this.route.params.subscribe(
			params => { this.id = +params['id']; }
		)
		this.getVinhos();
		this.getCaixas();
		this.iniCaixaForm();
	}

	ngOnDestroy(){
		this.subVinhos.unsubscribe();
		this.subCaixas.unsubscribe();
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

	// Subcrição do service CaixaService e obtenção dos dados de todas as caixas provenientes da BD
	getCaixas(){
		this.subCaixas = this.caixaService.getCaixas().subscribe(
			data => { 
				this.caixas = data 
			},
			err => console.error(err),
			() => {
				this.iniCaixaForm();
				this.getSelectedCaixa();
			}
		);
	}

	// Editar uma caixa selecionada
	editCaixa(editCaixa){
		const editCaixas = this.caixaService.editCaixa(editCaixa).subscribe(
			data => data,
			err => console.error(err),
			() => {		
				setTimeout(() => {
					alert("O modelo de caixa foi editado com sucesso!");	
					this.router.navigate(['/admin/caixas']);					
				}, 1000);	
			}
		);
	}

	// Informação do utilizador selecionado
	getSelectedCaixa(){
		this.caixa = this.caixas.find(x => x.ID == this.id);
		this.onChange(this.caixa.Material);
		this.resetForm(this.caixa);
	}

	// Inicializar objeto form CaixaForm
	iniCaixaForm(){
		this.CaixaForm = this.fb.group({
			'capacidade': ['', Validators.required],
			'material': ['', Validators.required],
			'garrafas': ['', Validators.required],
			'tipoVinho': ['', Validators.required]
			}, { 
				validator: ValidatorModelo(this.caixas) 
			}
		);
	}

	// Editar o modelo de caixa após verificações
	editarCaixa(form){
		var editCaixa: Caixa = {			
			ID: this.caixa.ID,
			TipoDeVinho_ID: form.tipoVinho,
			Material: form.material,
			NGarrafas: form.garrafas,
			Stock: this.caixa.Stock,
			CapacidadeGarrafa: form.capacidade
		}
		if (confirm("Tem a certeza que pretende editar as características deste modelo? [Quantidade em stock] = " + editCaixa.Stock)) this.editCaixa(editCaixa);	
	}

	// Reset dos dados da form
	clearDados(){
		this.resetForm(this.caixa);
	}

	// Material selecionado
	onChange(material){
		this.CaixaForm.controls['garrafas'].reset('');
		this.CaixaForm.controls['garrafas'].markAsTouched();
		if (material == this.materiais[0]/* Cartão */) this.garrafas = [2, 3, 6, 12];
		else{
			if (material == this.materiais[1]/* Madeira */) this.garrafas = [1, 2, 3];			
			else this.garrafas = []; 
		}
	}

	// Coloca a form com os dados pre-selecionados
	resetForm(caixa: Caixa){
		this.CaixaForm.controls['capacidade'].setValue(caixa.CapacidadeGarrafa);
		this.CaixaForm.controls['material'].setValue(caixa.Material);
		this.CaixaForm.controls['garrafas'].setValue(caixa.NGarrafas);
		this.CaixaForm.controls['tipoVinho'].setValue(caixa.TipoDeVinho_ID);
	}

}