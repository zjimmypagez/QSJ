export interface RegistoCaixa {
    ID: number,
    Utilizador_ID: number,
    Caixa_ID: number,
    Comentario: string,
    Quantidade: number
    Data: string
}

// Interface RegistoCaixa para ser diretamente inserida na BD - Id automatico e responsável á BD
export interface RegistoCaixaSId {
    Utilizador_ID: number,
    Caixa_ID: number,
    Comentario: string,
    Quantidade: number
    Data: string
}

// Interface RegistoCaixa para ser modificada inserida na BD
export interface RegistoCaixaComentario {
    ID: number,
    Utilizador_ID: number,
    Comentario: string,
    Data: string
}