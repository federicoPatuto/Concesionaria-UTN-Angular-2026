import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { map, Observable, of, tap } from "rxjs";
import { Configuracion } from "../interfaces/configuracion.interface";

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  private readonly url = 'http://localhost:3000/configuracion';

  configuracion = signal<Configuracion | null>(null);


  constructor(private http: HttpClient) {}

  obtenerConfiguracion(): Observable<Configuracion> {

    if (this.configuracion() != null) {
        return of(this.configuracion()!);
    }

    return this.http.get<Configuracion[]>(this.url).pipe(

        map(config => config[0]),

        tap(config => this.configuracion.set(config))

    );

}

  actualizarConfiguracion(config: Configuracion){

    return this.http.put<Configuracion>(
        `${this.url}/${config.id}`,
        config
    ).pipe(

        tap(configActualizada =>
            this.configuracion.set(configActualizada)
        )

    );

}

}