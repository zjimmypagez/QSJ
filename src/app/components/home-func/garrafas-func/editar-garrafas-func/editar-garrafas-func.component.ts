import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from "rxjs/Observable";
import { Subscription } from 'rxjs/Subscription';

import { RegistoGarrafa, RegistoGarrafaComentario } from '../../../../interfaces/registoGarrafa';
import { Garrafa, GarrafaEVinho } from '../../../../interfaces/garrafa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

import { ValidatorComentario } from '../../../../validators/validator-garrafas';

import { RegistoGarrafaService } from '../../../../services/registo-garrafa/registo-garrafa.service';
import { GarrafaServiceService } from '../../../../services/garrafa/garrafa-service.service';

@Component({
	selector: 'app-editar-garrafas-func',
	templateUrl: './editar-garrafas-func.component.html',
	styleUrls: ['./editar-garrafas-func.component.css']
})
export class EditarGarrafasFuncComponent implements OnInit, OnDestroy {
	// Modelo de garrafa selecionado
	id: number;
	private sub: any;
	RegistoForm: FormGroup;
	// Garrafa selecionado
	garrafa: GarrafaEVinho;
	// Lista de modelos de garrafa a ler da BD
 	garrafasEVinhos: GarrafaEVinho[] = [];	
	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[] = [];
	// Registo de garrafa selecionado
	registo: RegistoGarrafa;
	// Lista de registos de caixa a ler da BD
	registos: RegistoGarrafa[] = [];
	opcao: string;

	private subRegistos: Subscription;
	private subGarrafasEVinhos: Subscription;

	constructor( 
		private route: ActivatedRoute, 
		private router: Router, 
		private fb: FormBuilder, 
		private registoService: RegistoGarrafaService,
		private garrafaService: GarrafaServiceService
	) { }

	ngOnInit() {
		// Subscrição dos parametros do modelo da caixa escolhido para editar
		this.sub = this.route.params.subscribe(
			params => { this.id = +params['id']; }
		)
		this.getRegistos();
		this.getGarrafasEVinhos();
		this.iniRegistoForm();
	}

	ngOnDestroy(){
		this.subRegistos.unsubscribe();
		this.subGarrafasEVinhos.unsubscribe();
	}

	// Subcrição do service RegistoGarrafaService e obtenção dos dados de todos os registo de garrafas provenientes da BD
	getRegistos(){
		this.subRegistos = this.registoService.getRegistoGarrafa().subscribe(
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

	// Subcrição do service GarrafaService e obtenção dos dados de todos as garrafas com a operação JOIN com os vinhos provenientes da BD
	getGarrafasEVinhos(){
		this.subGarrafasEVinhos = this.garrafaService.getGarrafasEVinhos().subscribe(
			data => { 
				this.garrafasEVinhos = data
			},
			err => console.error(err),
			() => {
				setTimeout(() => {
					this.garrafa = this.garrafasEVinhos.find(x => x.Id == this.registo.Garrafa_ID);						
				}, 50);
			}
		);
	}
	
	// Editar um registo de garrafa selecionado
	editRegitoGarrafa(editRegistoGarrafa){
		const editRegistoGarrafas = this.registoService.editRegistoGarrafa(editRegistoGarrafa).subscribe(
			data => data,
			err => console.error(err),
			() => {
				setTimeout(() => {
					alert("O comentário foi editado com sucesso!");
					this.router.navigate(['/func/garrafas']);			
				}, 500);
			}
		);
	}

	getOpcao(registo: RegistoGarrafa){
		if (registo.QTCRotulo + registo.QTSRotulo == 0) this.opcao = "Rotular";
		else
			if (registo.QTCRotulo > 0 || registo.QTSRotulo > 0) this.opcao = "Inserir";
			else this.opcao = "Remover";
	}

	// Inicializar o objeto form RegistoForm
	iniRegistoForm(){
		this.RegistoForm = this.fb.group({
			'comentario': ['', [Validators.maxLength(200), ValidatorComentario(this.registo)]]
		});
	}

	// Editar o registo de garrafa após verificações
	editarRegisto(form){		
		var currentUser = JSON.parse(localStorage.getItem('currentUser'));
		var id: number = currentUser.userID;
		var editRegisto: RegistoGarrafaComentario = {
			ID: this.registo.ID,
			Utilizador_ID: id,
			Comentario: form.comentario,
			Data: new Date().toISOString().slice(0, 19).replace('T', ' ')
		}
		this.editRegitoGarrafa(editRegisto);
	}

	// Reset dos dados da form
	clearDados(){
		this.resetForm(this.registo);
	}

	// Coloca a form com os dados pre-selecionados
	resetForm(registo: RegistoGarrafa){
		this.RegistoForm.controls['comentario'].setValue(registo.Comentario);
		this.RegistoForm.controls['comentario'].markAsUntouched();
	}

}