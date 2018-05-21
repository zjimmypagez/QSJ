import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../../../../interfaces/user';

import { ValidatorPassword, ValidatorEditar } from '../../../../validators/validator-login';

@Component({
	selector: 'app-editar-conta-admin',
	templateUrl: './editar-conta-admin.component.html',
	styleUrls: ['./editar-conta-admin.component.css']
})
export class EditarContaAdminComponent implements OnInit {
	id: number;
	private sub: any;
	UserForm: FormGroup;

	user: User;

  	// Lista de utilizadores a ler da BD
	users: User[];

  	constructor( private route: ActivatedRoute, private router: Router, private fb: FormBuilder ) { }

  	ngOnInit() {
    	this.iniListaUsers();
    	// Subscrição dos parametros do utilizador escolhido para editar
		this.sub = this.route.params.subscribe(
			params => { this.id = +params['id']; }
		)
		// Procura na lista de utilizadores (a ser lida da BD)
		for (let i = 0; i < this.users.length; i++){
			if (this.users[i].id == this.id)
			  this.user = this.users[i];
		}
		this.iniUserForm();
		this.resetForm(this.user);	  
	}

	// Inicializa o objeto form UserForm
	iniUserForm(){
		this.UserForm = this.fb.group({
			'email': ['', [Validators.required, Validators.email]],
			'username': ['', [Validators.required, Validators.minLength(5)]],
			'password': ['', [Validators.required, Validators.minLength(5)]],
			'cPassword': ['', [Validators.required, Validators.minLength(5)]]
		}, { validator: [ValidatorPassword(), ValidatorEditar(this.users, this.user)] }
		);
	}

	// Editar o utilizador após verificações
	editarConta(form){
		var user: any = form;
		alert("O Utilizador " + this.user.username + " foi editado com sucesso!");
		this.router.navigate(['/admin/contas']);
	}

	// Reset dos dados da form
	clearDados(){
		this.resetForm(this.user);
	}

	ngOnDestroy(){
		this.sub.unsubscribe();
	}

	// Coloca a form com os dados pre-selecionados
	resetForm(user: User){
		this.UserForm.controls['email'].setValue(user.email);
		this.UserForm.controls['username'].setValue(user.username);
		this.UserForm.controls['password'].setValue(user.password);
		this.UserForm.controls['cPassword'].setValue(user.password);
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