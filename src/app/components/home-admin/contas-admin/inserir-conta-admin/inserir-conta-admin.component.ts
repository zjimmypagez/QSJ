import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { User } from '../../../../interfaces/user';

@Component({
	selector: 'app-inserir-conta-admin',
	templateUrl: './inserir-conta-admin.component.html',
	styleUrls: ['./inserir-conta-admin.component.css']
})
export class InserirContaAdminComponent implements OnInit {
	UserForm: FormGroup;
	User: formUser;

	// Lista de utilizadores a ler da BD
	users: User[];

	constructor( private router: Router, private fb: FormBuilder ) { 
		this.UserForm = fb.group({
			'email': ['', Validators.compose([Validators.required, Validators.email])],
			'username': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
			'password': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
			'cPassword': ['', Validators.compose([Validators.required, Validators.minLength(5)])]
		});
	}

	ngOnInit() {
		this.iniFormUser();
		this.iniListaUsers();
	}

	// Novo utilizador após verificações
	novaConta(form){
		this.User = form;
		
		// Variavel que diz se um utilizador está pronto para ser inserido ou não
		var estadoUser: boolean = true;
		// Array que cataloga o erro
		var erro: number[] = this.errosColect();
		
		if ((erro[0] + erro[1] + erro[2] + erro[3]) != 0){
			estadoUser = false;
		}

		if (estadoUser){
			alert("O Utilizador " + this.User.username + " foi criado com sucesso!");
			this.router.navigate(['/admin/contas']);
		}
		else{
			if (erro[3] * erro[2] == 1){
				alert("O email que inseriu já se encontra em uso, assim como o username. As passwords tem de ser iguais!");
				this.clearForm();
			}
			else{
				if (erro[2] == 1){
					alert("O email que inseriu já se encontra em uso, assim como o username.");
					this.UserForm.controls['username'].setValue('');
					this.UserForm.controls['email'].setValue('');
				}
				else{
					if (erro[0] == 1){
						alert("O username que inseriu já se encontra em uso");
						this.UserForm.controls['username'].setValue('');
					}
					if (erro[1] == 1){
						alert("O email que inseriu já se encontra em uso!");
						this.UserForm.controls['email'].setValue('');
					}
				}
				if (erro[3] == 1){
					alert("As passwords tem de ser iguais!");
					this.UserForm.controls['password'].setValue('');
					this.UserForm.controls['cPassword'].setValue('');
				}
			}
		}

	}

	// Limpa os dados do Formulário
	clearDados(){
		this.clearForm();
	}

	// Função de verificação de erros Formulário UserForm
	public errosColect(): number[]{
		// Array que cataloga o erro
		var erro: number[] = [0, 0, 0, 0]; // Index: 0 - username já existe
										 			  // Index: 1 - email já existe
										 			  // Index: 2 - email e username já existem
										 			  // Index: 3 - password inseridas são diferentes
										 
		for (let i = 0; i < this.users.length; i++){
			if (this.users[i].username == this.User.username && this.users[i].email == this.User.email){
				erro[2] = 1;
			}
			else{
				if (this.users[i].username == this.User.username){
					erro[0] = 1;
				}
				if (this.users[i].email == this.User.email){
					erro[1] = 1;
				}
			}
		}

		if (this.User.password != this.User.cPassword){
			erro[3] = 1;
		}

		return erro;
	}

	// Iniciar o objeto User
	public iniFormUser(){
		this.User = {
			email: '',
			username: '',
			password: '',
			cPassword: ''
		}
	}

	// Dados criados (A ser subsituido pela ligação à BD)
	public iniListaUsers(){
		this.users = [{
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

	// Função que limpa os dados do form UserForm
	public clearForm(){
		this.UserForm.controls['email'].setValue('');
		this.UserForm.controls['username'].setValue('');
		this.UserForm.controls['password'].setValue('');
		this.UserForm.controls['cPassword'].setValue('');
	}
}

interface formUser{
	email: string,
	username: string,
	password: string,
	cPassword: string
}