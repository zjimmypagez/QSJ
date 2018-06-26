import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { Observable } from "rxjs/observable";
import { Subscription } from 'rxjs/Subscription';

import { User } from "../../../interfaces/user";

import { UserServiceService } from '../../../services/user/user-service.service';
import { RecuperarService } from '../../../services/mail/recuperar.service';

@Component({
	selector: 'app-recuperar',
	templateUrl: './recuperar.component.html',
	styleUrls: ['./recuperar.component.css']
})
export class RecuperarComponent implements OnInit, OnDestroy {
  	RecuperarForm: FormGroup;
	// Lista de utilizadores a ler da BD
	users: User[] = [];

	private subUsers: Subscription;

	constructor( 
		private router: Router, 
		private fb: FormBuilder, 
		private userService: UserServiceService,
		private recuperarService: RecuperarService
	) { 
		this.RecuperarForm = fb.group({
			'email': ['', [Validators.required, Validators.email]]
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

	// Subscrição do service RecuperarService para enviar email com novas credenciais
	sendMail(user: User){
		const senMails = this.recuperarService.recuperarPassword(user).subscribe(
			data => data,
			err => console.error(err),
			() => {
				setTimeout(() => {
					alert("Foi enviado um email com as novas credenciais!");
					this.router.navigate(['/login']);
				}, 500);
			}
		);
	}

	// Recolha dos dados do formulário e verificação do email
	recuperarPassword(form){
		var email: any = form.email;
		var estadoRecuperar: User = this.users.find(x => x.Email == email);		
		if (estadoRecuperar) this.sendMail(estadoRecuperar);
		else{
			this.clearDados();
			alert("O email que indicou não tem conta neste site!");
		}
	}

	// Limpa os dados do formulário
	clearDados(){
		this.RecuperarForm.controls['email'].reset('');
	}

}