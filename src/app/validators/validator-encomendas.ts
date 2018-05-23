import { ValidatorFn, AbstractControl, FormArray } from '@angular/forms';

import { Caixa } from '../interfaces/caixa';
import { Garrafa } from '../interfaces/garrafa';

// Validator que verifica se já existe o registo inserido - caixas normais
export function ValidatorEncomendaCaixasRegisto(): ValidatorFn{
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const idCaixa = control.get('caixa').value;
        const idGarrafa = control.get('garrafa').value;
        if (control.parent == undefined) return { 'Waiting': true }
        var existe: number = 0;
        for (let i = 0; i < control.parent.length; i++){
            if (control.parent.at(i).get('caixa').value == idCaixa && control.parent.at(i).get('garrafa').value == idGarrafa) existe++;
        }
        if (existe > 1) return { 'ValidCaixasRegisto': true }
        return null;
    };
}

// Validator que verifica se já existe o registo inserido - caixas especiais
export function ValidatorEncomendaCaixasEspeciaisRegisto(): ValidatorFn{
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const idGarrafa = control.get('garrafa').value;
        if (control.parent == undefined) return { 'Waiting': true }        
        var existe: number = 0;
        for (let i = 0; i < control.parent.length; i++){
            if (control.parent.at(i).get('garrafa').value == idGarrafa) existe++;
        }
        if (existe > 1) return { 'ValidCaixasEspeciaisRegisto': true }
        return null;
    };
}

// Validator que verifica se existem, em stock, a quantidade de caixas propostas - caixas normais
export function ValidatorEncomendaQuantidadeCaixas(caixas: Caixa[]): ValidatorFn{
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const idCaixa = control.get('caixa').value;
        const quantidade = control.get('quantidade').value;
        var caixa: Caixa;
        for (let i = 0; i < caixas.length; i++){
            if (idCaixa == caixas[i].id) caixa = caixas[i];
        }
        if (caixa == undefined) return { 'WaitingModeloCaixa': true }
        if (control.parent == undefined) return { 'Waiting': true }
        var quantidadeCaixas: number = 0;
        for (let i = 0; i < control.parent.parent.get('linhaModelo').length; i++){
            if (control.parent.parent.get('linhaModelo').at(i).get('caixa').value == idCaixa) quantidadeCaixas += control.parent.parent.get('linhaModelo').at(i).get('quantidadeCaixa').value;
        }
        for (let i = 0; i < control.parent.length; i++){
            if (control.parent.at(i).get('caixa').value == idCaixa) quantidadeCaixas += control.parent.at(i).get('quantidade').value;
        }
        if (caixa.quantidade < quantidadeCaixas) return { 'ValidQuantidadeCaixas': true }
        return null;
    };
}

// Validator que verifica se existem, em stock, a quantidade de caixas propostas - caixas especiais
export function ValidatorEncomendaQuantidadeCaixasEspeciais(caixas: Caixa[]): ValidatorFn{
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const idCaixa = control.get('caixa').value;
        const quantidade = control.get('quantidadeCaixa').value;
        var caixa: Caixa;
        for (let i = 0; i < caixas.length; i++){
            if (idCaixa == caixas[i].id) caixa = caixas[i];
        }
        if (caixa == undefined) return { 'WaitingModeloCaixa': true }
        if (control.parent == undefined) return { 'Waiting': true }
        var quantidadeCaixas: number = 0;
        for (let i = 0; i < control.parent.parent.get('linhaCaixas').length; i++){
            if (control.parent.parent.get('linhaCaixas').at(i).get('caixa').value == idCaixa) quantidadeCaixas += control.parent.parent.get('linhaCaixas').at(i).get('quantidade').value;
        }
        for (let i = 0; i < control.parent.length; i++){
            if (control.parent.at(i).get('caixa').value == idCaixa) quantidadeCaixas += control.parent.at(i).get('quantidadeCaixa').value;
        }
        if (caixa.quantidade < quantidadeCaixas) return { 'ValidQuantidadeCaixas': true }
        return null;
    };
}

