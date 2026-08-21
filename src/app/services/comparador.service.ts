import { Injectable, computed, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComparadorService {


  private readonly idsSeleccionados = signal<number[]>(
  (JSON.parse(localStorage.getItem('comparador') ?? '[]') as unknown[])
    .map(id => Number(id)));


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
    const id = Number(idAuto);

    if (this.idsSeleccionados().includes(id)) {
      return;
    }

    if (this.idsSeleccionados().length >= 3) {
      alert('Solo pueden compararse hasta 3 vehículos.');
      return;
    }

    this.idsSeleccionados.update(ids => [...ids, id]);
}

  quitar(idAuto: number): void {
    const id = Number(idAuto);

    this.idsSeleccionados.update(ids =>
      ids.filter(i => i !== id)
    );
}

  limpiar(): void {
    this.idsSeleccionados.set([]);
  }

  estaSeleccionado(idAuto: number): boolean {
    return this.idsSeleccionados().includes(idAuto);
  }

}