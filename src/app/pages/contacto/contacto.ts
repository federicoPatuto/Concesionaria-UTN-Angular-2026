import { Component, inject } from '@angular/core';
import { AutoService } from '../../services/auto.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConcesionariaService } from '../../services/concesionaria.service';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css'
})
export class Contacto {

  private readonly concesionariaService = inject(ConcesionariaService);

  protected readonly concesionarias = toSignal(
    this.concesionariaService.getConcesionarias(),
    { initialValue: [] }
  );

  protected obtenerUrlMapa(direccion: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`;
}

}