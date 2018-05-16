import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../../../../interfaces/user';

@Component({
	selector: 'app-editar-conta-admin',
	templateUrl: './editar-conta-admin.component.html',
	styleUrls: ['./editar-conta-admin.component.css']
})
export class EditarContaAdminComponent implements OnInit {
	id: number;
	private sub: any;
	UserForm: FormGroup;
	User: formUser;

	user: User;

  	// Lista de utilizadores a ler da BD
	users: User[];

  	constructor( private route: ActivatedRoute, private router: Router, private fb: FormBuilder ) { 
    	this.UserForm = fb.group({
			'email': ['', Validators.compose([Validators.required, Validators.email])],
			'username': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
			'password': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
			'cPassword': ['', Validators.compose([Validators.required, Validators.minLength(5)])]
		});
  	}

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

		this.resetForm(this.user);
	  
	}

	// Editar o utilizador após verificações
	editarConta(form){
		this.User = form;

		// Variavel que diz se um utilizador está pronto para ser editado ou não
		var estadoUser: boolean = true;
		// Array que cataloga o erro
		var erro: number[] = this.errosColect();

		if ((erro[0] + erro[1] + erro[2] + erro[3]) != 0){
			estadoUser = false;
		}

		if (estadoUser){
			alert("O Utilizador " + this.User.username + " foi editado com sucesso!");
			this.router.navigate(['/admin/contas']);
		}
		else{
			if (erro[3] * erro[2] == 1){
				alert("O email que inseriu já se encontra em uso, assim como o username. As passwords tem de ser iguais!");
				this.resetForm(this.user);
			}
			else{
				if (erro[2] == 1){
					alert("O email que inseriu já se encontra em uso, assim como o username.");
					this.UserForm.controls['username'].setValue(this.user.username);
					this.UserForm.controls['email'].setValue(this.user.email);
				}
				else{
					if (erro[0] == 1){
						alert("O username que inseriu já se encontra em uso");
						this.UserForm.controls['username'].setValue(this.user.username);
					}
					if (erro[1] == 1){
						alert("O email que inseriu já se encontra em uso!");
						this.UserForm.controls['email'].setValue(this.user.email);
					}
				}
				if (erro[3] == 1){
					alert("As passwords tem de ser iguais!");
					this.UserForm.controls['password'].setValue(this.user.password);
					this.UserForm.controls['cPassword'].setValue(this.user.password);
				}
			}
		}
	}

	// Reset dos dados da form
	clearDados(){
		this.resetForm(this.user);
	}

	ngOnDestroy(){
		this.sub.unsubscribe();
	}

	// Função de verificação de erros Formulário UserForm
	errosColect(): number[]{
		// Array que cataloga o erro
		var erro: number[] = [0, 0, 0, 0]; // Index: 0 - username já existe
										 			  // Index: 1 - email já existe
										 			  // Index: 2 - email e username já existem
										 			  // Index: 3 - password inseridas são diferentes
										 
		for (let i = 0; i < this.users.length; i++){
			if (this.users[i] != this.user){
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
		}

		if (this.User.password != this.User.cPassword){
			erro[3] = 1;
		}

		return erro;
	}

	// Coloca a form com os dados pre-selecionados
	public resetForm(user: User){
		this.UserForm.controls['email'].setValue(user.email);
		this.UserForm.controls['username'].setValue(user.username);
		this.UserForm.controls['password'].setValue(user.password);
		this.UserForm.controls['cPassword'].setValue(user.password);
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
}

interface formUser{
	email: string,
	username: string,
	password: string,
	cPassword: string
}