import { computed, Injectable, Signal, signal} from '@angular/core';
import { FiltrosCatalogo } from '../interfaces/filtros-catalogo.interface';
import { AutoCompleto } from '../interfaces/auto-completo.interface';
import { Concesionaria } from '../interfaces/concesionaria.interface';

@Injectable({
  providedIn: 'root',
})

export class BusquedaService {
  readonly busqueda = signal<string>('');
  readonly opcionesOrdenamiento = signal<'precioAsc' | 'precioDesc' | 'kmAsc' | 'kmDesc' | 'anioAsc' | 'anioDesc' | 'A - Z' | 'Z - A'>('A - Z');

  filtros = signal<FiltrosCatalogo>({
    marca: null,
    modelo: null,
    precioMax: null,
    kmMax: null,
    anioMin: null,
    anioMax: null,
    concesionaria: null
  });

  setBusqueda(busqueda: string): void{
    this.busqueda.set(busqueda);
  }

  //Incorporamos Partial, que nos permitió actualizar solo los campos deseados dentro de FiltrosCatalogo
  actualizarFiltros(parcial: Partial<FiltrosCatalogo>){
    this.filtros.update(valoresActuales => ({...valoresActuales, ...parcial}));
  }

  filtrarAutos(autos: AutoCompleto[]) {
    const terminoBuscado = this.busqueda().trim().toLowerCase();
    const filtros = this.filtros();

    return autos!.filter(auto => {
      const concatMarcaModelo = `${auto.marca!.nombre} ${auto.modelo!.nombre}`.toLowerCase();

      const busquedaValida = concatMarcaModelo.includes(terminoBuscado);

      const filtroMarcaValido =
        !filtros.marca || auto.marca?.nombre.toLowerCase() === filtros.marca.toLowerCase();

      const filtroModeloValido =
        !filtros.modelo || auto.modelo?.nombre.toLowerCase() === filtros.modelo.toLowerCase();

      const filtroPrecioMax =
        !filtros.precioMax || auto.auto.precio <= filtros.precioMax;

      const filtroKmMax =
        !filtros.kmMax || auto.auto.kilometros <= filtros.kmMax;

      const filtroAnioMin =
        !filtros.anioMin || auto.anio >= filtros.anioMin;

      const filtroAnioMax =
        !filtros.anioMax || auto.anio <= filtros.anioMax;

      const filtroConcesionaria = 
        !filtros.concesionaria || auto.concesionaria.id == Number(filtros.concesionaria);

      return (
        busquedaValida &&
        filtroMarcaValido &&
        filtroModeloValido &&
        filtroPrecioMax &&
        filtroKmMax &&
        filtroAnioMin &&
        filtroAnioMax &&
        filtroConcesionaria
      );
    });
  }

  ordenarAutos(autos: AutoCompleto[]) {
    return autos.slice().sort((a, b) => {
      switch (this.opcionesOrdenamiento()) {
        case 'precioAsc':
          return a.auto.precio - b.auto.precio;

        case 'precioDesc':
          return b.auto.precio - a.auto.precio;

        case 'kmAsc':
          return a.auto.kilometros - b.auto.kilometros;

        case 'kmDesc':
          return b.auto.kilometros - a.auto.kilometros;

        case 'anioAsc':
          return Number(a.anio) - Number(b.anio);

        case 'anioDesc':
          return Number(b.anio) - Number(a.anio);

        case 'A - Z':
          return `${a.marca?.nombre} ${a.modelo?.nombre}`
            .localeCompare(`${b.marca?.nombre} ${b.modelo?.nombre}`);

        case 'Z - A':
          return `${b.marca?.nombre} ${b.modelo?.nombre}`
            .localeCompare(`${a.marca?.nombre} ${a.modelo?.nombre}`);
      }

      return 0;
    });
  }

  filtrarYOrdenarAutos(autos: AutoCompleto[]) {
    const filtrados = this.filtrarAutos(autos);
    return this.ordenarAutos(filtrados);
  }

  obtenerMarcasDisponibles(listaAutos: AutoCompleto[]) {
    const autos = listaAutos;
    const arregloMarcas: string[] = [];
    if(listaAutos){
      autos!.forEach(auto => {
        if (!arregloMarcas.includes(auto.marca.nombre)) {
          arregloMarcas.push(auto.marca.nombre);
        }
      });
    }

    return arregloMarcas;
  }

  obtenerConcesionariasDisponibles(listaAutos: AutoCompleto[]) {
    const autos = listaAutos;
    const arregloConcesionarias: Concesionaria[] = [];
    if(listaAutos){
      autos!.forEach(auto => {
        if (!arregloConcesionarias.includes(auto.concesionaria)) {
          arregloConcesionarias.push(auto.concesionaria);
        }
      });
    }
    return arregloConcesionarias;
  }
}
