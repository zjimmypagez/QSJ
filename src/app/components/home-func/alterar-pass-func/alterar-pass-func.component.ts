import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
	selector: 'app-alterar-pass-func',
	templateUrl: './alterar-pass-func.component.html',
	styleUrls: ['./alterar-pass-func.component.css']
})
export class AlterarPassFuncComponent implements OnInit {
	AlterarForm: FormGroup;
	Alterar: formAlterar;

	constructor( private router: Router, private fb: FormBuilder ) { 
		this.AlterarForm = fb.group({
			'password': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
			'cPassword': ['', Validators.compose([Validators.required, Validators.minLength(5)])]
		});
	}

	
	ngOnInit() {
		this.iniFormAlterar();
	}
	
	editarPassword(form){
		this.Alterar = form;

		var estadoAlterar: boolean = false;

		if (this.Alterar.password == this.Alterar.cPassword){
			estadoAlterar = true;
			this.router.navigate(['/func']);
		}

		if (estadoAlterar){
			alert("Password alterada com sucesso!");
		}
		else{
			this.clearDados();
			alert("As passwords não são iguais!");
		}

	}

	// Limpar dados do formulário
	clearDados(){
		this.AlterarForm.controls['password'].setValue('');
		this.AlterarForm.controls['cPassword'].setValue('');
	}

	// Iniciar o objeto Alterar
	public iniFormAlterar(){
		this.Alterar = {
			password: '',
			cPassword: ''
		}
	}

}

// Dados recebidos do formulário
interface formAlterar{
	password: string,
	cPassword: string
}