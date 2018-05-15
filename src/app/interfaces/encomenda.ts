export interface Encomenda{
  id: number,
  idUser: number,
  data: Date,
  dataFinal: Date,
  nFatura: number,
  comentario: string,
  estado: boolean
}