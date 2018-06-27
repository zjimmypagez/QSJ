export interface RegistoGarrafa {
    ID: number,
    Garrafa_ID: number,
    Utilizador_ID: number,
    Comentario: string,
    QTSRotulo: number,
    QTCRotulo: number,
    Data: string
}

// Interface RegistoGarrafa para ser diretamente inserida na BD - Id automatico e responsável á BD
export interface RegistoGarrafaSId {
    Garrafa_ID: number,
    Utilizador_ID: number,
    Comentario: string,
    QTSRotulo: number,
    QTCRotulo: number,
    Data: string 
}

// Interface RegistoGarrafa para ser modificada inserida na BD
export interface RegistoGarrafaComentario {
    ID: number,
    Utilizador_ID: number,
    Comentario: string,
    Data: string
}