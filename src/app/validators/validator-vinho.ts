import { ValidatorFn, AbstractControl } from '@angular/forms';

import { TipoVinho } from '../interfaces/tipoVinho';

// Validator que verifica se o vinho inserido existe
export function ValidatorVinho(vinhos: TipoVinho[]): ValidatorFn{
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const marca = control.get('marca').value;
        const tipo = control.get('tipo').value;
        const categoria = control.get('categoria').value;
        var existe: boolean = false;
        for (let i = 0; i < vinhos.length; i++){
            if (vinhos[i].Marca.toUpperCase() == marca.toUpperCase() && vinhos[i].Tipo == tipo && vinhos[i].Categoria.toUpperCase() == categoria.toUpperCase()) existe = true;  
        }
        if (existe) return { 'ValidatorExisteVinho': true };        
        return null;
    };
}