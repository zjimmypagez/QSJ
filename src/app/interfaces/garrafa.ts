export interface Garrafa {
    Id: number,
    TipoDeVinho_ID: number,
    Pipa: number,
    Ano: number,
    Capacidade: number,
    CRotulo: number,
    SRotulo: number
}

// Interface garrafa para ser diretamente inserida na BD - Id, CRotulo e SRotulo automatico e responsável á BD
export interface GarrafaSIdCSRotulo {
    TipoDeVinho_ID: number,
    Pipa: number,
    Ano: number,
    Capacidade: number
}

// Interface adaptada ao JOIN entre a tabela garrafa e a tabela tipo_de_vinho
export interface GarrafaEVinho {
    Id: number,
    Marca: string,
    Tipo: string,
    Categoria: string,
    Pipa: number,
    Ano: number,
    Capacidade: number,
    CRotulo: number,
    SRotulo: number
}