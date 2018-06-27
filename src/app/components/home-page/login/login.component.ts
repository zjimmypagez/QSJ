import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs/observable";
import { Subscription } from 'rxjs/Subscription';

import { User } from "../../../interfaces/user";

import { UserServiceService } from "../../../services/user/user-service.service";
import { AuthService } from '../../../services/auth/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
	LoginForm: FormGroup;
	// Lista de utilizadores a ler da BD
	users: User[] = [];

	private subUsers: Subscription;

	constructor( 
		private router: Router, 
		private fb: FormBuilder, 
		private userService: UserServiceService,
		private authService: AuthService 
	) {
		this.LoginForm = fb.group({
			'username': ['', [Validators.required, Validators.minLength(5)]],
			'password': ['', [Validators.required, Validators.minLength(5)]]
		});
	}

	ngOnInit() {
		this.getUsers();
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

	// Subscrição do service AuthService para autenticação de uma determinada conta admin
	authLoginAdmin(admin: User){
		const login = this.authService.login(admin).subscribe(
			data => data,
			err => console.error(err),
			() => {
				setTimeout(() => {
					alert("Bem-vindo " + admin.Username + "!");
					this.router.navigate(['/admin']);
				}, 500);
			}
		);
	}

	// Subscrição do service AuthService para autenticação de uma determinada conta func
	authLoginFunc(func: User){
		const login = this.authService.login(func).subscribe(
			data => data,
			err => console.error(err),
			() => {
				setTimeout(() => {
					alert("Bem-vindo " + func.Username + "!");
					this.router.navigate(['/func']);						
				}, 500);
			}
		);
	}

	// Recolha dos dados do formulário e verificação das credenciais: username e password
	login(form){
		var username: any = form.username;
		var password: any = form.password;
		var estadoLogin: boolean = false;		
		if (username == "admin" && password == "admin"){
			var userAdmin: User = {
				Id: 0,
				Email: '',
				Username: 'admin',
				_Password: 'admin',
				TipoUtilizador: 0
			}
			estadoLogin = true;
			this.authLoginAdmin(userAdmin);	
		}
		else{
			for (let i = 0; i < this.users.length; i++){
				if (username == this.users[i].Username && password == this.users[i]._Password){
					var userFunc: User = {
						Id: this.users[i].Id,
						Email: this.users[i].Email,
						Username: this.users[i].Username,
						_Password: this.users[i]._Password,
						TipoUtilizador: this.users[i].TipoUtilizador
					}						
					estadoLogin = true;
					this.authLoginFunc(userFunc);				
				}
			}
		}
		
		if (!estadoLogin){
			this.clearDados();
			alert("Credenciais incorretas!");
		}
	}

	// Limpar Form
	clearDados(){
		this.LoginForm.controls['username'].reset('');
		this.LoginForm.controls['password'].reset('');
		this.LoginForm.controls['username'].markAsUntouched();
		this.LoginForm.controls['password'].markAsUntouched();
	}
}