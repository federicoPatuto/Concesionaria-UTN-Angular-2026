import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from "@angular/router";
import { AuthenticationService } from '../../services/authentication.service';
import { BusquedaService } from '../../services/busqueda.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private router = inject(Router);
  constructor(
    protected auth: AuthenticationService,
    protected busquedaService: BusquedaService
    ){
      this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.rutaActual.set(event.urlAfterRedirects);
      });
    }


  rutaActual = signal<string>('');

  buscarAuto(event: Event): void{
    const input = event.target as HTMLInputElement;
    this.busquedaService.setBusqueda(input.value);
  }

  protected readonly mostrarBuscador = computed(() =>
    this.rutaActual().startsWith('/catalogo')
  );
}
