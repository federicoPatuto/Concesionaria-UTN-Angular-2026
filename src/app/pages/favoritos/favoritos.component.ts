import { Component, computed, inject } from '@angular/core';
import { AutoCompleto } from '../../interfaces/auto-completo.interface';
import { Admin, Cliente, Usuario } from '../../interfaces/usuario.interface';
import { AuthenticationService } from '../../services/authentication.service';
import { AutoService } from '../../services/auto.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Signal } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { BusquedaService } from '../../services/busqueda.service';
import { RouterLink } from '@angular/router';
import { FavoritosService } from '../../services/favoritos.service';

@Component({
  selector: 'app-favoritos',
  imports: [RouterLink],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.css',
})
export class FavoritosComponent {

  private readonly autoService = inject(AutoService);
  protected readonly busquedaService = inject(BusquedaService);
  private readonly favoritosService = inject(FavoritosService);
  private readonly autosCompletos: Signal<AutoCompleto[]> = toSignal(this.autoService.getAutosCompletos(), {initialValue: []});


  protected readonly autosFavoritos = computed<AutoCompleto[]>(() => {
    return this.favoritosService.obtenerAutosFavoritos(this.autosCompletos());
  });

  protected readonly autosFavoritosFiltrados = computed<AutoCompleto[]>(() => {
    return this.busquedaService.filtrarYOrdenarAutos(this.autosFavoritos());
  });
}
