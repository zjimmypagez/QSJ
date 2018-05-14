import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { User } from "../../../interfaces/user";

@Component({
	selector: 'app-recuperar',
	templateUrl: './recuperar.component.html',
	styleUrls: ['./recuperar.component.css']
})
export class RecuperarComponent implements OnInit {
  	RecuperarForm: FormGroup;
	Recuperar: formRecuperar;

	// Lista de utilizadores a ler da BD
	Users: User[];

	constructor( private router: Router, private fb: FormBuilder ) { 
		this.RecuperarForm = fb.group({
			'email': ['', Validators.compose([Validators.required, Validators.email])]
		});
	}

	ngOnInit() {
		this.iniFormRecuperar();
		this.iniListaUsers();
	}

	// Recolha dos dados do formulário e verificação do email
	recuperarPassword(form){
		this.Recuperar = form;

		var password: string;
		var estadoRecuperar: boolean = false;

		for (let i = 0; i < this.Users.length; i++){
			if (this.Recuperar.email == this.Users[i].email){
				estadoRecuperar = true;
				password = this.Users[i].password;
			}
		}
		
		if (estadoRecuperar){
			alert("Foi enviado um email com as novas credenciais!");
			this.router.navigate(['']);
			// email?
		}
		else{
			this.clearDados();
			alert("O email que indicou não tem conta neste site!");
		}
	}

	// Limpa os dados do formulário
	clearDados(){
		this.RecuperarForm.controls['email'].setValue('');
	}

	// Iniciar o objeto Recuperar
	public iniFormRecuperar(){
		this.Recuperar = {
			email: ''
		}
	}

	// Dados criados (A ser subsituido pela ligação à BD)
	public iniListaUsers(){
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

// Dados recebidos do formulário
interface formRecuperar{
	email: string
}