import { ValidatorFn, AbstractControl } from '@angular/forms';

import { User } from '../interfaces/user';

// Validator que verifica se a password de confirmação é igual a password
export function ValidatorPassword(): ValidatorFn{
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const password = control.root.get('password').value;
        const cPassword = control.root.get('cPassword').value;
        if (password != cPassword) return { 'ValidPassword': true };        
        return null;
    };
}

// Validator que verifica se já há alguma conta com o username inserido
export function ValidatorUsername(users: User[]): ValidatorFn{
    return (control: AbstractControl): { [key: string]: boolean } | null => {   
        const username = control.value;
        var existe: boolean = false;
        for (let i = 0; i < users.length; i++){
            if (users[i].username.toUpperCase() == username.toUpperCase()) existe = true;
        }
        if (existe) return { 'ValidUsername': true };        
        return null;
    };
}

// Validator que verifica se já há alguma conta com o email inserido
export function ValidatorEmail(users: User[]): ValidatorFn{
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const email = control.value;
        var existe: boolean = false;
        for (let i = 0; i < users.length; i++){
            if (users[i].email == email) existe = true;
        }
        if (existe) return { 'ValidEmail': true };        
        return null;
    };
}

// Validator que verifica se já há alguma conta com o email e username inserido ou se o inserido esta inalterado face ao editar
export function ValidatorEditar(users: User[], user: User): ValidatorFn{
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const email = control.get('email').value;
        const username = control.get('username').value;
        if (email == user.email && username == user.username) return { 'EditarInalterado': true }
        else{
            if (email == user.email){
                var existeUsername: boolean = false;
                for (let i = 0; i < users.length; i++){
                    if (users[i].username.toUpperCase() == username.toUpperCase() && users[i].username != user.username) existeUsername = true;
                }
                if (existeUsername) return { 'ValidUsername': true }
            }
            else{
                if (username == user.username){
                    var existeEmail: boolean = false;
                    for (let i = 0; i < users.length; i++){
                        if (users[i].email == email && users[i].email != user.email) existeEmail = true;
                    }
                    if (existeEmail) return { 'ValidEmail': true }   
                }
                else return null;
            }
        }     
    };
}