import { ValidatorFn, AbstractControl, FormArray, FormGroup } from '@angular/forms';

import { Caixa, CaixaEVinho } from '../interfaces/caixa';
import { Garrafa, GarrafaEVinho } from '../interfaces/garrafa';

// Validator que verifica se já existe o registo inserido - caixas normais
export function ValidatorEncomendaCaixasRegisto(): ValidatorFn{
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const idCaixa = control.get('caixa').value;
        const idGarrafa = control.get('garrafa').value;
        if (control.parent == undefined) return { 'Waiting': true }
        const linhaCaixas = <FormArray>control.parent;
        var existe: number = 0;
        for (let i = 0; i < linhaCaixas.length; i++){
            if (linhaCaixas.at(i).get('caixa').value == idCaixa && linhaCaixas.at(i).get('garrafa').value == idGarrafa) existe++;
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
        const linhaGarrafa = <FormArray>control.parent; 
        var existe: number = 0;
        for (let i = 0; i < linhaGarrafa.length; i++){
            if (linhaGarrafa.at(i).get('garrafa').value == idGarrafa) existe++;
        }
        if (existe > 1) return { 'ValidCaixasEspeciaisRegisto': true }
        return null;
    };
}

// Validator que verifica se existem, em stock, a quantidade de caixas propostas - caixas normais
export function ValidatorEncomendaQuantidadeCaixas(caixas: CaixaEVinho[]): ValidatorFn{
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const idCaixa = control.get('caixa').value;
        const quantidade = control.get('quantidade').value;
        var caixa: CaixaEVinho = caixas.find(x => x.ID == idCaixa);     
        if (caixa == undefined) return { 'WaitingModeloCaixa': true }
        if (control.parent == undefined) return { 'Waiting': true }
        const linhaCaixas = <FormArray>control.parent;
        const linhaModelo = <FormArray>linhaCaixas.parent.get('linhaModelo');
        var quantidadeCaixas: number = 0;
        for (let i = 0; i < linhaModelo.length; i++){
            if (linhaModelo.at(i).get('caixa').value == idCaixa) quantidadeCaixas += linhaModelo.at(i).get('quantidadeCaixa').value;
        }
        for (let i = 0; i < linhaCaixas.length; i++){
            if (linhaCaixas.at(i).get('caixa').value == idCaixa) quantidadeCaixas += linhaCaixas.at(i).get('quantidade').value;
        }
        if (caixa.Stock < quantidadeCaixas) return { 'ValidQuantidadeCaixas': true }
        return null;
    };
}

// Validator que verifica se existem, em stock, a quantidade de caixas propostas - caixas especiais
export function ValidatorEncomendaQuantidadeCaixasEspeciais(caixas: CaixaEVinho[]): ValidatorFn{
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const idCaixa = control.get('caixa').value;
        const quantidade = control.get('quantidadeCaixa').value;
        var caixa: CaixaEVinho = caixas.find(x => x.ID == idCaixa);
        if (caixa == undefined) return { 'WaitingModeloCaixa': true }
        if (control.parent == undefined) return { 'Waiting': true }
        const linhaModelo = <FormArray>control.parent;
        const linhaCaixa = <FormArray>linhaModelo.parent.get('linhaCaixas');
        var quantidadeCaixas: number = 0;
        for (let i = 0; i < linhaCaixa.length; i++){
            if (linhaCaixa.at(i).get('caixa').value == idCaixa) quantidadeCaixas += linhaCaixa.at(i).get('quantidade').value;
        }
        for (let i = 0; i < linhaModelo.length; i++){
            if (linhaModelo.at(i).get('caixa').value == idCaixa) quantidadeCaixas += linhaModelo.at(i).get('quantidadeCaixa').value;
        }
        if (caixa.Stock < quantidadeCaixas) return { 'ValidQuantidadeCaixas': true }
        return null;
    };
}

