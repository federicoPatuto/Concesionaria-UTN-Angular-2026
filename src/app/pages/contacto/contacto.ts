import { Component, inject } from '@angular/core';
import { AutoService } from '../../services/auto.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConcesionariaService } from '../../services/concesionaria.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css'
})
export class Contacto {

  private readonly concesionariaService = inject(ConcesionariaService);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly concesionarias = toSignal(
    this.concesionariaService.getConcesionarias(),
    { initialValue: [] }
  );

  protected obtenerMapa(direccion: string): SafeResourceUrl {
  const url = `https://www.google.com/maps?q=${encodeURIComponent(direccion)}&output=embed`;

  return this.sanitizer.bypassSecurityTrustResourceUrl(url);
}

  protected obtenerUrlMapa(direccion: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`;
}

}