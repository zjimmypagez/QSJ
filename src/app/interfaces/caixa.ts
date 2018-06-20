export interface Caixa {
    ID: number,
    TipoDeVinho_ID: number,
    Material: string,
    NGarrafas: number,
    Stock: number,
    CapacidadeGarrafa: number
}

// Interface caixa para ser diretamente inserida na BD - Id, e Stock automatico e responsável á BD
export interface CaixaSIdStock {
    TipoDeVinho_ID: number,
    Material: string,
    NGarrafas: number,
    CapacidadeGarrafa: number
}

// Interface adaptada ao JOIN entre a tabela caixa e a tabela tipo_de_vinho
export interface CaixaEVinho {
    ID: number,
    Marca: string,
    Tipo: string,
    Categoria: string,
    Material: string,
    NGarrafas: number,
    Stock: number,
    CapacidadeGarrafa: number
}