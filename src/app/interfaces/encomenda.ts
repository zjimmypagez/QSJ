import { TipoCaixaSId } from "./caixa";

export interface Encomenda{
  Id: number,
  Id_utilizador: number,
  Comentario: string,
  Estado: number,
  NFatura: string,
  _Data: string,
  DataEntrega: string
}

// Interface adaptada ao JOIN entre a tabela encomenda e a tabela utilizador
export interface EncomendaEUser{
  Id: number,
  Username: string,
  Comentario: string,
  Estado: number,
  NFatura: string,
  _Data: string,
  DataEntrega: string
}

// Interface auxiliar de inserção na BD sem ID
export interface EncomendaSId{
  Id_utilizador: number,
  Comentario: string,
  Estado: number,
  NFatura: string,
  _Data: string,
  DataEntrega: string,
  Caixas: TipoCaixaSId[]
}

// Interface auxiliar de visualização de uma encomenda
export interface EncomendaVer{
  Id: number,
  Comentario: string,
  Estado: number,
  NFatura: string,
  _Data_: string,
  DataEntrega: string,
  Marca: string,
  Tipo: string,
  Categoria: string,
  Material: string,
  NGarrafas: number,
  CapacidadeGarrafa: number,
  Ano: number,
  Pipa: number,
  Quantidade: number,
  QuantidadeCaixa: number,
  TipoCaixa: string
}

// Interface para inserir na BD
export interface EncomendaAlterar{
  Id: number,
  Estado: number,
  NFatura: string,
  DataEntrega: string
}