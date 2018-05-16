import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';

import { TipoVinho } from '../../../../interfaces/tipoVinho';
import { Caixa } from '../../../../interfaces/caixa';
import { Garrafa } from '../../../../interfaces/garrafa';

@Component({
	selector: 'app-editar-vinho-admin',
	templateUrl: './editar-vinho-admin.component.html',
	styleUrls: ['./editar-vinho-admin.component.css']
})
export class EditarVinhoAdminComponent implements OnInit {
  	id: number;
	private sub: any;
	VinhoForm: FormGroup;
	Vinho: formVinho;
	  
	tipoVinhos: string[] = ["Verde", "Rosé", "Tinto", "Branco", "Espumante", "Quinta"];
  
	vinho: TipoVinho;
  	// Lista de tipos de vinho a ler da BD
	vinhos: TipoVinho[];
	// Lista de modelos caixa a ler da BD
	caixas: Caixa[];
	// Lista de modelos garrafa a ler da BD
	garrafas: Garrafa[];

	constructor( private route: ActivatedRoute, private router: Router, private fb: FormBuilder ) { 
		this.VinhoForm = fb.group({
			'marca': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
			'tipo': ['', Validators.required],
			'categoria': ['', Validators.minLength(5)]
		});
	}

	ngOnInit() {
		this.iniListaVinhos();
		this.iniListaCaixas();
		this.iniListaGarrafas();

		// Subscrição dos parametros do vinho escolhido para editar
		this.sub = this.route.params.subscribe(
			params => { this.id = +params['id']; }
		)

		// Procura na lista de vinhos (a ser lida da BD)
		for (let i = 0; i < this.vinhos.length; i++){
			if (this.vinhos[i].id == this.id)
			  this.vinho = this.vinhos[i];
		}
			
		this.resetForm(this.vinho);
	}

	// Editar o vinho após verificações
	editarVinho(form){
		this.Vinho = form;

		// Variavel que determina se o tipo de vinho está ou não pronta para ser editado
		var estadoVinho: boolean = true;

		if (this.vinho.marca != this.Vinho.marca || this.vinho.tipo != this.Vinho.tipo || this.vinho.categoria != this.Vinho.categoria){
			// Ver se o tipo de vinho escolhido esta em uso em modelos de garrafa
			for (let i = 0; i < this.garrafas.length; i++){				
				if (this.garrafas[i].tipoVinho == this.vinho.id){
					estadoVinho = false;
				}
			}
	
			// Ver se o tipo de vinho escolhido esta em uso em modelos de caixa
			for (let i = 0; i < this.caixas.length; i++){
				if (this.caixas[i].tipoVinho == this.vinho.id){
					estadoVinho = false;
				}			
			}			

			if (estadoVinho){
				alert("O tipo de vinho foi editado com sucesso!");
				this.router.navigate(['/admin/vinhos']);
			}
			else{
				if (confirm("O tipo de vinho: [" + this.vinho.marca + " - " + this.vinho.tipo + " - " + this.vinho.categoria + "] que pretende editar está em uso. Pretende editá-lo mesmo assim?")){
					alert("O tipo de vinho foi editado com sucesso!");
					this.router.navigate(['/admin/vinhos']);
				}
			}
		}
		else{
			alert("O tipo de vinho que quer editar já existe!");
		}
	}

	// Reset dos dados da form
	clearDados(){
		this.resetForm(this.vinho);
	}

	ngOnDestroy(){
		this.sub.unsubscribe();
	}

	// Coloca a form com os dados pre-selecionados
	public resetForm(vinho: TipoVinho){
		this.VinhoForm.controls['marca'].setValue(vinho.marca);
		this.VinhoForm.controls['tipo'].setValue(vinho.tipo);
		this.VinhoForm.controls['categoria'].setValue(vinho.categoria);
	}

	// Dados criados (A ser subsituido pela ligação à BD)
	public iniListaVinhos(){
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
	public iniListaGarrafas(){
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

}

interface formVinho{
	marca: string,
	tipo: string,
	categoria: string
}