import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs/observable";
import { Subscription } from 'rxjs/Subscription';

import { User } from "../../../interfaces/user";

import { UserServiceService } from "../../../services/user/user-service.service";

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
	LoginForm: FormGroup;
	// Lista de utilizadores a ler da BD
	users: User[];

	private subs: Subscription;

	constructor( private router: Router, private fb: FormBuilder, private userService: UserServiceService ) {
		this.LoginForm = fb.group({
			'username': ['', [Validators.required, Validators.minLength(5)]],
			'password': ['', [Validators.required, Validators.minLength(5)]]
		});
	}

	ngOnInit() {
		this.getUsers();
	}

	ngOnDestroy(){
		this.subs.unsubscribe();
	}

	// Subcrição do service UserService e obtenção dos dados de todos os utilizadores provenientes da BD
	getUsers(){
		this.subs = this.userService.getUsers().subscribe(
			(data: User[]) => { this.users = data },
			err => console.error(err),
			() => console.log("fim de carregamento!")
		);
	}

	// Recolha dos dados do formulário e verificação das credenciais: username e password
	login(form){
		var username: any = form.username;
		var password: any = form.password;
		var estadoLogin: boolean = false;		
		if (username == "admin" && password == "admin"){
			estadoLogin = true;
			this.router.navigate(['/admin']);
		}
		else{
			for (let i = 0; i < this.users.length; i++){
				if (username == this.users[i].Username && password == this.users[i]._Password){
					estadoLogin = true;
					this.router.navigate(['/func']);
				}
			}
		}		
		if (estadoLogin) alert("Bem-vindo " + username + "!");
		else{			
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