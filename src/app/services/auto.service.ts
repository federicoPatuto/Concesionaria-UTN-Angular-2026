import { Injectable, model } from "@angular/core";
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

    getAutoById(id: number): Observable<Auto> {
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

            if(this.validarMarcaExistente(marcaNueva, marcas) == true){
              throw new Error("La marca ingresada ya existe");
            }

            const nuevoId = this.obtenerNuevoIdMarcas(marcas);
            return {
              nombre: this.normalizarTexto(marcaNueva),
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

            if(this.validarModeloExistente(modeloNuevo, modelos) == true){
              throw new Error("El modelo ingresado ya existe");
            }

            if(this.validarHp(modeloNuevo) == false){
              throw new Error("Ingrese un valor de HP entre 0 y 3000");
            }

            //Esta función, a diferencia de las otras, no devuelve valor boolean sino que arroja error en caso de valor inválido, ya que hay más de una posibilidad de valor inválido (a diferencia del resto de validadores).
            this.validarAnio(modeloNuevo);

            const nuevoId = this.obtenerNuevoIdModelos(modelos);

            modeloNuevo.nombre = this.normalizarTexto(modeloNuevo.nombre);
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

      private validarMarcaExistente(nombre: string, marcas: Marca[]): boolean {
        return marcas.some(m =>
            m.nombre.trim().toLowerCase() ===
            nombre.trim().toLowerCase()
        );
      }

      private normalizarTexto(nombre: string): string {
        nombre = nombre.trim().toLowerCase();
        return nombre.charAt(0).toUpperCase() + nombre.slice(1);
      }

      private validarModeloExistente(modelo: Modelo, modelos: Modelo[]): boolean {
        return modelos.some(m =>
            m.idMarca === modelo.idMarca &&
            m.nombre.trim().toLowerCase() ===
            modelo.nombre.trim().toLowerCase() &&
            m.anio === modelo.anio
        );
      }

      private validarHp(modelo: Modelo): boolean {
        if (modelo.hp <= 0 || modelo.hp >= 3000) {
            return false;
        }
        else{
          return true;
        }
      }

      private validarAnio(modelo: Modelo): void {
        const anio = Number(modelo.anio);
        const anioActual = new Date().getFullYear();

        if (isNaN(anio)) {
            throw new Error("El año ingresado no es válido.");
        }

        if (anio < 1950 || anio > anioActual + 1) {
            throw new Error(
                `El año debe estar entre 1950 y ${anioActual + 1}.`
            );
        }
      }

}