import { AutoCompleto } from "./auto-completo.interface";
import { Cita } from "./cita.interface";
import { Concesionaria } from "./concesionaria.interface";
import { Cliente } from "./usuario.interface";

//Del mismo modo que AutoCompleto, es una interfaz enriquecida. Se construye a partir de la combinación de las interfaces "primitivas" que mapean desde JSON, con objetivo de volver más eficiente el manejo de datos en tiempo de ejecución.
export interface CitaCompleta {
    cita: Cita,
    auto: AutoCompleto,
    cliente: Cliente
}
