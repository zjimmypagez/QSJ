import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';

import { Caixa } from '../../../../interfaces/caixa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

@Component({
	selector: 'app-editar-caixa-admin',
	templateUrl: './editar-caixa-admin.component.html',
	styleUrls: ['./editar-caixa-admin.component.css']
})
export class EditarCaixaAdminComponent implements OnInit {
	id: number;
  	private sub: any;
	CaixaForm: FormGroup;
	Caixa: formCaixa;

	materiais: string [] = ['Cartão', 'Madeira'];
	capacidades: number [] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500];
	caixa: Caixa;
	// Lista que, consoante o material escolhido, apresenta a quantidade pré-definida
	garrafas: number[] = [];

	// Lista de modelos de caixa a ler da BD
	caixas: Caixa[];
	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[];

	constructor( private route: ActivatedRoute, private router: Router, private fb: FormBuilder ) {
		this.CaixaForm = fb.group({
			'capacidade': ['', Validators.required],
			'material': ['', Validators.required],
			'garrafas': ['', Validators.required],
			'tipoVinho': ['', Validators.required]
		});
	}

	ngOnInit() {
		this.iniListaCaixas();
		this.iniListaVinhos();

		// Subscrição dos parametros do modelo da caixa escolhido para editar
		this.sub = this.route.params.subscribe(
			params => { this.id = +params['id']; }
		)

		// Procura na lista de caixas (a ser lida da BD)
		for (let i = 0; i < this.caixas.length; i++){
			if (this.caixas[i].id == this.id)
			  this.caixa = this.caixas[i];
		}
	
		this.iniGarrafas(this.caixa.material);
		this.resetForm(this.caixa);
	}

	// Editar o modelo de caixa após verificações
	editarCaixa(form){
		this.Caixa = form;
		// Variavel que determina se a caixa está ou não pronta para ser editada
		var estadoCaixa: boolean = true;

		// Ver se já há modelos com as mesmas caracteristicas na BD
		for (let i = 0; i < this.caixas.length; i++){
			if (this.caixas[i].capacidade == (+this.Caixa.capacidade) && this.caixas[i].garrafas == (+this.Caixa.garrafas) && this.caixas[i].material == this.Caixa.material && this.caixas[i].tipoVinho == this.Caixa.tipoVinho){
				estadoCaixa = false;
			}
		}

		if (estadoCaixa){
			if (confirm("Tem a certeza que pretende editar as características deste modelo? [Quantidade em stock] = " + this.caixa.quantidade)){
				alert("O modelo de caixa foi editado com sucesso!");
				this.router.navigate(['/admin/caixas']);
			}			
		}
		else{
			alert("O modelo de caixa que está a editar já existe!");
			this.resetForm(this.caixa);
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
	public iniGarrafas(material: string){
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
	public resetForm(caixa: Caixa){
		this.CaixaForm.controls['capacidade'].setValue(caixa.capacidade);
		this.CaixaForm.controls['material'].setValue(caixa.material);
		this.CaixaForm.controls['garrafas'].setValue(caixa.garrafas);
		this.CaixaForm.controls['tipoVinho'].setValue(caixa.tipoVinho);
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
			tipoVinho: 6,
			quantidade: 50
      }];
	}

	// Dados criados (A ser subsituido pela ligação à BD)
	public iniListaVinhos(){
		this.vinhos = [{
			id: 1,
			tipo: 'Verde'
		 },
		 {
			id: 2,
			tipo: 'Rosé'
		 }, 
		 {
			id: 3,
			tipo: 'Tinto'
		 },
		 {
			id: 4,
			tipo: 'Branco'
		 },
		 {
			id: 5,
			tipo: 'Espumante'
		 },
		 {
			id: 6,
			tipo: 'Quinta'
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