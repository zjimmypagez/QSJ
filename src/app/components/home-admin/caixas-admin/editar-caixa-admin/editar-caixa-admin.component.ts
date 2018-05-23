import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';

import { Caixa } from '../../../../interfaces/caixa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

import { OrdenarTablesService } from '../../../../services/funcoes-service/ordenar-tables.service';

import { ValidatorModelo } from '../../../../validators/validator-caixas';

@Component({
	selector: 'app-editar-caixa-admin',
	templateUrl: './editar-caixa-admin.component.html',
	styleUrls: ['./editar-caixa-admin.component.css']
})
export class EditarCaixaAdminComponent implements OnInit {
	id: number;
  	private sub: any;
	CaixaForm: FormGroup;

	materiais: string [] = ['Cartão', 'Madeira'];
	capacidades: number [] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500];
	caixa: Caixa;
	// Lista que, consoante o material escolhido, apresenta a quantidade pré-definida
	garrafas: number[] = [];

	// Lista de modelos de caixa a ler da BD
	caixas: Caixa[];
	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[];

	constructor( private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private ordenarTableService: OrdenarTablesService ) { }

	ngOnInit() {
		this.iniListaCaixas();
		this.iniListaVinhos();
		this.vinhos = this.ordenarTableService.ordenarVinhos(this.vinhos);
		// Subscrição dos parametros do modelo da caixa escolhido para editar
		this.sub = this.route.params.subscribe(
			params => { this.id = +params['id']; }
		)
		// Procura na lista de caixas (a ser lida da BD)
		this.caixa = this.caixas.find(x => x.id == this.id);
		this.iniCaixaForm();
		this.iniGarrafas(this.caixa.material);
		this.resetForm(this.caixa);
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

	// Editar o modelo de caixa após verificações
	editarCaixa(form){
		var caixa: any = form;
		if (confirm("Tem a certeza que pretende editar as características deste modelo? [Quantidade em stock] = " + this.caixa.quantidade)){
			alert("O modelo de caixa foi editado com sucesso!");
			this.router.navigate(['/admin/caixas']);
		}		
	}

	// Reset dos dados da form
	clearDados(){
		this.resetForm(this.caixa);
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

	ngOnDestroy(){
		this.sub.unsubscribe();
	}

	// Inicializar o array garrafas
	iniGarrafas(material: string){
		if (material == this.materiais[0]/* Cartão */){
			this.garrafas = [2, 3, 6, 12];
		}
		else{
			if (material == this.materiais[1]/* Madeira */){
				this.garrafas = [1, 2, 3];
			}
			else{
				this.garrafas = [];
			}
		}
	}

	// Coloca a form com os dados pre-selecionados
	resetForm(caixa: Caixa){
		this.CaixaForm.controls['capacidade'].setValue(caixa.capacidade);
		this.CaixaForm.controls['material'].setValue(caixa.material);
		this.CaixaForm.controls['garrafas'].setValue(caixa.garrafas);
		this.CaixaForm.controls['tipoVinho'].setValue(caixa.tipoVinho);
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