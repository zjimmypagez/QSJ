import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { TipoVinho } from '../../../../interfaces/tipoVinho';

@Component({
	selector: 'app-inserir-vinho-admin',
	templateUrl: './inserir-vinho-admin.component.html',
	styleUrls: ['./inserir-vinho-admin.component.css']
})
export class InserirVinhoAdminComponent implements OnInit {
  	VinhoForm: FormGroup;
	Vinho: formVinho;

	tipoVinhos: string[] = ["Verde", "Rosé", "Tinto", "Branco", "Espumante", "Quinta"];

	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[];

	constructor( private router: Router, private fb: FormBuilder ) { 
		this.VinhoForm = fb.group({
			'marca': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
			'tipo': ['', Validators.required],
			'categoria': ['', Validators.minLength(5)]
		});
	}

	ngOnInit() {
		this.iniFormVinho();
		this.iniListaVinhos();
	}

	// Criação do tipo de vinho após verificações 
	novoVinho(form){
		this.Vinho = form;
		
		// Variavel que determina se o tipo está ou não pronto para ser inserido
		var estadoVinho: boolean = true;

		// Ver se já há tipos de vinho com as mesma caracteristicas na BD
		for (let i = 0; i < this.vinhos.length; i++){
			if (this.vinhos[i].marca == this.Vinho.marca && this.vinhos[i].tipo == this.Vinho.tipo && this.vinhos[i].categoria == this.Vinho.categoria){
				estadoVinho = false;
			}
		}

		if (estadoVinho){
			alert("O tipo de vinho foi criado com sucesso!");
			this.router.navigate(['/admin/vinhos']);
		}
		else{
			alert("O tipo de vinho que está a criar já existe!");
			this.clearForm();
		}
	}

	// Limpa os dados do Formulário
	clearDados(){
		this.clearForm();
	}

	// Iniciar o objeto Vinho
	public iniFormVinho(){
		this.Vinho = {
			marca: '',
			tipo: '',
			categoria: ''
		}
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

	// Função que limpa os dados do form VinhoForm
	public clearForm(){
		this.VinhoForm.controls['marca'].setValue('');
		this.VinhoForm.controls['tipo'].setValue('');
		this.VinhoForm.controls['categoria'].setValue('');
	}

}

interface formVinho{
	marca: string,
	tipo: string,
	categoria: string
}