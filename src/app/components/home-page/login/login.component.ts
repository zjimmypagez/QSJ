import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { User } from "../../../interfaces/user";

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	LoginForm: FormGroup;
	Login: formLogin;

	// Lista de utilizadores a ler da BD
	Users: User[];

	constructor( private router: Router, private fb: FormBuilder ) {
		this.LoginForm = fb.group({
			'username': ['', [Validators.required, Validators.minLength(5)]],
			'password': ['', [Validators.required, Validators.minLength(5)]]
		});
	}

	ngOnInit() {
		this.iniFormLogin();
		this.iniListaUsers();
	}

	// Recolha dos dados do formulário e verificação das credenciais: username e password
	login(form){
		this.Login = form;
		var estadoLogin: boolean = false;		
		if (this.Login.username == "admin" && this.Login.password == "admin"){
			estadoLogin = true;
			this.router.navigate(['/admin']);
		}
		else{
			for (let i = 0; i < this.Users.length; i++){
				if (this.Login.username == this.Users[i].username && this.Login.password == this.Users[i].password){
					estadoLogin = true;
					this.router.navigate(['/func']);
				}
			}
		}		
		if (estadoLogin) alert("Bem-vindo " + this.Login.username + "!");
		else{			
			this.LoginForm.controls['username'].setValue('');
			this.LoginForm.controls['password'].setValue('');
			alert("Credenciais incorretas!");
		}
	}

	// Iniciar o objeto Login
	iniFormLogin(){
		this.Login = {
			username: '',
			password: ''
		}
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


// Dados recebidos do formulário
interface formLogin{
	username: string,
	password: string
}