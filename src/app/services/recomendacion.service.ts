import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AutoCompleto } from '../interfaces/auto-completo.interface';
import { AutoService } from './auto.service';
import { AuthenticationService } from './authentication.service';
import { Cliente } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class RecomendacionService {

  private readonly autoService = inject(AutoService);
  private readonly authService = inject(AuthenticationService);

  obtenerRecomendaciones(autoActual: AutoCompleto): Observable<AutoCompleto[]> {

    return this.autoService.getAutosCompletos().pipe(

      map(autos => {

        const usuario = this.authService.getUsuarioEnLinea() as Cliente | null;

        let recomendaciones = this.recomendarPorMarca(autoActual, autos, usuario);

        if(recomendaciones.length < 3){

          const similaresPrecio = this.recomendarPorPrecio(autoActual, autos, recomendaciones);

          recomendaciones = [
            ...recomendaciones,
            ...similaresPrecio
          ];
        }

        return recomendaciones.slice(0,3);

      })

    );

  }

  private recomendarPorMarca(autoActual: AutoCompleto, autos: AutoCompleto[],
    usuario: Cliente | null
  ): AutoCompleto[]{

    let marcaBuscada = autoActual.marca.id;

    if(usuario && usuario.favoritos.length){

      const favoritos = autos.filter(a =>
        usuario.favoritos.includes(Number(a.auto.id))
      );

      if(favoritos.length){

        const contador = new Map<number,number>();

        favoritos.forEach(f => {

          contador.set(
            Number(f.marca.id),
            (contador.get(Number(f.marca.id)) ?? 0) + 1
          );

        });

        marcaBuscada = [...contador.entries()]
          .sort((a,b)=>b[1]-a[1])[0][0];

      }

    }

    return autos.filter(a =>

      Number(a.auto.id) !== Number(autoActual.auto.id) && Number(a.marca.id) === Number(marcaBuscada)

    );

  }

  private recomendarPorPrecio(
    autoActual: AutoCompleto,
    autos: AutoCompleto[],
    existentes: AutoCompleto[]
  ){

    const minimo = autoActual.auto.precio * 0.8;
    const maximo = autoActual.auto.precio * 1.2;

    return autos.filter(a =>

      Number(a.auto.id) !== Number(autoActual.auto.id)

      &&

      !existentes.some(e => e.auto.id === a.auto.id)

      &&

      a.auto.precio >= minimo

      &&

      a.auto.precio <= maximo

    );

  }

}