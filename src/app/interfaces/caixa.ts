import { TipoGarrafaSId } from "./garrafa";

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

// Interface adaptada ao JOIN entre a tabela caixa, a tabela tipo_de_vinho, a tabela altera_stock_garrafa e a tabela utilizador
export interface CaixaVinhoRegistoEUser {
    ID: number, // ID do registo
    Marca: string,
    Tipo: string,
    Categoria: string,
    Material: string,
    NGarrafas: number,
    Stock: number,
    CapacidadeGarrafa: number,
    Comentario: string,
    Quantidade: number,
    Data: string,
    Username: string
}

// Interface auxiliar de encomenda
export interface TipoCaixaSId{
    Id_Caixa: number,
    QuantidadeCaixa: number,
    Tipo: string,
    Garrafas: TipoGarrafaSId[]
}