import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { User } from '../../../../interfaces/user';

import { ValidatorPassword, ValidatorUsername, ValidatorEmail } from '../../../../validators/validator-login';

@Component({
	selector: 'app-inserir-conta-admin',
	templateUrl: './inserir-conta-admin.component.html',
	styleUrls: ['./inserir-conta-admin.component.css']
})
export class InserirContaAdminComponent implements OnInit {
	UserForm: FormGroup;

	// Lista de utilizadores a ler da BD
	users: User[];

	constructor( private router: Router, private fb: FormBuilder ) { }

	ngOnInit() {
		this.iniListaUsers();
		this.iniUserForm();
	}

	// Inicializa o objeto form UserForm
	iniUserForm(){
		this.UserForm = this.fb.group({
			'email': ['', [Validators.required, Validators.email, ValidatorEmail(this.users)]],
			'username': ['', [Validators.required, Validators.minLength(5), ValidatorUsername(this.users)]],
			'password': ['', [Validators.required, Validators.minLength(5)]],
			'cPassword': ['', [Validators.required, Validators.minLength(5)]]
		}, { validator: ValidatorPassword() }
		);
	}

	// Novo utilizador após verificações
	novaConta(form){
		var user: any = form;
		alert("O Utilizador " + user.username + " foi criado com sucesso!");
		this.router.navigate(['/admin/contas']);
	}

	// Limpa os dados do Formulário
	clearDados(){
		this.clearForm();
	}

	// Função que limpa os dados do form UserForm
	clearForm(){
		this.UserForm.controls['email'].reset('');
		this.UserForm.controls['username'].reset('');
		this.UserForm.controls['password'].reset('');
		this.UserForm.controls['cPassword'].reset('');
		this.UserForm.markAsUntouched();
	}

	// Dados criados (A ser subsituido pela ligação à BD)
	iniListaUsers(){
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
}