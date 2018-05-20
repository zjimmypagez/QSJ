import { ValidatorFn, AbstractControl } from '@angular/forms';

import { Caixa } from '../interfaces/caixa';
import { RegistoCaixa } from '../interfaces/registoCaixa';

// Validator que verifica se existe quantidade de caixas para remover
export function ValidatorRemover(caixas: Caixa[], op: AbstractControl): ValidatorFn{
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const idCaixa = op.get('idCaixa').value;
        var caixa: Caixa;
        for (let i = 0; i < caixas.length; i++){
            if (idCaixa == caixas[i].id) caixa = caixas[i];
        }
        if (idCaixa == "") return { 'WaitingModelo': true }
        if (control.value == null) return { 'WaitingCRotulo': true }
        if (caixa.quantidade < control.value) return { 'ValidRemoverCaixa': true };        
        return null;
    };
}

// Validator que verifica se o comentário não foi alterado
export function ValidatorComentario(registo: RegistoCaixa): ValidatorFn{
    return (control: AbstractControl) : { [key: string]: boolean } | null => {
        if (control.value == registo.comentario) return { 'ComentarioInalterado': true }
        return null;
    };
}