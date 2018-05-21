import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { ValidatorPassword } from '../../../validators/validator-login';

@Component({
	selector: 'app-alterar-pass-func',
	templateUrl: './alterar-pass-func.component.html',
	styleUrls: ['./alterar-pass-func.component.css']
})
export class AlterarPassFuncComponent implements OnInit {
	AlterarForm: FormGroup;

	constructor( private router: Router, private fb: FormBuilder ) { }
	
	ngOnInit() {
		this.iniAlterarForm();
	}

	// Inicializar objeto form AlterarForm
	iniAlterarForm(){
		this.AlterarForm = this.fb.group({
			'password': ['', [Validators.required, Validators.minLength(5)]],
			'cPassword': ['', [Validators.required, Validators.minLength(5)]]
		}, { validator: ValidatorPassword() }
		);
	}
	
	// Alterar a password
	editarPassword(form){
		var password: any = form.password;
		var cPassword: any = form.cPassword;
		alert("Password alterada com sucesso!");
		this.router.navigate(['/func']);
	}

	// Limpar dados do formulário
	clearDados(){
		this.AlterarForm.controls['password'].reset('');
		this.AlterarForm.controls['cPassword'].reset('');
		this.AlterarForm.markAsUntouched();
	}

}

// Dados recebidos do formulário
interface formAlterar{
	password: string,
	cPassword: string
}