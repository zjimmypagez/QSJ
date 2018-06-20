import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';

import { RegistoCaixa } from '../../../../interfaces/registoCaixa';
import { Caixa } from '../../../../interfaces/caixa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

import { JoinTablesService } from '../../../../services/funcoes-service/join-tables.service';

import { ValidatorComentario } from '../../../../validators/validator-caixas';

@Component({
	selector: 'app-editar-caixa-func',
	templateUrl: './editar-caixa-func.component.html',
	styleUrls: ['./editar-caixa-func.component.css']
})
export class EditarCaixaFuncComponent implements OnInit {
	// Modelo de caixa selecionado
  	id: number;
  	private sub: any;
	RegistoForm: FormGroup;
	// Registo da caixa selecionada
	registo: RegistoCaixa;
	// Caixa selecionada
	caixa: tableCaixa;
	// Lista de modelos de caixa a ler da BD
	caixas: Caixa[];
	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[];
	// Tabela interligada entre caixas e vinhos
	tabelaCaixas: tableCaixa[];
	// Lista de registos de caixa a ler da BD
	registos: RegistoCaixa[];

	constructor( private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private joinTableService: JoinTablesService ) { }

	ngOnInit() {
		// Subscrição dos parametros do modelo da caixa escolhido para editar
		this.sub = this.route.params.subscribe(
			params => { this.id = +params['id']; }
		)
		this.iniListaRegistos();
		this.iniListaCaixas();
		this.iniListaVinhos();
		this.tabelaCaixas = this.joinTableService.iniListaTableCaixas(this.caixas, this.vinhos);
		// Procura na lista de caixas (a ser lida da BD)
		this.registo = this.registos.find(x => x.id == this.id);
		// Seleção do modelo de caixa escolhido
		this.caixa = this.tabelaCaixas.find(x => x.id == this.registo.idCaixa);
		this.iniRegistoForm();
		this.resetForm(this.registo);
	}

	// Inicializar o objeto form RegistoForm
	iniRegistoForm(){
		this.RegistoForm = this.fb.group({
			'comentario': ['', [Validators.maxLength(200), ValidatorComentario(this.registo)]]
		});
	}

	// Editar o registo de caixa após verificações
	editarRegisto(form){
		var comentario: any = form.comentario;
		alert("Comentário alterado com sucesso! Novo comentário: " + comentario);
		this.router.navigate(['/func/caixas']);
	}

	// Reset dos dados da form
	clearDados(){
		this.resetForm(this.registo);
	}

	// Coloca a form com os dados pre-selecionados
	resetForm(registo: RegistoCaixa){
		this.RegistoForm.controls['comentario'].setValue(registo.comentario);
		this.RegistoForm.controls['comentario'].markAsUntouched();
	}

	ngOnDestroy(){
		this.sub.unsubscribe();
	}

	// Dados criados (A ser subsituido pela ligação à BD)
	iniListaRegistos(){
		this.registos = [{
			id: 1,
			idCaixa: 2,
			data: new Date(2005,12,17),
			comentario: "2 c/ defeito",
			opcao: "Remover",
			quantidade: -2      
		},
		{
			id: 2,
			idCaixa: 1,
			data: new Date(2012,6,2),
			comentario: "",
			opcao: "Inserir",
			quantidade: 12 
		},
		{
			id: 3,
			idCaixa: 1,
			data: new Date(2013,4,26),
			comentario: "12 c/ defeito",
			opcao: "Inserir",
			quantidade: 120 
		}];
	}

	// Dados criados (A ser subsituido pela ligação à BD)
	iniListaCaixas(){
		/*this.caixas = [{
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
      }];*/
	}

	// Dados criados (A ser subsituido pela ligação à BD)
	iniListaVinhos(){
		/*this.vinhos = [{
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
		}];*/
	}

}

// Interface que interliga 2 tabelas = Caixa + Tipo de Vinho 
interface tableCaixa{
	id: number,
   capacidade: number,
   garrafas: number,
   material: string,
	marca: string, // Atributo marca da tabela Tipo de vinho
	tipo: string, // Atributo tipo da tabela Tipo de Vinho
	categoria: string; // Atributo categoria da tabela Tipo de Vinho
	quantidade: number
}