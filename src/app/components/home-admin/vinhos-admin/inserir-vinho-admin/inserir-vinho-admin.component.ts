import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { TipoVinho } from '../../../../interfaces/tipoVinho';

import { ValidatorVinho } from '../../../../validators/validator-vinho';

@Component({
	selector: 'app-inserir-vinho-admin',
	templateUrl: './inserir-vinho-admin.component.html',
	styleUrls: ['./inserir-vinho-admin.component.css']
})
export class InserirVinhoAdminComponent implements OnInit {
  	VinhoForm: FormGroup;

	tipoVinhos: string[] = ["Verde", "Rosé", "Tinto", "Branco", "Espumante", "Quinta"];

	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[];

	constructor( private router: Router, private fb: FormBuilder ) { }

	ngOnInit() {
		this.iniListaVinhos();
		this.iniVinhoForm();
	}

	// Inicializar o objeto form VinhoForm
	iniVinhoForm(){
		this.VinhoForm = this.fb.group({
			'marca': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
			'tipo': ['', Validators.required],
			'categoria': ['', Validators.minLength(5)]
		}, { validator: ValidatorVinho(this.vinhos) }
		);
	}

	// Criação do tipo de vinho após verificações 
	novoVinho(form){
		var vinho: any = form;
		alert("O tipo de vinho foi criado com sucesso!");
		this.router.navigate(['/admin/vinhos']);
	}

	// Limpa os dados do Formulário
	clearDados(){
		this.clearForm();
	}

	// Função que limpa os dados do form VinhoForm
	clearForm(){
		this.VinhoForm.controls['marca'].reset('');
		this.VinhoForm.controls['tipo'].reset('');
		this.VinhoForm.controls['categoria'].reset('');
		this.VinhoForm.markAsUntouched();
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

interface formVinho{
	marca: string,
	tipo: string,
	categoria: string
}