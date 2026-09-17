export type BookModel = {
  id: number;
  uuid: string;
  numero_tarjeta: number
  signatura_topografica: string;
  categoria_dewey: number;
  ejemplares: number;
  volumen: number;
  titulo: string;
  titulo_normalizado: string;
  observaciones: string;
  fecha_registro: string;
}
