export interface TipoVinho {
   ID: number,
   Marca: string,
   Tipo: string,
   Categoria: string
}

// Interface TipoVinho para ser diretamente inserida na BD - Id automatico e responsável á BD
export interface TipoVinhoSId {
   Marca: string,
   Tipo: string,
   Categoria: string
}