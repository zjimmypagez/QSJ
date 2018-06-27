import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from "rxjs/Observable";
import { Subscription } from 'rxjs/Subscription';

import { RegistoCaixa, RegistoCaixaComentario } from '../../../../interfaces/registoCaixa';
import { Caixa, CaixaEVinho } from '../../../../interfaces/caixa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

import { JoinTablesService } from '../../../../services/funcoes-service/join-tables.service';

import { ValidatorComentario } from '../../../../validators/validator-caixas';

import { RegistoCaixaService } from '../../../../services/registo-caixa/registo-caixa.service';
import { CaixaServiceService } from '../../../../services/caixa/caixa-service.service';

@Component({
	selector: 'app-editar-caixa-func',
	templateUrl: './editar-caixa-func.component.html',
	styleUrls: ['./editar-caixa-func.component.css']
})
export class EditarCaixaFuncComponent implements OnInit, OnDestroy {
	// Modelo de caixa selecionado
  	id: number;
  	private sub: any;
	RegistoForm: FormGroup;
	// Caixa selecionada
	caixa: CaixaEVinho;
	// Lista de modelos de garrafa a ler da BD
 	caixasEVinhos: CaixaEVinho[] = [];	
	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[] = [];
	// Registo da caixa selecionada
	registo: RegistoCaixa;
	// Lista de registos de caixa a ler da BD
	registos: RegistoCaixa[] = [];
	opcao: string;

	private subRegistos: Subscription;
	private subCaixasEVinhos: Subscription;

	constructor( 
		private route: ActivatedRoute, 
		private router: Router, 
		private fb: FormBuilder, 
		private joinTableService: JoinTablesService,
		private registoService: RegistoCaixaService,
		private caixaService: CaixaServiceService 
	) { }

	ngOnInit() {
		// Subscrição dos parametros do modelo da caixa escolhido para editar
		this.sub = this.route.params.subscribe(
			params => { this.id = +params['id']; }
		)
		this.getRegistos();
		this.getCaixasEVinhos();
		this.iniRegistoForm();
	}

	ngOnDestroy(){
		this.subRegistos.unsubscribe();
		this.subCaixasEVinhos.unsubscribe();
	}

	// Subcrição do service RegistoCaixaService e obtenção dos dados de todos os registo de caixas provenientes da BD
	getRegistos(){
		this.subRegistos = this.registoService.getRegistoCaixa().subscribe(
			data => { 
				this.registos = data 
			},
			err => console.error(err),
			() => {
				this.registo = this.registos.find(x => x.ID == this.id);
				this.iniRegistoForm();
				this.resetForm(this.registo);	
				this.getOpcao(this.registo);
			}
		);
	}

	// Subcrição do service CaixaService e obtenção dos dados de todos as caixas com a operação JOIN com os vinhos provenientes da BD
	getCaixasEVinhos(){
		this.subCaixasEVinhos = this.caixaService.getCaixasEVinhos().subscribe(
			data => { 
				this.caixasEVinhos = data
			},
			err => console.error(err),
			() => {
				setTimeout(() => {
					this.caixa = this.caixasEVinhos.find(x => x.ID == this.registo.Caixa_ID);						
				}, 50);
			}
		);
	}
	
	// Editar um registo de caixa selecionado
	editRegitoCaixa(editRegistoCaixa){
		const editRegistoCaixas = this.registoService.editRegistoCaixa(editRegistoCaixa).subscribe(
			data => data,
			err => console.error(err),
			() => {
				setTimeout(() => {
					alert("O comentário foi editado com sucesso!");
					this.router.navigate(['/func/caixas']);			
				}, 500);
			}
		);
	}
	
	getOpcao(registo: RegistoCaixa){
		if (registo.Quantidade > 0) this.opcao = "Inserir";
		else this.opcao = "Remover";
	}

	// Inicializar o objeto form RegistoForm
	iniRegistoForm(){
		this.RegistoForm = this.fb.group({
			'comentario': ['', [Validators.maxLength(200), ValidatorComentario(this.registo)]]
		});
	}

	// Editar o registo de caixa após verificações
	editarRegisto(form){
		var currentUser = JSON.parse(localStorage.getItem('currentUser'));
		var id: number = currentUser.userID;
		var editRegisto: RegistoCaixaComentario = {
			ID: this.registo.ID,
			Utilizador_ID: id,
			Comentario: form.comentario,
			Data: new Date().toISOString().slice(0, 19).replace('T', ' ')
		}
		this.editRegitoCaixa(editRegisto);
	}

	// Reset dos dados da form
	clearDados(){
		this.resetForm(this.registo);
	}

	// Coloca a form com os dados pre-selecionados
	resetForm(registo: RegistoCaixa){
		this.RegistoForm.controls['comentario'].setValue(registo.Comentario);
		this.RegistoForm.controls['comentario'].markAsUntouched();
	}

}