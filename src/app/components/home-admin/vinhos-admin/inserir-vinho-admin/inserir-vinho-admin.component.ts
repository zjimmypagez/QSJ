import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { Observable } from "rxjs/observable";
import { Subscription } from 'rxjs/Subscription';

import { TipoVinho, TipoVinhoSId } from '../../../../interfaces/tipoVinho';

import { ValidatorVinho } from '../../../../validators/validator-vinho';

import { VinhoServiceService } from '../../../../services/vinho/vinho-service.service';

@Component({
	selector: 'app-inserir-vinho-admin',
	templateUrl: './inserir-vinho-admin.component.html',
	styleUrls: ['./inserir-vinho-admin.component.css']
})
export class InserirVinhoAdminComponent implements OnInit, OnDestroy {
  	VinhoForm: FormGroup;
	// DropDowns
	tipoVinhos: string[] = ["Verde", "Rosé", "Tinto", "Branco", "Espumante", "Quinta"];
	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[] = [];

	private subs: Subscription;

	constructor( private router: Router, private fb: FormBuilder, private vinhoService: VinhoServiceService ) { }

	ngOnInit() {
		this.getVinhos();
		this.iniVinhoForm();
	}

	ngOnDestroy(){
		this.subs.unsubscribe();
	}

	// Subcrição do service VinhoService e obtenção dos dados de todos os vinhos provenientes da BD
	getVinhos(){
		this.subs = this.vinhoService.getVinhos().subscribe(
			(data: TipoVinho[]) => { this.vinhos = data },
			err => console.error(err),
			() => {
				this.iniVinhoForm();
			}
		);
	}

	// Inserir novo utilizador
	createVinho(newVinho: TipoVinhoSId){
		this.subs = this.vinhoService.createVinho(newVinho).subscribe(
			data => data,
			err => console.error(err),
			() => {
				this.router.navigate(['/admin/vinhos']);
			}
		);
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
		var newVinho: TipoVinhoSId = {
			Marca: form.marca,
			Tipo: form.tipo,
			Categoria: form.categoria
		}
		this.createVinho(newVinho);
		alert("O tipo de vinho foi criado com sucesso!");
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

}