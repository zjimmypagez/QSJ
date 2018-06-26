import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs/observable";
import { Subscription } from 'rxjs/Subscription';

import { ValidatorPassword } from '../../../validators/validator-login';

import { User } from '../../../interfaces/user';

import { UserServiceService } from '../../../services/user/user-service.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
	selector: 'app-alterar-pass-func',
	templateUrl: './alterar-pass-func.component.html',
	styleUrls: ['./alterar-pass-func.component.css']
})
export class AlterarPassFuncComponent implements OnInit, OnDestroy {
	AlterarForm: FormGroup;
	// Lista de utilizadores a ler da BD
	users: User[] = [];

	private subUsers: Subscription;

	constructor( 
		private router: Router, 
		private fb: FormBuilder,
		private userService: UserServiceService,
		private authService: AuthService
	) { }
	
	ngOnInit() {
		this.getUsers();
		this.iniAlterarForm();
	}

	ngOnDestroy(){
		this.subUsers.unsubscribe();
	}

	// Subcrição do service UserService e obtenção dos dados de todos os utilizadores provenientes da BD
	getUsers(){
		this.subUsers = this.userService.getUsers().subscribe(
			data => { 
				this.users = data 
			},
			err => console.error(err)
		);
	}

	// Editar um utilizador selecionado
	editUser(editUser){
		const editUsers = this.userService.editUser(editUser).subscribe(
			data => data,
			err => console.error(err),
			() => {
				setTimeout(() => {
					alert("Password alterada com sucesso!");
					this.authService.logout();
					this.router.navigate(['/login']);				
				}, 500);				
			}
		);
	}

	// Inicializar objeto form AlterarForm
	iniAlterarForm(){
		this.AlterarForm = this.fb.group({
			'password': ['', [Validators.required, Validators.minLength(5)]],
			'cPassword': ['', [Validators.required, Validators.minLength(5)]]
			}, { 
				validator: ValidatorPassword() 
			}
		);
	}
	
	// Alterar a password
	editarPassword(form){
		var currentUser = JSON.parse(localStorage.getItem('currentUser'));
		var id: number = currentUser.userID;
		var user: User = this.users.find(x => x.Id == id);
		user._Password = form.password;
		this.editUser(user);
	}

	// Limpar dados do formulário
	clearDados(){
		this.AlterarForm.controls['password'].reset('');
		this.AlterarForm.controls['cPassword'].reset('');
		this.AlterarForm.markAsUntouched();
	}

}