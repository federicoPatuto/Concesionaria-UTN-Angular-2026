import { Component, computed, inject, input, signal, output } from '@angular/core';
import { Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-financiacion',
  imports: [ReactiveFormsModule],
  templateUrl: './financiacion.html',
  styleUrl: './financiacion.css',
})
export class Financiacion {

  precio = input<number>(0);
  cerrarFinanciacion = output<void>();

  fb = inject(FormBuilder);

  tasas = [
    { cuotas: 12, tna: 0.45 },
    { cuotas: 24, tna: 0.55 },
    { cuotas: 36, tna: 0.65 }
  ];

  form = this.fb.group({
    cuotas: ['', Validators.required]
  });

  cuotasSeleccionadas = signal<number | null>(null);

  cuotaMensual = signal<number>(0);
  totalIntereses = signal<number>(0);
  totalPagado = signal<number>(0);
  detalle = signal<any[]>([]);


  // 🔥 Ejecutar cuando se abre el componente (bloquea scroll)
  constructor() {
    document.body.style.overflow = 'hidden';
  }


  calcular() {
    if (this.form.invalid) return;

    const cuotas = Number(this.form.value.cuotas);
    this.cuotasSeleccionadas.set(cuotas);

    const precio = this.precio();
    const plan = this.tasas.find(t => t.cuotas === cuotas)!;

    const tem = plan.tna / 12;
    const cuota = precio * (tem * Math.pow(1 + tem, cuotas)) / (Math.pow(1 + tem, cuotas) - 1);

    this.cuotaMensual.set(Number(cuota.toFixed(2)));

    let saldo = precio;
    const tabla: any[] = [];
    let interesesTotales = 0;

    for (let i = 1; i <= cuotas; i++) {
      const interes = saldo * tem;
      const amort = cuota - interes;
      saldo -= amort;

      interesesTotales += interes;

      tabla.push({
        numero: i,
        interes: Number(interes.toFixed(2)),
        amortizacion: Number(amort.toFixed(2)),
        saldoRestante: Number(Math.max(saldo, 0).toFixed(2))
      });
    }

    this.detalle.set(tabla);
    this.totalIntereses.set(Number(interesesTotales.toFixed(2)));
    this.totalPagado.set(Number((precio + interesesTotales).toFixed(2)));
  }


  cerrarModal() {
    // 🔥 Restablecer scroll cuando se cierra el modal
    document.body.style.overflow = 'auto';

    this.cerrarFinanciacion.emit();
  }
}
