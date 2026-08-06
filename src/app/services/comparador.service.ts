import { Injectable, computed, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComparadorService {


  private readonly idsSeleccionados = signal<number[]>(
    JSON.parse(localStorage.getItem('comparador') ?? '[]'));


  readonly ids = this.idsSeleccionados.asReadonly();


  readonly cantidad = computed(() => this.idsSeleccionados().length);


  readonly puedeComparar = computed(() => this.cantidad() >= 2);

  private readonly persistencia = effect(() => {
  localStorage.setItem(
    'comparador',
    JSON.stringify(this.idsSeleccionados())
  );
});

  agregar(idAuto: number): void {

    if (this.idsSeleccionados().includes(idAuto)) {
      return;
    }

    if (this.idsSeleccionados().length >= 3) {
      alert('Solo pueden compararse hasta 3 vehículos.');
      return;
    }

    this.idsSeleccionados.update(ids => [...ids, idAuto]);
  }

  quitar(idAuto: number): void {
    this.idsSeleccionados.update(ids =>
      ids.filter(id => id !== idAuto)
    );
  }

  limpiar(): void {
    this.idsSeleccionados.set([]);
  }

  estaSeleccionado(idAuto: number): boolean {
    return this.idsSeleccionados().includes(idAuto);
  }

}