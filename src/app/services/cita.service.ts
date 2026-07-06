import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Cita } from '../interfaces/cita.interface';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { AutoCompleto } from '../interfaces/auto-completo.interface';
import { Cliente } from '../interfaces/usuario.interface';
import { CitaCompleta } from '../interfaces/cita-completa.interface';
import { AutoService } from './auto.service';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root',
})
export class CitaService {

  private readonly urlCitas = 'http://localhost:3000/citas';
  private readonly autoService = inject(AutoService);
  private readonly usuarioService = inject(UsuarioService);
  
  constructor(private http: HttpClient){}

  getCitas(): Observable<Cita[]>{
    return this.http.get<Cita[]>(this.urlCitas);
  }
  
  getCitasPorConcesionaria(id: string | number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.urlCitas}?idConcesionaria=${id}`);
  }

  getCitasPorCliente(id: string | number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.urlCitas}?idUsuario=${id}`);
  }

  getCitaPorId(id: string | number): Observable<Cita> {
    return this.http.get<Cita>(`${this.urlCitas}/${id}`);
  }

  //Intentamos suscribirnos al observable retornado por getCitas() y ralizar allí la lógica de generación de id nuevo,
  //pero nos arrojaba error. Encontramos que mediante un pipe y el uso de switchMap nos permite devolver un observable y que funcione
  agregarCita(citaNueva: Cita): Observable<Cita>{
    return this.getCitas().pipe(
      map(citas => {
        const nuevoId = this.obtenerNuevoId(citas);
        return {
          ...citaNueva,
          id: nuevoId
        } as Cita;
      }),
      switchMap(citaConId =>
        this.http.post<Cita>(this.urlCitas, citaConId)
      )
    );
  }

  modificarCita(citaNueva: Cita): Observable<Cita>{
      return this.http.put<Cita>(`${this.urlCitas}/${citaNueva.id}`, citaNueva);
  }

  eliminarCita(id: number): Observable<void> {
      return this.http.delete<void>(`${this.urlCitas}/${id}`);
  }

  //Generador de id autoincremental

  obtenerNuevoId(citas: Cita[]): number{
    if(citas && citas.length > 0){
      const idCitas = citas.map(c => c.id);
      return Math.max(...idCitas) + 1;
    }
    return 1;
  }

  //Mapeo a CitaCompleta

  private mapearCitaCompleta(cita: Cita, autos: AutoCompleto[], clientes: Cliente[]): CitaCompleta {
    const auto = autos.find(a => Number(a.auto.id) === Number(cita.idAuto))!;
    const cliente = clientes.find(c => Number(c.id) === Number(cita.idUsuario))!;

    return {
        cita,
        auto,
        cliente
    };
  }

  //Del mismo modo que realizamos en auto.service.ts, debimos usar forkJoin
    getCitasCompletas(): Observable<CitaCompleta[]> {
        return forkJoin({
            citas: this.getCitas(),
            autos: this.autoService.getAutosCompletos(),
            clientes: this.usuarioService.getClientes()
        }).pipe(
            map(({ citas, autos, clientes}) =>
            citas.map(cita =>
                this.mapearCitaCompleta(cita, autos, clientes)
            )
            )
        );
    }

    getCitaCompletaById(id: number): Observable<CitaCompleta> {
        return forkJoin({
            cita: this.getCitaPorId(id),
            autos: this.autoService.getAutosCompletos(),
            clientes: this.usuarioService.getClientes()
        }).pipe(
            map(({cita, autos, clientes}) =>
              this.mapearCitaCompleta(cita, autos, clientes)
            )
            )
    }

    getCitasCompletasPorCliente(idCliente: number): Observable<CitaCompleta[]> {
        return forkJoin({
            citas: this.getCitasPorCliente(idCliente),
            autos: this.autoService.getAutosCompletos(),
            clientes: this.usuarioService.getClientes()
        }).pipe(
            map(({ citas, autos, clientes}) =>
            citas.map(cita =>
                this.mapearCitaCompleta(cita, autos, clientes)
            )
            )
        );
    }

    getCitasCompletasPorConcesionaria(idConcesionaria: number): Observable<CitaCompleta[]> {
        return forkJoin({
            citas: this.getCitasPorConcesionaria(idConcesionaria),
            autos: this.autoService.getAutosCompletos(),
            clientes: this.usuarioService.getClientes()
        }).pipe(
            map(({ citas, autos, clientes}) =>
            citas.map(cita =>
                this.mapearCitaCompleta(cita, autos, clientes)
            )
            )
        );
    }

}
