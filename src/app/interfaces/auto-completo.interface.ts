import { Auto } from "./auto.interface";
import { Concesionaria } from "./concesionaria.interface";
import { Marca } from "./marca.interface";
import { Modelo } from "./modelo.interface";

//Interfaz enriquecida. Se construye a partir de la combinación de las interfaces "primitivas" que mapean desde JSON, con objetivo de volver más eficiente el manejo de datos en tiempo de ejecución.
export interface AutoCompleto {
    auto: Auto;
    imagen: string & any [] | string[];
    marca: Marca;
    modelo: Modelo;
    anio: string | number;
    concesionaria: Concesionaria;
}
