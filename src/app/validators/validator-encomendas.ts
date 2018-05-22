import { ValidatorFn, AbstractControl, FormArray } from '@angular/forms';

import { Caixa } from '../interfaces/caixa';
import { Garrafa } from '../interfaces/garrafa';

// Validator que verifica se já existe o registo inserido
export function ValidatorEncomendaCaixasNormaisQuantidade(caixas: Caixa[], garrafas: Garrafa[]): ValidatorFn{
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const idCaixa = control.get('caixa').value;
        const idGarrafa = control.get('garrafa').value;
        if (control.parent == undefined) return { 'Waiting': true }
        var caixa: Caixa;
        for (let i = 0; i < caixas.length; i++){
            if (idCaixa == caixas[i].id) caixa = caixas[i];
        }
        console.log(control);
        console.log(caixa);
        if (caixa == undefined) return { 'WaitingModeloCaixa': true }
        var garrafa: Garrafa;
        for (let i = 0; i < garrafas.length; i++){
            if (idGarrafa == garrafas[i].id) garrafa = garrafas[i];
        }
        console.log(control);
        console.log(garrafa);
        if (garrafa == undefined) return { 'WaitingModeloGarrafa': true }
        var quantidadeCaixa: number = 0;
        for (let i = 0; i < control.parent.length; i++){
            if (control.parent.at(i).get('caixa').value == idCaixa) quantidadeCaixa += control.parent.at(i).get('quantidade').value;
        }
        console.log(control);
        console.log(quantidadeCaixa);
        if (caixa.quantidade < quantidadeCaixa) return { 'ValidQuantidadeCaixas': true }
        var quantidadeGarrafa: number = 0;
        for (let i = 0; i < control.parent.length; i++){
            if (control.parent.at(i).get('garrafa').value == idGarrafa) quantidadeGarrafa += control.parent.at(i).get('quantidade').value * caixa.garrafas;
        }
        console.log(control);
        console.log(quantidadeGarrafa);
        if (garrafa.cRotulo < quantidadeGarrafa) return { 'ValidQuantidadeGarrafas': true }
        return null;
    };
}

// Validator que verifica se já existe o registo inserido
export function ValidatorEncomendaCaixasNormaisRegisto(): ValidatorFn{
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const idCaixa = control.get('caixa').value;
        const idGarrafa = control.get('garrafa').value;
        if (control.parent == undefined) return { 'Waiting': true }
        var existe: number = 0;
        for (let i = 0; i < control.parent.length; i++){
            if (control.parent.at(i).get('caixa').value == idCaixa && control.parent.at(i).get('garrafa').value == idGarrafa) existe++;
        }
        if (existe > 1) return { 'ValidCaixasNormaisRegisto': true }
        return null;
    };
}