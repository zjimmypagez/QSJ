import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";

import { User } from "../../../interfaces/user";

@Component({
	selector: 'app-recuperar',
	templateUrl: './recuperar.component.html',
	styleUrls: ['./recuperar.component.css']
})
export class RecuperarComponent implements OnInit {
  	RecuperarForm: FormGroup;

	// Lista de utilizadores a ler da BD
	Users: User[];

	constructor( private router: Router, private fb: FormBuilder ) { 
		this.RecuperarForm = fb.group({
			'email': ['', [Validators.required, Validators.email]]
		});
	}

	ngOnInit() {
		this.iniListaUsers();
	}

	// Recolha dos dados do formulário e verificação do email
	recuperarPassword(form){
		var email: any = form;
		var estadoRecuperar = this.Users.filter(x => x.email == email);		
		if (estadoRecuperar.length == 1){
			alert("Foi enviado um email com as novas credenciais!");
			this.router.navigate(['']);
		}
		else{
			this.clearDados();
			alert("O email que indicou não tem conta neste site!");
		}
	}

	// Limpa os dados do formulário
	clearDados(){
		this.RecuperarForm.controls['email'].reset('');
	}

	// Dados criados (A ser subsituido pela ligação à BD)
	iniListaUsers(){
		this.Users = [{
			id: 1,
			email: 'user1@gmail.com',
			username: 'user1',
			password: '123456'
		},
		{
			id: 2,
			email: 'user2@gmail.com',
			username: 'user2',
			password: '123456'
		}];
	}

}