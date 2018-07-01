import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from "rxjs/observable";
import { Subscription } from 'rxjs/Subscription';

import { User } from '../../../interfaces/user';

import { FiltrosService } from '../../../services/funcoes-service/filtros.service';
import { UserServiceService } from '../../../services/user/user-service.service';
import { OrdenarTablesService } from '../../../services/funcoes-service/ordenar-tables.service';

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

	  constructor( 
		  private router: Router, 
		  private fb: FormBuilder, 
		  private filtroService: FiltrosService, 
		  private userService: UserServiceService,
		  private ordenarService: OrdenarTablesService
		) { 
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
			err => console.error(err),
			() => {
				this.users = this.ordenarService.ordenarTabelaUsername(this.users);
				this.users = this.users.filter(x => x.Username != "Ex-funcionário");
				this.usersAux = this.users;
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
					alert("O Utilizador foi eliminado com sucesso!");
					this.router.navigate(['/admin/contas']);					
				}, 500);				
			}
		);
	}

	// Função responsável por selecionar o utilizador a ser editado
	editarUser(id: number){
		this.router.navigate(['/admin/contas/editar', id]);
	}

	// Responsável por eliminar um utilizador selecionado após verificações
	eliminarUser(id: number){
		var userEdit: User = {
			Id: id,
			Email: "",
			Username: "Ex-funcionário",
			_Password: "",
			TipoUtilizador: 1
		}
		if (confirm("Quer mesmo eliminar este utilizador?")) this.editUser(userEdit);
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
