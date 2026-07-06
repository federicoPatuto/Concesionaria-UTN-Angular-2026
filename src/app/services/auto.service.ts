import { Injectable } from "@angular/core";
import { Auto } from "../interfaces/auto.interface";
import { HttpClient } from "@angular/common/http";
import { forkJoin, map, Observable, switchMap } from "rxjs";
import { AutoCompleto } from "../interfaces/auto-completo.interface";
import { Marca } from "../interfaces/marca.interface";
import { Modelo } from "../interfaces/modelo.interface";
import { Concesionaria } from "../interfaces/concesionaria.interface";


@Injectable({
    providedIn: 'root'
})

export class AutoService{
    
    private urlAutos = 'http://localhost:3000/autos';
    private urlMarcas = 'http://localhost:3000/marcas';
    private urlModelos = 'http://localhost:3000/modelos';
    private urlConcesionarias = 'http://localhost:3000/concesionarias';


    constructor(private http: HttpClient){}

    //CRUD Autos

    getAutos(): Observable<Auto[]>{
        return this.http.get<Auto[]>(this.urlAutos);
    }

    getAutoById(id: string | number): Observable<Auto> {
        return this.http.get<Auto>(`${this.urlAutos}/${id}`);
    }

    agregarAuto(autoNuevo: Auto): Observable<Auto>{
        return this.getAutos().pipe(
          map(autos => {
            const nuevoId = this.obtenerNuevoIdAutos(autos);
            return {
              ...autoNuevo,
              id: nuevoId
            } as Auto;
          }),
          switchMap(autoConId =>
            this.http.post<Auto>(this.urlAutos, autoConId)
          )
        );
    }

    modificarAuto(autoNuevo: Auto): Observable<Auto>{
        return this.http.put<Auto>(`${this.urlAutos}/${autoNuevo.id}`, autoNuevo);
    }

    eliminarAuto(id: number): Observable<void> {
        return this.http.delete<void>(`${this.urlAutos}/${id}`);
    }


    //CRU Marcas (Sin delete)

    getMarcas(): Observable<Marca[]>{
        return this.http.get<Marca[]>(this.urlMarcas);
    }

    getMarcaById(idMarca: string | number): Observable<Marca> {
        return this.http.get<Marca>(`${this.urlMarcas}/${idMarca}`);
    }

    agregarMarca(marcaNueva: string): Observable<Marca>{
        return this.getMarcas().pipe(
          map(marcas => {
            const nuevoId = this.obtenerNuevoIdMarcas(marcas);
            return {
              nombre: marcaNueva,
              id: nuevoId
            } as Marca;
          }),
          switchMap(marcaConId =>
            this.http.post<Marca>(this.urlMarcas, marcaConId)
          )
        );
    }

    modificarMarca(marcaNueva: Marca): Observable<Marca>{
        return this.http.put<Marca>(`${this.urlMarcas}/${marcaNueva.id}`, marcaNueva);
    }


    //CRU Modelos (Sin delete)

    getModelos(): Observable<Modelo[]>{
        return this.http.get<Modelo[]>(this.urlModelos);
    }

    getModeloById(idModelo: string | number): Observable<Modelo> {
        return this.http.get<Modelo>(`${this.urlModelos}/${idModelo}`);
    }

    agregarModelo(modeloNuevo: Modelo): Observable<Modelo>{
        return this.getModelos().pipe(
          map(modelos => {
            const nuevoId = this.obtenerNuevoIdModelos(modelos);
            return {
              ...modeloNuevo,
              id: nuevoId
            } as Modelo;
          }),
          switchMap(modeloConId =>
            this.http.post<Modelo>(this.urlModelos, modeloConId)
          )
        );
    }

    modificarModelo(modeloNuevo: Modelo): Observable<Modelo>{
        return this.http.put<Modelo>(`${this.urlModelos}/${modeloNuevo.id}`, modeloNuevo);
    }


    //CRU Concesionarias (Sin delete)

