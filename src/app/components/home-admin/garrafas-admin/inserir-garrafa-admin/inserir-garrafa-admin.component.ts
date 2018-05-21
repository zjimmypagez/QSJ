import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { Garrafa } from '../../../../interfaces/garrafa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

import { OrdenarTablesService } from '../../../../services/funcoes-service/ordenar-tables.service';

import { ValidatorModelo } from '../../../../validators/validator-garrafas';

@Component({
	selector: 'app-inserir-garrafa-admin',
	templateUrl: './inserir-garrafa-admin.component.html',
	styleUrls: ['./inserir-garrafa-admin.component.css']
})
export class InserirGarrafaAdminComponent implements OnInit {
	GarrafaForm: FormGroup;

	capacidades: number[] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500, 3.000, 6.000, 12.000];

	// Lista de modelos de caixa a ler da BD
	garrafas: Garrafa[];
	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[];

	constructor( private router: Router, private fb: FormBuilder, private ordenarTableService: OrdenarTablesService ) { }

	ngOnInit() {
		this.iniListaGarrafas();
		this.iniListaVinhos();
		this.vinhos = this.ordenarTableService.ordenarVinhos(this.vinhos);
		this.iniGarrafaForm();
	}

	// Inicializar objeto form GarrafaForm
	iniGarrafaForm(){
		this.GarrafaForm = this.fb.group({
			'cuba': ['', Validators.compose([Validators.required, Validators.min(1)])],
			'ano': ['', Validators.compose([Validators.required, Validators.min(1900), Validators.max(2100)])],
			'tipoVinho': ['', Validators.required],
			'capacidade': ['', Validators.required]
		}, { validator: ValidatorModelo(this.garrafas) }
		);
	}

	// Criação do novo modelo de garrafa após verificações 
	novaGarrafa(form){
		var garrafa: any = form;
		alert("O modelo de garrafa foi criado com sucesso!");
		this.router.navigate(['/admin/garrafas']);
	}

	// Limpa os dados do Formulário
	clearDados(){
		this.clearForm();
	}

	// Função que limpa os dados do form GarrafaForm
	clearForm(){
		this.GarrafaForm.controls['cuba'].reset('');
		this.GarrafaForm.controls['ano'].reset('');
		this.GarrafaForm.controls['tipoVinho'].reset('');
		this.GarrafaForm.controls['capacidade'].reset('');
		this.GarrafaForm.markAsUntouched();
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
	}

}