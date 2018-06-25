import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from "rxjs/Observable";
import { Subscription } from 'rxjs/Subscription';

import { User } from '../../../../interfaces/user';

import { ValidatorPassword, ValidatorEditar } from '../../../../validators/validator-login';

import { UserServiceService } from '../../../../services/user/user-service.service';

@Component({
	selector: 'app-editar-conta-admin',
	templateUrl: './editar-conta-admin.component.html',
	styleUrls: ['./editar-conta-admin.component.css']
})
export class EditarContaAdminComponent implements OnInit, OnDestroy {
	// Utilizador selecionado
	id: number;
	private sub: any;
	UserForm: FormGroup;
	// Utilizador selecionado
	user: User;
  	// Lista de utilizadores a ler da BD
	users: User[] = [];

	private subUser: Subscription;

  	constructor( private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private userService: UserServiceService ) { }

  	ngOnInit() {
		// Subscrição dos parametros do utilizador escolhido para editar
		this.sub = this.route.params.subscribe(
		  params => { this.id = +params['id']; }
		)
		this.getUsers();
	}

	ngOnDestroy(){
		this.subUser.unsubscribe();
	}

	// Subcrição do service UserService e obtenção dos dados de todos os utilizadores provenientes da BD
	getUsers(){
		this.subUser = this.userService.getUsers().subscribe(
			data => {
				this.users = data
			},
			err => console.error(err),
			() => {
				this.iniUserForm();
				this.getSelectedUser();
			}
		);
	}

	// Editar um utilizador selecionado
	editUser(editUser){
		const editUsers = this.userService.editUser(editUser).subscribe(
			data => data,
			err => console.error(err),
			() => {
				setTimeout(() => {
					alert("O Utilizador foi editado com sucesso!");
					this.router.navigate(['/admin/contas']);					
				}, 1000);				
			}
		);
	}

	// Informação do utilizador selecionado
	getSelectedUser(){
		this.user = this.users.find(x => x.Id == this.id);
		this.resetForm(this.user);	
	}

	// Inicializa o objeto form UserForm
	iniUserForm(){
		this.UserForm = this.fb.group({
			'email': ['', [Validators.required, Validators.email]],
			'username': ['', [Validators.required, Validators.minLength(5)]],
			'password': ['', [Validators.required, Validators.minLength(5)]],
			'cPassword': ['', [Validators.required, Validators.minLength(5)]]
			}, { 
				validator: [ 
					ValidatorPassword(), 
					ValidatorEditar(this.users, this.id) 
				]}
		);
	}

	// Editar o utilizador após verificações
	editarConta(form){
		var editUser: User = {
			Id: this.user.Id,
			Email: form.email,
			Username: form.username,
			_Password: form.password,
			TipoUtilizador: this.user.TipoUtilizador
		}
		this.editUser(editUser);
	}

	// Reset dos dados da form
	clearDados(){
		this.resetForm(this.user);
	}

	// Coloca a form com os dados pre-selecionados
	resetForm(user: User){
		this.UserForm.controls['email'].setValue(user.Email);
		this.UserForm.controls['username'].setValue(user.Username);
		this.UserForm.controls['password'].setValue(user._Password);
		this.UserForm.controls['cPassword'].setValue(user._Password);
	}

}