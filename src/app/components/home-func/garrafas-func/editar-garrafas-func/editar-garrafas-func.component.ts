import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { RegistoGarrafa } from '../../../../interfaces/registoGarrafa';

import { Garrafa } from '../../../../interfaces/garrafa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

import { JoinTablesService } from '../../../../services/funcoes-service/join-tables.service';
import { ValidatorComentario } from '../../../../validators/validator-garrafas';

@Component({
	selector: 'app-editar-garrafas-func',
	templateUrl: './editar-garrafas-func.component.html',
	styleUrls: ['./editar-garrafas-func.component.css']
})
export class EditarGarrafasFuncComponent implements OnInit {
	// Modelo de garrafa selecionado
	id: number;
	private sub: any;
	RegistoForm: FormGroup;
	// Registo de garrafa selecionado
	registo: RegistoGarrafa;
	// Garrafa selecionado
	garrafa: tableGarrafa;
	// Lista de modelos de garrafa a ler da BD
	garrafas: Garrafa[];
	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[];
	// Tabela interligada entre caixas e vinhos
	tabelaGarrafas: tableGarrafa[];
	// Lista de registos de caixa a ler da BD
	registos: RegistoGarrafa[];

	constructor( private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private joinTableService: JoinTablesService ) { }

	ngOnInit() {
		// Subscrição dos parametros do modelo da caixa escolhido para editar
		this.sub = this.route.params.subscribe(
			params => { this.id = +params['id']; }
		)
		this.iniListaRegistos();
		this.iniListaGarrafas();
		this.iniListaVinhos();
		this.tabelaGarrafas = this.joinTableService.iniListaTableGarrafas(this.garrafas, this.vinhos);
		// Procura na lista de garrafas (a ser lida da BD)
		this.registo = this.registos.find(x => x.id == this.id);
		// Seleção do modelo de garrafa escolhido
		this.garrafa = this.tabelaGarrafas.find(x => x.id == this.registo.idGarrafa);
		this.iniRegistoForm();
		this.resetForm(this.registo);
	}

	// Inicializar o objeto form RegistoForm
	iniRegistoForm(){
		this.RegistoForm = this.fb.group({
			'comentario': ['', [Validators.maxLength(200), ValidatorComentario(this.registo)]]
		});
	}

	// Editar o registo de garrafa após verificações
	editarRegisto(form){
		var comentario: any = form.comentario;
		alert("O comentário foi editado com sucesso!");
		this.router.navigate(['/func/garrafas']);
	}

	// Reset dos dados da form
	clearDados(){
		this.resetForm(this.registo);
	}

	// Coloca a form com os dados pre-selecionados
	resetForm(registo: RegistoGarrafa){
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
			idGarrafa: 2,
			data: new Date(2012,3,25),
			comentario: "2 c/ defeito",
			opcao: "Inserir",
			cRotulo: 24,
			sRotulo: 24     
		},
		{
			id: 2,
			idGarrafa: 1,
			data: new Date(2017,4,2),
			comentario: "",
			opcao: "Remover",
			cRotulo: 200,
      		sRotulo: 200  
		},
		{
			id: 3,
			idGarrafa: 1,
			data: new Date(2001,11,22),
			comentario: "5 partidas",
			opcao: "Rotular",
			cRotulo: 0,
      		sRotulo: 25 
		}];
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

// Interface que interliga 2 tabelas = Garrafa + Tipo de Vinho 
interface tableGarrafa{
	id: number,
	lote: string, // Atributo que junta, para mostrar, marca, ano e cuba
   cuba: number,
	ano: number,
	marca: string, // Atributo marca da tabela Tipo de vinho
	tipo: string, // Atributo tipo da tabela Tipo de Vinho
	categoria: string; // Atributo categoria da tabela Tipo de Vinho
   capacidade: number,
	cRotulo: number,
	sRotulo: number
}