// Validator que verifica se existem, em stock, a quantidade de garrafas propostas - caixas normais
export function ValidatorEncomendaQuantidadeGarrafas(caixas: CaixaEVinho[], garrafas: GarrafaEVinho[]): ValidatorFn{
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const idCaixa = control.get('caixa').value;
        const idGarrafa = control.get('garrafa').value;
        const quantidade = control.get('quantidade').value;
        var caixa: CaixaEVinho = caixas.find(x => x.ID == idCaixa);
        if (caixa == undefined) return { 'WaitingModeloCaixa': true }
        var garrafa: GarrafaEVinho = garrafas.find(x => x.Id == idGarrafa);
        if (garrafa == undefined) return { 'WaitingModeloGarrafa': true }
        if (control.parent == undefined) return { 'Waiting': true }
        const linhaCaixa = <FormArray>control.parent;
        const linhaModelo = <FormArray>linhaCaixa.parent.get('linhaModelo');
        var quantidadeGarrafas: number = 0;
        for (let i = 0; i < linhaModelo.length; i++){
            const quantidadeCaixa = linhaModelo.at(i).get('quantidadeCaixa').value;
            const linhaAtualGarrafa = <FormArray>linhaModelo.at(i).get('linhaGarrafa');
            for (let j = 0; j < linhaAtualGarrafa.length; j++){
                if (linhaAtualGarrafa.at(j).get('garrafa').value == idGarrafa) quantidadeGarrafas += quantidadeCaixa * linhaAtualGarrafa.at(j).get('quantidadeGarrafa').value;
            }
        }
        for (let i = 0; i < linhaCaixa.length; i++){
            if (linhaCaixa.at(i).get('garrafa').value == idGarrafa) quantidadeGarrafas += caixa.NGarrafas * linhaCaixa.at(i).get('quantidade').value;
        }
        if (garrafa.CRotulo < quantidadeGarrafas) return { 'ValidQuantidadeGarrafas': true }
        return null;
    };
}

// Validator que verifica se existem, em stock, a quantidade de garrafas propostas - caixas especiais
export function ValidatorEncomendaQuantidadeGarrafasEspeciais(caixas: CaixaEVinho[], garrafas: GarrafaEVinho[]): ValidatorFn{
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const idGarrafa = control.get('garrafa').value;
        const quantidade = control.get('quantidadeGarrafa').value;
        var garrafa: GarrafaEVinho = garrafas.find(x => x.Id == idGarrafa);
        if (garrafa == undefined) return { 'WaitingModeloGarrafa': true }  
        if (control.parent == undefined) return { 'Waiting': true }
        const linhaModelo = <FormArray>control.parent.parent.parent;
        const linhaCaixa = <FormArray>linhaModelo.parent.get('linhaCaixas');
        var quantidadeGarrafas: number = 0;
        for (let i = 0; i < linhaCaixa.length; i++){
            const idCaixa = linhaCaixa.at(i).get('caixa').value;
            var caixa: CaixaEVinho = caixas.find(x => x.ID == idCaixa);
            if (caixa != undefined){
                if (linhaCaixa.at(i).get('garrafa').value == idGarrafa) quantidadeGarrafas += caixa.NGarrafas * linhaCaixa.at(i).get('quantidade').value;
            }
        }
        for (let i = 0; i < linhaModelo.length; i++){
            const linhaAtualGarrafa = <FormArray>linhaModelo.at(i).get('linhaGarrafa');            
            for (let j = 0; j < linhaAtualGarrafa.length; j++){
                if (linhaAtualGarrafa.at(j).get('garrafa').value == idGarrafa) quantidadeGarrafas += linhaModelo.at(i).get('quantidadeCaixa').value * linhaAtualGarrafa.at(j).get('quantidadeGarrafa').value;
            }
        }
        if (garrafa.CRotulo < quantidadeGarrafas) return { 'ValidQuantidadeGarrafas': true }
        return null;
    };
}

// Validator que verifica se a caixa esta devidamente preenchida
export function ValidatorEncomendaQuantidadeGarrafasEspeciaisPreenchida(caixas: CaixaEVinho[]): ValidatorFn{
    return (control: AbstractControl): { [key: string]: boolean } | null => {        
        const quantidade = control.get('quantidadeGarrafa').value;
        if (control.parent == undefined) return { 'Waiting': true }
        const linhaAtualModelo = control.parent.parent;
        const idCaixa = linhaAtualModelo.get('caixa').value;
        var caixa: CaixaEVinho = caixas.find(x => x.ID == idCaixa);
        if (caixa == undefined) return { 'WaitingModeloGarrafa': true }  
        var quantidadeGarrafas: number = 0;
        const linhaGarrafa = <FormArray>control.parent;
        for (let i = 0; i < linhaGarrafa.length; i++) quantidadeGarrafas += linhaGarrafa.at(i).get('quantidadeGarrafa').value;
        if (caixa.NGarrafas < quantidadeGarrafas) return { 'ValidQuantidadeGarrafasPreenchidas': true }
        return null;
    };
}