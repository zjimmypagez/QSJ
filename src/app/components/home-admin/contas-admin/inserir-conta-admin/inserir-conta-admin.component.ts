import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { Observable } from "rxjs/Observable";
import { Subscription } from 'rxjs/Subscription';

import { User, UserSId } from '../../../../interfaces/user';

import { ValidatorPassword, ValidatorUsername, ValidatorEmail } from '../../../../validators/validator-login';

import { UserServiceService } from '../../../../services/user/user-service.service';

@Component({
	selector: 'app-inserir-conta-admin',
	templateUrl: './inserir-conta-admin.component.html',
	styleUrls: ['./inserir-conta-admin.component.css']
})
export class InserirContaAdminComponent implements OnInit, OnDestroy {
	UserForm: FormGroup;
	// Lista de utilizadores a ler da BD
	users: User[] = [];

	private subs: Subscription;

	constructor( private router: Router, private fb: FormBuilder, private userService: UserServiceService ) { }

	ngOnInit() {
		this.getUsers();
		this.iniUserForm();
	}

	ngOnDestroy(){
		this.subs.unsubscribe();
	}

	// Subcrição do service UserService e obtenção dos dados de todos os utilizadores provenientes da BD
	getUsers(){
		this.subs = this.userService.getUsers().subscribe(
			data => { this.users = data },
			err => console.error(err),
			() => {
				this.iniUserForm();
			}
		);
	}

	// Inserir novo utilizador
	createUser(newUser: UserSId){
		this.subs = this.userService.createUser(newUser).subscribe(
			data => data,
			err => console.error(err),
			() => {
				this.router.navigate(['/admin/contas']);
			}
		);
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
		var newUser: UserSId = {
			Email: form.email,
			Username: form.username,
			_Password: form.password,
			TipoUtilizador: 1
		}
		this.createUser(newUser);
		alert("O Utilizador " + newUser.Username + " foi criado com sucesso!");
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
}