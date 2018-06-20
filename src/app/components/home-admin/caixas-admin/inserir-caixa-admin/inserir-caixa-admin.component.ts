import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { Observable } from "rxjs/observable";
import { Subscription } from 'rxjs/Subscription';

import { Caixa, CaixaSIdStock } from '../../../../interfaces/caixa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

import { OrdenarTablesService } from '../../../../services/funcoes-service/ordenar-tables.service';

import { ValidatorModelo } from '../../../../validators/validator-caixas';

import { CaixaServiceService } from '../../../../services/caixa/caixa-service.service';
import { VinhoServiceService } from '../../../../services/vinho/vinho-service.service';

@Component({
	selector: 'app-inserir-caixa-admin',
	templateUrl: './inserir-caixa-admin.component.html',
	styleUrls: ['./inserir-caixa-admin.component.css']
})
export class InserirCaixaAdminComponent implements OnInit, OnDestroy {
	CaixaForm: FormGroup;
	// DropDowns
	materiais: string [] = ['Cartão', 'Madeira'];
	capacidades: number[] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500, 3.000, 6.000, 12.000];
	// Lista que, consoante o material escolhido, apresenta a quantidade pré-definida
	garrafas: number[] = [];
	// Lista de modelos de caixa a ler da BD
	caixas: Caixa[] = [];
	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[] = [];

	private subs: Subscription;

	constructor( private router: Router, private fb: FormBuilder, private ordenarTableService: OrdenarTablesService, private caixaService: CaixaServiceService, private vinhoService: VinhoServiceService ) { }

	ngOnInit() {
		this.getVinhos();
		this.getCaixas();
		this.iniCaixaForm();
	}

	ngOnDestroy(){
		this.subs.unsubscribe();
	}

	// Subcrição do service VinhoService e obtenção dos dados de todos os vinhos provenientes da BD
	getVinhos(){
		this.subs = this.vinhoService.getVinhos().subscribe(
			(data: TipoVinho[]) => { this.vinhos = data },
			err => console.error(err),
			() => {
				this.vinhos = this.ordenarTableService.ordenarTabelaMV(this.vinhos);
			}
		);
	}

	// Subcrição do service CaixaService e obtenção dos dados de todas as caixas provenientes da BD
	getCaixas(){
		this.subs = this.caixaService.getCaixas().subscribe(
			(data: Caixa[]) => { this.caixas = data },
			err => console.error(err),
			() => {
				this.iniCaixaForm();
			}
		);
	}

	// Inserir nova caixa
	createCaixa(newCaixa: CaixaSIdStock){
		this.subs = this.caixaService.createCaixa(newCaixa).subscribe(
			data => data,
			err => console.error(err),
			() => {
				this.router.navigate(['/admin/caixas']);
			}
		);
	}

	// Inicializar objeto form CaixaForm
	iniCaixaForm(){
		this.CaixaForm = this.fb.group({
			'capacidade': ['', Validators.required],
			'material': ['', Validators.required],
			'garrafas': ['', Validators.required],
			'tipoVinho': ['', Validators.required]
			}, { validator: ValidatorModelo(this.caixas) }
		);
	}

	// Criação do novo modelo de caixa após verificações 
	novaCaixa(form){
		var newCaixa: CaixaSIdStock = {
			TipoDeVinho_ID: form.tipoVinho,
			Material: form.material,
			NGarrafas: form.garrafas,
			CapacidadeGarrafa: form.capacidade
		}
		this.createCaixa(newCaixa);
		alert("O modelo de caixa foi criado com sucesso!");
	}

	// Limpa os dados do Formulário
	clearDados(){
		this.clearForm();
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

	// Função que limpa os dados do form CaixaForm
	clearForm(){
		this.CaixaForm.controls['capacidade'].reset('');
		this.CaixaForm.controls['material'].reset('');
		this.CaixaForm.controls['garrafas'].reset('');
		this.CaixaForm.controls['tipoVinho'].reset('');
		this.CaixaForm.markAsUntouched();
	}

}