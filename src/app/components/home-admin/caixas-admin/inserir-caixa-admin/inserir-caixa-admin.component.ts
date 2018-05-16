import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { Caixa } from '../../../../interfaces/caixa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

import { OrdenarTablesService } from '../../../../services/funcoes-service/ordenar-tables.service';

@Component({
	selector: 'app-inserir-caixa-admin',
	templateUrl: './inserir-caixa-admin.component.html',
	styleUrls: ['./inserir-caixa-admin.component.css']
})
export class InserirCaixaAdminComponent implements OnInit {
	CaixaForm: FormGroup;
	Caixa: formCaixa;

	materiais: string [] = ['Cartão', 'Madeira'];
	capacidades: number[] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500, 3.000, 6.000, 12.000];
	// Lista que, consoante o material escolhido, apresenta a quantidade pré-definida
	garrafas: number[] = [];

	// Lista de modelos de caixa a ler da BD
	caixas: Caixa[];
	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[];

	constructor( private router: Router, private fb: FormBuilder, private ordenarTableService: OrdenarTablesService ) {
		this.CaixaForm = fb.group({
			'capacidade': ['', Validators.required],
			'material': ['', Validators.required],
			'garrafas': ['', Validators.required],
			'tipoVinho': ['', Validators.required]
		});
	}

	ngOnInit() {
		this.iniFormCaixa();
		this.iniListaCaixas();
		this.iniListaVinhos();
		this.vinhos = this.ordenarTableService.ordenarVinhos(this.vinhos);
	}

	// Criação do novo modelo de caixa após verificações 
	novaCaixa(form){
		this.Caixa = form;
		
		// Variavel que determina se a caixa está ou não pronta para ser inserida
		var estadoCaixa: boolean = true;

		// Ver se já há modelos com as mesma caracteristicas na BD
		for (let i = 0; i < this.caixas.length; i++){
			if (this.caixas[i].capacidade == (+this.Caixa.capacidade) && this.caixas[i].garrafas == (+this.Caixa.garrafas) && this.caixas[i].material == this.Caixa.material && this.caixas[i].tipoVinho == this.Caixa.tipoVinho){
				estadoCaixa = false;
			}
		}

		if (estadoCaixa){
			alert("O modelo de caixa foi criado com sucesso!");
			this.router.navigate(['/admin/caixas']);
		}
		else{
			alert("O modelo de caixa que está a criar já existe!");
			this.clearForm();
		}
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

	// Iniciar o objeto Caixa
	iniFormCaixa(){
		this.Caixa = {
			capacidade: '',
			garrafas: null,
			material: '',
			tipoVinho: null
		}
	}

	// Função que limpa os dados do form CaixaForm
	clearForm(){
		this.CaixaForm.controls['capacidade'].setValue('');
		this.CaixaForm.controls['material'].setValue('');
		this.CaixaForm.controls['garrafas'].setValue('');
		this.CaixaForm.controls['tipoVinho'].setValue('');
		this.CaixaForm.markAsUntouched();
	}

	// Dados criados (A ser subsituido pela ligação à BD)
	public iniListaCaixas(){
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

}

// Dados recebidos do formulário
interface formCaixa{
	capacidade: string,
	garrafas: number,
	material: string,
	tipoVinho: number
}