// Validator que verifica se existem, em stock, a quantidade de garrafas propostas - caixas normais
export function ValidatorEncomendaQuantidadeGarrafas(caixas: Caixa[], garrafas: Garrafa[]): ValidatorFn{
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const idCaixa = control.get('caixa').value;
        const idGarrafa = control.get('garrafa').value;
        const quantidade = control.get('quantidade').value;
        var caixa: Caixa;
        for (let i = 0; i < caixas.length; i++){
            if (idCaixa == caixas[i].id) caixa = caixas[i];
        }
        if (caixa == undefined) return { 'WaitingModeloCaixa': true }
        var garrafa: Garrafa;
        for (let i = 0; i < garrafas.length; i++){
            if (idGarrafa == garrafas[i].id) garrafa = garrafas[i];
        }
        if (garrafa == undefined) return { 'WaitingModeloGarrafa': true }
        if (control.parent == undefined) return { 'Waiting': true }
        var quantidadeGarrafas: number = 0;
        for (let i = 0; i < control.parent.parent.get('linhaModelo').length; i++){
            const quantidadeCaixa = control.parent.parent.get('linhaModelo').at(i).get('quantidadeCaixa').value;
            for (let j = 0; j < control.parent.parent.get('linhaModelo').at(i).get('linhaGarrafa').length; j++){
                if (control.parent.parent.get('linhaModelo').at(i).get('linhaGarrafa').at(j).get('garrafa').value == idGarrafa) quantidadeGarrafas += quantidadeCaixa * control.parent.parent.get('linhaModelo').at(i).get('linhaGarrafa').at(j).get('quantidadeGarrafa').value;
            }
        }
        for (let i = 0; i < control.parent.length; i++){
            if (control.parent.at(i).get('garrafa').value == idGarrafa) quantidadeGarrafas += caixa.garrafas * control.parent.at(i).get('quantidade').value;
        }
        if (garrafa.cRotulo < quantidadeGarrafas) return { 'ValidQuantidadeGarrafas': true }
        return null;
    };
}

// Validator que verifica se existem, em stock, a quantidade de garrafas propostas - caixas especiais
export function ValidatorEncomendaQuantidadeGarrafasEspeciais(caixas: Caixa[], garrafas: Garrafa[]): ValidatorFn{
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const idGarrafa = control.get('garrafa').value;
        const quantidade = control.get('quantidadeGarrafa').value;
        if (control.parent == undefined) return { 'Waiting': true }
        var garrafa: Garrafa;
        for (let i = 0; i < garrafas.length; i++){
            if (idGarrafa == garrafas[i].id) garrafa = garrafas[i];
        }
        if (garrafa == undefined) return { 'WaitingModeloGarrafa': true }  
        var quantidadeGarrafas: number = 0;
        const modelo = control.parent.parent.parent.parent;
        for (let i = 0; i < modelo.get('linhaCaixas').length; i++){
            const idCaixa = modelo.get('linhaCaixas').at(i).get('caixa').value;
            var caixa: Caixa;
            for (let i = 0; i < caixas.length; i++){
                if (idCaixa == caixas[i].id) caixa = caixas[i];
            }
            if (caixa != undefined){
                if (modelo.get('linhaCaixas').at(i).get('garrafa').value == idGarrafa) quantidadeGarrafas += caixa.garrafas * modelo.get('linhaCaixas').at(i).get('quantidade').value;
            }
        }
        const linha = control.parent.parent.parent
        for (let i = 0; i < linha.length; i++){            
            for (let j = 0; j < linha.at(i).get('linhaGarrafa').length; j++){
                if (linha.at(i).get('linhaGarrafa').at(j).get('garrafa').value == idGarrafa) quantidadeGarrafas += linha.at(i).get('quantidadeCaixa').value * linha.at(i).get('linhaGarrafa').at(j).get('quantidadeGarrafa').value;
            }
        }
        if (garrafa.cRotulo < quantidadeGarrafas) return { 'ValidQuantidadeGarrafas': true }
        return null;
    };
}

// Validator que verifica se a caixa esta devidamente preenchida
export function ValidatorEncomendaQuantidadeGarrafasEspeciaisPreenchida(caixas: Caixa[]): ValidatorFn{
    return (control: AbstractControl): { [key: string]: boolean } | null => {        
        if (control.parent == undefined) return { 'Waiting': true }
        const idCaixa = control.parent.parent.get('caixa').value;
        const quantidade = control.get('quantidadeGarrafa').value;
        var caixa: Caixa;
        for (let i = 0; i < caixas.length; i++){
            if (idCaixa == caixas[i].id) caixa = caixas[i];
        }
        if (caixa == undefined) return { 'WaitingModeloGarrafa': true }  
        var quantidadeGarrafas: number = 0;
        const linha = control.parent.parent;
        for (let i = 0; i < linha.get('linhaGarrafa').length; i++){        
            quantidadeGarrafas += linha.get('linhaGarrafa').at(i).get('quantidadeGarrafa').value;
        }
        if (caixa.garrafas < quantidadeGarrafas) return { 'ValidQuantidadeGarrafasPreenchidas': true }
        return null;
    };
}