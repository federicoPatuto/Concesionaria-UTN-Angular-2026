import { Component, computed, inject } from '@angular/core';
import { ComparadorService } from '../../services/comparador.service';
import { AutoService } from '../../services/auto.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comparador',
  imports: [],
  templateUrl: './comparador.html',
  styleUrl: './comparador.css'
})
export class Comparador {

  protected readonly comparadorService = inject(ComparadorService);
  private readonly autoService = inject(AutoService);
  private readonly router = inject(Router);

  protected readonly autos = toSignal(
    this.autoService.getAutosCompletos(),
    { initialValue: [] }
  );

  protected readonly autosComparados = computed(() => {

    const ids = this.comparadorService.ids();

    return this.autos().filter(auto =>
      ids.includes(Number(auto.auto.id))
    );

  });

  quitar(id: number) {
    this.comparadorService.quitar(id);
  }

  volver() {
    this.comparadorService.limpiar();
    this.router.navigate(['/catalogo']);
  }
  

}