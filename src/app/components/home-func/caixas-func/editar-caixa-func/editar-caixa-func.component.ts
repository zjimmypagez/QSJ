import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';

import { RegistoCaixa } from '../../../../interfaces/registoCaixa';
import { Caixa } from '../../../../interfaces/caixa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

@Component({
	selector: 'app-editar-caixa-func',
	templateUrl: './editar-caixa-func.component.html',
	styleUrls: ['./editar-caixa-func.component.css']
})
export class EditarCaixaFuncComponent implements OnInit {
  	id: number;
  	private sub: any;
	RegistoForm: FormGroup;
	Registo: formRegistoEditar;

	registo: RegistoCaixa;
	opcao: string;
	caixa: tableCaixa;

	// Lista de modelos de caixa a ler da BD
	caixas: Caixa[];
	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[];
	// Tabela interligada entre caixas e vinhos
	tabelaCaixas: tableCaixa[];
	// Lista de registos de caixa a ler da BD
	registos: RegistoCaixa[];

	constructor( private route: ActivatedRoute, private router: Router, private fb: FormBuilder ) { 
		this.RegistoForm = fb.group({
			'comentario': ['', Validators.maxLength(200)]
		});
	}

	ngOnInit() {
		this.iniListaRegistos();
		this.iniListaCaixas();
		this.iniListaVinhos();
		this.tabelaCaixas = this.iniListatTableCaixas(this.caixas, this.vinhos);

		// Subscrição dos parametros do modelo da caixa escolhido para editar
		this.sub = this.route.params.subscribe(
			params => { this.id = +params['id']; }
		)

		// Procura na lista de caixas (a ser lida da BD)
		for (let i = 0; i < this.registos.length; i++){
			if (this.registos[i].id == this.id)
			  this.registo = this.registos[i];
		}

		// Selecção da opção escolhida
		if (this.registo.quantidade > 0)
			this.opcao = "Inserir";
		else{
			this.opcao = "Remover";
		}

		// Seleção do modelo de caixa escolhido
		for (let i = 0; i < this.tabelaCaixas.length; i++){
			if (this.tabelaCaixas[i].id == this.registo.idCaixa)
				this.caixa = this.tabelaCaixas[i];
		}

		this.resetForm(this.registo);
	}

	// Editar o registo de caixa após verificações
	editarRegisto(form){
		this.Registo = form;
		
		alert("O comentário foi editado com sucesso!");
		this.router.navigate(['/func/caixas']);
	}

	// Reset dos dados da form
	clearDados(){
		this.resetForm(this.registo);
	}

	ngOnDestroy(){
		this.sub.unsubscribe();
	}

	// Coloca a form com os dados pre-selecionados
	public resetForm(registo: RegistoCaixa){
		this.RegistoForm.controls['comentario'].setValue(registo.comentario);
	}

	// Dados criados (A ser subsituido pela ligação à BD)
	public iniListaRegistos(){
		this.registos = [{
			id: 1,
			idCaixa: 2,
			data: new Date(2005,12,17),
			comentario: "2 c/ defeito",
			quantidade: 23      
		},
		{
			id: 2,
			idCaixa: 1,
			data: new Date(2012,6,2),
			comentario: "",
			quantidade: 12 
		},
		{
			id: 3,
			idCaixa: 1,
			data: new Date(2013,4,26),
			comentario: "12 c/ defeito",
			quantidade: 120 
		}];
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

	// Interligação entre duas listas: Caixa e Tipo de Vinho
	public iniListatTableCaixas(caixas: Caixa[], vinhos: TipoVinho[]): tableCaixa[]{
		var table: tableCaixa[] = [];

		for (let i = 0; i < caixas.length; i++){
			for (let j = 0; j < vinhos.length; j++){
				if (caixas[i].tipoVinho == vinhos[j].id){
					var tableObj: tableCaixa = {
						id: caixas[i].id,
						capacidade: caixas[i].capacidade,
						garrafas: caixas[i].garrafas,
						material: caixas[i].material,
						tipoVinho: vinhos[j].tipo,
						quantidade: caixas[i].quantidade 
					}
					table.push(tableObj);
				}
			}
		}

		return table;
	}

}

interface formRegistoEditar{
	comentario: string
}

// Interface que interliga 2 tabelas = Caixa + Tipo de Vinho 
interface tableCaixa{
	id: number,
   capacidade: number,
   garrafas: number,
   material: string,
	tipoVinho: string, // Atributo tipo da tabela Tipo de Vinho
	quantidade: number
}