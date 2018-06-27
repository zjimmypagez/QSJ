export interface User {
   Id: number,
   Email: string,
   Username: string,
   _Password: string,
   TipoUtilizador: number
}

// Interface Utilizador para ser diretamente inserida na BD - Id automatico e responsável á BD
export interface UserSId {
    Email: string,
    Username: string,
    _Password: string,
    TipoUtilizador: number
}