    getConcesionarias(): Observable<Concesionaria[]>{
        return this.http.get<Concesionaria[]>(this.urlConcesionarias);
    }

    getConcesionariaById(idConcesionaria: string | number): Observable<Concesionaria> {
        return this.http.get<Concesionaria>(`${this.urlConcesionarias}/${idConcesionaria}`);
    }

    agregarConcesionaria(concesionariaNueva: Concesionaria): Observable<Concesionaria>{
        return this.http.post<Concesionaria>(this.urlConcesionarias, concesionariaNueva);
    }

    modificarConcesionaria(concesionariaNueva: Concesionaria): Observable<Concesionaria>{
        return this.http.put<Concesionaria>(`${this.urlConcesionarias}/${concesionariaNueva.id}`, concesionariaNueva);
    }


    //Mapeo a AutoCompleto

    private mapearAutoCompleto(auto: Auto, modelos: Modelo[], marcas: Marca[], concesionarias: Concesionaria[]): AutoCompleto {
        const modelo = modelos.find(m => Number(m.id) === Number(auto.idModelo))!;
        const marca = marcas.find(mar => Number(mar.id) === Number(modelo.idMarca))!;
        
        const concesionaria = concesionarias.find(c => Number(c.id) === Number(auto.idConcesionaria))!;

        const imagenes = Array.isArray(auto.imagen) ? auto.imagen : [auto.imagen];

        return {
            auto,
            imagen: imagenes,
            marca: marca,
            modelo: modelo,
            anio: modelo?.anio ?? 'N/D',
            concesionaria: concesionaria
        };
    }


    //Funciones getters de AutoCompleto. Estas funciones realizan un mapeo sobre los retornos
    //  de los getters de Auto, Marca, Modelo y Concesionaria, para obtener como retorno
    // un Observable<AutoCompleto> que nos permite utilizarlo en el componente Catalogo
    // y Favoritos


    //Investigamos y resolvimos utilizar forkJoin, que espera a que las 4 peticiones HTTP
    // estén completadas para ejecutar el mapeo. Si lo hiciéramos sin forkJoin, 
    // tendríamos el problema de la asincronía de las peticiones
    getAutosCompletos(): Observable<AutoCompleto[]> {
        return forkJoin({
            autos: this.getAutos(),
            modelos: this.getModelos(),
            marcas: this.getMarcas(),
            concesionarias: this.getConcesionarias()
        }).pipe(
            map(({ autos, modelos, marcas, concesionarias }) =>
            autos.map(auto =>
                this.mapearAutoCompleto(auto, modelos, marcas, concesionarias)
            )
            )
        );
    }

    getAutoCompletoById(id: number): Observable<AutoCompleto> {
        return forkJoin({
            auto: this.getAutoById(id!),
            modelos: this.getModelos(),
            marcas: this.getMarcas(),
            concesionarias: this.getConcesionarias()
        }).pipe(
            map(({ auto, modelos, marcas, concesionarias }) =>
            this.mapearAutoCompleto(auto, modelos, marcas, concesionarias)
            )
        );
    }

    //Generador de id autoincremental autos
    
      obtenerNuevoIdAutos(autos: Auto[]): number{
        if(autos && autos.length > 0){
          const idAutos = autos.map(a => Number(a.id));
          return Math.max(...idAutos) + 1;
        }
        return 1;
      }

    //Generador de id autoincremental marcas
    
      obtenerNuevoIdMarcas(marcas: Marca[]): number{
        if(marcas && marcas.length > 0){
          const idMarcas = marcas.map(m => Number(m.id));
          return Math.max(...idMarcas) + 1;
        }
        return 1;
      }

    //Generador de id autoincremental modelos
    
      obtenerNuevoIdModelos(modelos: Modelo[]): number{
        if(modelos && modelos.length > 0){
          const idModelos = modelos.map(m => Number(m.id));
          return Math.max(...idModelos) + 1;
        }
        return 1;
      }

}