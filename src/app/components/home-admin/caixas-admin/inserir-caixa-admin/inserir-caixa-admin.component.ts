import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { Caixa } from '../../../../interfaces/caixa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

import { OrdenarTablesService } from '../../../../services/funcoes-service/ordenar-tables.service';

import { ValidatorModelo } from '../../../../validators/validator-caixas';

@Component({
	selector: 'app-inserir-caixa-admin',
	templateUrl: './inserir-caixa-admin.component.html',
	styleUrls: ['./inserir-caixa-admin.component.css']
})
export class InserirCaixaAdminComponent implements OnInit {
	CaixaForm: FormGroup;

	materiais: string [] = ['Cartão', 'Madeira'];
	capacidades: number[] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500, 3.000, 6.000, 12.000];
	// Lista que, consoante o material escolhido, apresenta a quantidade pré-definida
	garrafas: number[] = [];

	// Lista de modelos de caixa a ler da BD
	caixas: Caixa[];
	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[];

	constructor( private router: Router, private fb: FormBuilder, private ordenarTableService: OrdenarTablesService ) { }

	ngOnInit() {
		this.iniListaCaixas();
		this.iniListaVinhos();
		this.vinhos = this.ordenarTableService.ordenarVinhos(this.vinhos);
		this.iniCaixaForm();
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
		var caixa: any = form;
		alert("O modelo de caixa foi criado com sucesso!");
		this.router.navigate(['/admin/caixas']);
	}

	// Limpa os dados do Formulário
	clearDados(){
		this.clearForm();
	}

	// Material selecionado
	onChange(material){
		if (material == this.materiais[0]/* Cartão */){
			this.garrafas = [2, 3, 6, 12];
			this.CaixaForm.controls['garrafas'].setValue('');
		}
		else{
			if (material == this.materiais[1]/* Madeira */){
				this.garrafas = [1, 2, 3];
				this.CaixaForm.controls['garrafas'].setValue('');
			}
			else{
				this.garrafas = [];
				this.CaixaForm.controls['garrafas'].setValue('');
			}
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