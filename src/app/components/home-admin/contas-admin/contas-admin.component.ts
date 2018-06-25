import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from "rxjs/observable";
import { Subscription } from 'rxjs/Subscription';

import { User } from '../../../interfaces/user';

import { FiltrosService } from '../../../services/funcoes-service/filtros.service';
import { UserServiceService } from '../../../services/user/user-service.service';

@Component({
	selector: 'app-contas-admin',
	templateUrl: './contas-admin.component.html',
	styleUrls: ['./contas-admin.component.css']
})
export class ContasAdminComponent implements OnInit, OnDestroy {
	FiltroForm: FormGroup;
	estadoTabela: boolean = true;
  	// Lista de utilizadores a ler da BD
	users: User[] = [];
	// Lista auxiliar total de utilizadores a ler da BD
	usersAux: User[];

	private subUser: Subscription;

  	constructor( private router: Router, private fb: FormBuilder, private filtroService: FiltrosService, private userService: UserServiceService ) { 
		this.FiltroForm = fb.group({
			'username': ['', Validators.required] 
		});
	}

  	ngOnInit() {
		this.getUsers();
	}
	  
	ngOnDestroy(){
		this.subUser.unsubscribe();
	}

	// Subcrição do service UserService e obtenção dos dados de todos os utilizadores provenientes da BD
	getUsers(){
		this.subUser = this.userService.getUsers().subscribe(
			data => { 
				this.users = data; 
				this.usersAux = data 
			},
			err => console.error(err)
		);
	}

	// Eliminar utilizador por Id e recarregamento dos dados de todos os utilizadores provenientes da BD
	deleteUserById(id: number){
		const deleteUser = this.userService.deleteUserById(id).subscribe(
			data => data,
			err => console.error(err),
			() => {
				setTimeout(() => {
					alert("O utilizador foi eliminado com sucesso!");
					this.getUsers();					
				}, 1000);
			}
		);		
	}

	// Função responsável por selecionar o utilizador a ser editado
	editarUser(id: number){
		this.router.navigate(['/admin/contas/editar', id]);
	}

	// Responsável por eliminar um utilizador selecionado após verificações
	eliminarUser(id: number){
		// Variavel que determina se um utilizador pode ser eliminado
		var estadoUser: boolean = true;
		// Verificar junto dos registo se existem registos feitos por o utilizador a eliminar
		if (estadoUser){
			if (confirm("Quer mesmo eliminar este utilizador?")) this.deleteUserById(id);
		}
	}

	// Pesquisa a um determinado username
	pesquisaUsername(form){
		var username = form.username;
		this.reloadUsers();
		if (username != ""){
			this.users = this.filtroService.pesquisaUsername(this.users, username);
			if (this.users.length == 0){
				this.reloadUsers();
				this.estadoTabela = false;
			}
			else this.estadoTabela = true;
		}
	}

	// Limpar Form
	clearForm(){
		this.FiltroForm.controls['username'].reset('');
	}

	// Limpar pesquisa
	clearTabela(){
		this.reloadUsers();
		this.estadoTabela = true;
		this.clearForm();
	}

	// Recarregamento de todos os utilizadores
	reloadUsers(){
		this.users = [];
		this.users = this.usersAux;
	}

}
