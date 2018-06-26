import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from "rxjs/Observable";
import { Subscription } from 'rxjs/Subscription';

import { TipoVinho } from '../../../../interfaces/tipoVinho';
import { Caixa } from '../../../../interfaces/caixa';
import { Garrafa } from '../../../../interfaces/garrafa';

import { ValidatorVinho } from '../../../../validators/validator-vinho';

import { VinhoServiceService } from '../../../../services/vinho/vinho-service.service';
import { CaixaServiceService } from '../../../../services/caixa/caixa-service.service';
import { GarrafaServiceService } from '../../../../services/garrafa/garrafa-service.service';

@Component({
	selector: 'app-editar-vinho-admin',
	templateUrl: './editar-vinho-admin.component.html',
	styleUrls: ['./editar-vinho-admin.component.css']
})
export class EditarVinhoAdminComponent implements OnInit, OnDestroy {
	// Vinho selecionado
  	id: number;
	private sub: any;
	VinhoForm: FormGroup;
	// DropDowns
	tipoVinhos: string[] = ["Verde", "Rosé", "Tinto", "Branco", "Espumante", "Quinta"];
	// Vinho selecionado
	vinho: TipoVinho;
  	// Lista de tipos de vinho a ler da BD
	vinhos: TipoVinho[] = [];
	// Lista de modelos caixa a ler da BD
	caixas: Caixa[] = [];
	// Lista de modelos garrafa a ler da BD
	garrafas: Garrafa[] = [];

	private subVinhos: Subscription;
	private subCaixas: Subscription;
	private subGarrafas: Subscription;

	constructor( 
		private route: ActivatedRoute, 
		private router: Router, 
		private fb: FormBuilder, 
		private vinhoService: VinhoServiceService, 
		private caixaService: CaixaServiceService, 
		private garrafaService: GarrafaServiceService 
	) { }

	ngOnInit() {
		// Subscrição dos parametros do vinho escolhido para editar
		this.sub = this.route.params.subscribe(
			params => { this.id = +params['id']; }
		)
		this.getVinhos();
		this.iniVinhoForm();
		this.getCaixas();
		this.getGarrafas();
	}

	ngOnDestroy(){
		this.subVinhos.unsubscribe();
		this.subCaixas.unsubscribe();
		this.subGarrafas.unsubscribe();
	}

	// Inicializar o objeto form VinhoForm
	iniVinhoForm(){
		this.VinhoForm = this.fb.group({
			'marca': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
			'tipo': ['', Validators.required],
			'categoria': ['', Validators.minLength(5)]
			}, { 
				validator: ValidatorVinho(this.vinhos) 
			}
		);
	}

	// Subcrição do service VinhoService e obtenção dos dados de todos os vinhos provenientes da BD
	getVinhos(){
		this.subVinhos = this.vinhoService.getVinhos().subscribe(
			data => {
				this.vinhos = data
			},
			err => console.error(err),
			() => {
				this.iniVinhoForm();
				this.getSelectedVinho();
			}
		);
	}

	// Subcrição do service CaixaService e obtenção dos dados de todas as caixas provenientes da BD
	getCaixas(){
		this.subCaixas = this.caixaService.getCaixas().subscribe(
			data => { 
				this.caixas = data 
			},
			err => console.error(err)
		);
	}

	// Subcrição do service GarrafaService e obtenção dos dados de todas as garrafas provenientes da BD
	getGarrafas(){
		this.subGarrafas = this.garrafaService.getGarrafas().subscribe(
			data => { 
				this.garrafas = data 
			},
			err => console.error(err)
		);
	}

	// Editar um utilizador selecionado
	editVinho(editVinho){
		const editVinhos = this.vinhoService.editVinho(editVinho).subscribe(
			data => data,
			err => console.error(err),
			() => {
				setTimeout(() => {
					alert("O tipo de vinho foi editado com sucesso!");			
					this.router.navigate(['/admin/vinhos']);					
				}, 500);	
			}
		);
	}

	// Informação do vinho selecionado
	getSelectedVinho(){
		this.vinho = this.vinhos.find(x => x.ID == this.id);
		this.resetForm(this.vinho);
	}

	// Editar o vinho após verificações
	editarVinho(form){
		var editVinho: TipoVinho = {
			ID: this.vinho.ID,
			Marca: form.marca,
			Tipo: form.tipo,
			Categoria: form.categoria
		}
		// Array com caixas com o tipo de vinho selecionado
		var caixasComIdVinho: Caixa[] = this.caixas.filter(x => x.TipoDeVinho_ID == this.vinho.ID);
		// Array com garrafas com o tipo de vinho selecionado
		var garrafasComIdVinho: Garrafa[] = this.garrafas.filter(x => x.TipoDeVinho_ID == this.vinho.ID);
		if (caixasComIdVinho.length == 0 && garrafasComIdVinho.length == 0) this.editVinho(editVinho);
		else{
			if (caixasComIdVinho.length != 0 && garrafasComIdVinho.length != 0){
				if (confirm("Este vinho, que quer editar, está a ser utilizado como stock em garrafas e caixas. Pretende editá-lo mesmo assim?"))
					this.editVinho(editVinho);
				else this.clearDados();
			}
			else{
				if (caixasComIdVinho.length != 0){
					if (confirm("Este vinho, que quer editar, está a ser utilizado como stock em caixas. Pretende editá-lo mesmo assim?"))
						this.editVinho(editVinho);
					else this.clearDados();
				} 
				else{
					if (confirm("Este vinho, que quer editar, está a ser utilizado como stock em garrafas. Pretende editá-lo mesmo assim?"))
						this.editVinho(editVinho);
					else this.clearDados();
				}
			}
		}		
	}

	// Reset dos dados da form
	clearDados(){
		this.resetForm(this.vinho);
	}

	// Coloca a form com os dados pre-selecionados
	resetForm(vinho: TipoVinho){
		this.VinhoForm.controls['marca'].setValue(vinho.Marca);
		this.VinhoForm.controls['tipo'].setValue(vinho.Tipo);
		this.VinhoForm.controls['categoria'].setValue(vinho.Categoria);
	}	

}