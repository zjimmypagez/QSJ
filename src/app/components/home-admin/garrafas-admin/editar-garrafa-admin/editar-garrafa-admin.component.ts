import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';

import { Garrafa } from '../../../../interfaces/garrafa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

@Component({
	selector: 'app-editar-garrafa-admin',
	templateUrl: './editar-garrafa-admin.component.html',
	styleUrls: ['./editar-garrafa-admin.component.css']
})
export class EditarGarrafaAdminComponent implements OnInit {
	id: number;
	private sub: any;
	GarrafaForm: FormGroup;
	Garrafa: formGarrafa;
	
	capacidades: number [] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500];
	garrafa: Garrafa;

	// Lista de modelos de caixa a ler da BD
	garrafas: Garrafa[];
	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[];

	constructor( private route: ActivatedRoute, private router: Router, private fb: FormBuilder ) { 
		this.GarrafaForm = fb.group({
			'lote': ['', Validators.compose([Validators.required, Validators.min(1), Validators.max(5000)])],
			'ano': ['', Validators.compose([Validators.required, Validators.min(1900), Validators.max(2100)])],
			'tipoVinho': ['', Validators.required],
			'capacidade': ['', Validators.required]
		});		
	}

	ngOnInit() {
		this.iniListaGarrafas();
		this.iniListaVinhos();

		// Subscrição dos parametros do modelo da garrafa escolhido para editar
		this.sub = this.route.params.subscribe(
			params => { this.id = +params['id']; }
		)

		// Procura na lista de garrafas (a ser lida da BD)
		for (let i = 0; i < this.garrafas.length; i++){
			if (this.garrafas[i].id == this.id)
			  this.garrafa = this.garrafas[i];
		}
			
		this.resetForm(this.garrafa);
	}

	// Editar o modelo de caixa após verificações
	editarGarrafa(form){
		this.Garrafa = form;

		// Variavel que determina se a garrafa está ou não pronta para ser editada
		var estadoGarrafa: boolean = true;

		// Ver se já há modelos com as mesmas caracteristicas na BD
		for (let i = 0; i < this.garrafas.length; i++){
			if (this.garrafas[i].lote == this.Garrafa.lote && this.garrafas[i].ano == this.Garrafa.ano && this.garrafas[i].tipoVinho == this.Garrafa.tipoVinho && this.garrafas[i].capacidade == (+this.Garrafa.capacidade)){
				estadoGarrafa = false;
			}
		}

		if (estadoGarrafa){
			if (confirm("Tem a certeza que pretende editar as características deste modelo? [Quantidade em stock] = " + this.garrafa.quantidade)){
				alert("O modelo de garrafa foi editado com sucesso!");
				this.router.navigate(['/admin/garrafas']);
			}			
		}
		else{
			alert("O modelo de garrafa que está a editar já existe!");
			this.resetForm(this.garrafa);
		}
	}

	// Reset dos dados da form
	clearDados(){
		this.resetForm(this.garrafa);
	}

	ngOnDestroy(){
		this.sub.unsubscribe();
	}

	// Coloca a form com os dados pre-selecionados
	public resetForm(garrafa: Garrafa){
		this.GarrafaForm.controls['lote'].setValue(garrafa.lote);
		this.GarrafaForm.controls['ano'].setValue(garrafa.ano);
		this.GarrafaForm.controls['tipoVinho'].setValue(garrafa.tipoVinho);
		this.GarrafaForm.controls['capacidade'].setValue(garrafa.capacidade);
	}

	// Dados criados (A ser subsituido pela ligação à BD)
	public iniListaGarrafas(){
		this.garrafas = [{
			id: 1,
			lote: 3599,
			ano: 2004,
			tipoVinho: 1,
			capacidade: 1.000,
			quantidade: 250
		},
		{
			id: 2,
			lote: 3999,
			ano: 2015,
			tipoVinho: 3,
			capacidade: 0.750,
			quantidade: 100
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
interface formGarrafa{
	lote: number,
	ano: number,
	tipoVinho: number,
	capacidade: string
}