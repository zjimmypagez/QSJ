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

	// Subscrição do service AuthService para autenticação de uma determinada conta func
	authLoginFunc(username: string, password: string){
		const login = this.authService.login(username, password).subscribe(
			data => {
				if (data === true){
					setTimeout(() => {
						alert("Bem-vindo " + username + "!");
						if (username == "admin" && password == "admin") this.router.navigate(['/admin']);
						else this.router.navigate(['/func']);						
					}, 500);
				}
				else{					
					this.clearDados();
					alert("Credenciais incorretas!");
				}
			},
			err => console.error(err)
		);
	}

	// Recolha dos dados do formulário e verificação das credenciais: username e password
	login(form){
		var username: any = form.username;
		var password: any = form.password;
		this.authLoginFunc(username, password);
	}

	// Limpar Form
	clearDados(){
		this.LoginForm.controls['username'].reset('');
		this.LoginForm.controls['password'].reset('');
		this.LoginForm.controls['username'].markAsUntouched();
		this.LoginForm.controls['password'].markAsUntouched();
	}
}