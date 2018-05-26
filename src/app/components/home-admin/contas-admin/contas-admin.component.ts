import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '../../../interfaces/user';

import { FiltrosService } from '../../../services/funcoes-service/filtros.service';

@Component({
	selector: 'app-contas-admin',
	templateUrl: './contas-admin.component.html',
	styleUrls: ['./contas-admin.component.css']
})
export class ContasAdminComponent implements OnInit {
	FiltroForm: FormGroup;
	estadoTabela: boolean = true;
  	// Lista de utilizadores a ler da BD
  	users: User[];

  	constructor( private router: Router, private fb: FormBuilder, private filtroService: FiltrosService ) { 
		this.FiltroForm = fb.group({
			'username': ['', Validators.required] 
		});
	}

  	ngOnInit() {
		this.iniListaUsers();
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
			if (confirm("Quer mesmo eliminar este utilizador?")){
				alert("O utilizador foi eliminado com sucesso!");
				this.router.navigate(['/admin/contas']);
			}
		}
	}

	// Pesquisa a um determinado username
	pesquisaUsername(form){
		var username = form.username;
		this.iniListaUsers();
		if (username != ""){
			this.users = this.filtroService.pesquisaUsername(this.users, username);
			if (this.users.length == 0){
				this.iniListaUsers();
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
		this.iniListaUsers();
		this.estadoTabela = true;
		this.clearForm();
	}

	// Dados criados (A ser subsituido pela ligação à BD)
	iniListaUsers(){
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
