import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../../interfaces/user';

@Component({
	selector: 'app-contas-admin',
	templateUrl: './contas-admin.component.html',
	styleUrls: ['./contas-admin.component.css']
})
export class ContasAdminComponent implements OnInit {
  	// Lista de utilizadores a ler da BD
  	users: User[];

  	constructor( private router: Router ) { }

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
