import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';

import { TipoVinho } from '../../../../interfaces/tipoVinho';
import { Caixa } from '../../../../interfaces/caixa';
import { Garrafa } from '../../../../interfaces/garrafa';

import { ValidatorVinho } from '../../../../validators/validator-vinho';

@Component({
	selector: 'app-editar-vinho-admin',
	templateUrl: './editar-vinho-admin.component.html',
	styleUrls: ['./editar-vinho-admin.component.css']
})
export class EditarVinhoAdminComponent implements OnInit {
	// Vinho selecionado
  	id: number;
	private sub: any;
	VinhoForm: FormGroup;
	// DropDowns
	tipoVinhos: string[] = ["Verde", "Rosé", "Tinto", "Branco", "Espumante", "Quinta"];
	// Vinho selecionado
	vinho: TipoVinho;
  	// Lista de tipos de vinho a ler da BD
	vinhos: TipoVinho[];
	// Lista de modelos caixa a ler da BD
	caixas: Caixa[];
	// Lista de modelos garrafa a ler da BD
	garrafas: Garrafa[];

	constructor( private route: ActivatedRoute, private router: Router, private fb: FormBuilder ) { }

	ngOnInit() {
		// Subscrição dos parametros do vinho escolhido para editar
		this.sub = this.route.params.subscribe(
			params => { this.id = +params['id']; }
		)
		this.iniListaVinhos();
		this.iniListaCaixas();
		this.iniListaGarrafas();
		// Procura na lista de vinhos (a ser lida da BD)
		this.vinho = this.vinhos.find(x => x.id == this.id);
		this.iniVinhoForm();
		this.resetForm(this.vinho);
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

	// Editar o vinho após verificações
	editarVinho(form){
		// Array com caixas com o tipo de vinho selecionado
		var caixasComIdVinho: Caixa[] = this.caixas.filter(x => x.tipoVinho == this.vinho.id);
		// Array com garrafas com o tipo de vinho selecionado
		var garrafasComIdVinho: Garrafa[] = this.garrafas.filter(x => x.tipoVinho == this.vinho.id);
		if (caixasComIdVinho.length == 0 && garrafasComIdVinho.length == 0) alert("O tipo de vinho foi editado com sucesso!");
		else{
			if (caixasComIdVinho.length != 0 && garrafasComIdVinho.length != 0){
				if (confirm("Este vinho, que quer editar, está a ser utilizado como stock em garrafas e caixas. Pretende editá-lo mesmo assim?")){
					alert("O tipo de vinho foi editado com sucesso!");
					this.router.navigate(['/admin/vinhos']);
				}
				else this.clearDados();
			}
			else{
				if (caixasComIdVinho.length != 0){
					if (confirm("Este vinho, que quer editar, está a ser utilizado como stock em caixas. Pretende editá-lo mesmo assim?")){
						alert("O tipo de vinho foi editado com sucesso!");
						this.router.navigate(['/admin/vinhos']);
					}
					else this.clearDados();
				} 
				else{
					if (confirm("Este vinho, que quer editar, está a ser utilizado como stock em garrafas. Pretende editá-lo mesmo assim?")){
						alert("O tipo de vinho foi editado com sucesso!");
						this.router.navigate(['/admin/vinhos']);
					}
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
		this.VinhoForm.controls['marca'].setValue(vinho.marca);
		this.VinhoForm.controls['tipo'].setValue(vinho.tipo);
		this.VinhoForm.controls['categoria'].setValue(vinho.categoria);
	}

	ngOnDestroy(){
		this.sub.unsubscribe();
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

	// Dados criados (A ser subsituido pela ligação à BD)
	iniListaCaixas(){
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
			tipoVinho: 2,
			quantidade: 50
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

}