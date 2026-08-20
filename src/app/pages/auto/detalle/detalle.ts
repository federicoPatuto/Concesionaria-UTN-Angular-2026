import { Component, computed, effect, inject, OnInit, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoService } from '../../../services/auto.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { FavoritosService } from '../../../services/favoritos.service';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CitaService } from '../../../services/cita.service';
import { AutoFormComponent } from '../../../forms/auto-form/auto-form.component';
import { Auto } from '../../../interfaces/auto.interface';
import { AutoCompleto } from '../../../interfaces/auto-completo.interface';
import { Financiacion } from '../financiacion/financiacion';
import { RecomendacionService } from '../../../services/recomendacion.service';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-detalle',
  imports: [ReactiveFormsModule, AutoFormComponent, Financiacion, RouterLink, CurrencyPipe, JsonPipe],
  templateUrl: './detalle.html',
  styleUrl: './detalle.css'
})
export class Detalle implements OnInit{

  //Inyecciones
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly autoService = inject(AutoService);
  protected readonly authService = inject(AuthenticationService);
  protected readonly favoritosService = inject(FavoritosService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly citaService = inject(CitaService);
  private readonly recomendacionService = inject(RecomendacionService);

  //Signals
  protected auto = signal<AutoCompleto | undefined>(undefined);
  protected detalleAutoComputed = computed(() => this.auto());
  protected recomendaciones = signal<AutoCompleto[]>([]);

  protected readonly isLoading = computed(() => {
    return this.auto() === undefined;
  })

  //Manejador de arreglo de imágenes
  currentIndex = 0;

  nextSlide() {
    const total = this.auto()?.imagen?.length || 0;
    this.currentIndex = (this.currentIndex + 1) % total;
  }

  prevSlide() {
    const total = this.auto()?.imagen?.length || 0;
    this.currentIndex = (this.currentIndex - 1 + total) % total;
  }

  volver() {
    this.router.navigateByUrl('/catalogo');
  }

  //Gestión de herramienta de financiación
  mostrarFinanciacion = signal(false);
  precioSeleccionado = signal<number | null>(null);

  abrirFinanciacion(precio: number) {
    this.precioSeleccionado.set(precio);
    this.mostrarFinanciacion.set(true);
  }

  cerrarFinanciacion() {
  this.mostrarFinanciacion.set(false);
}


  //Manejador de eventos favoritos
  agregarFavorito(id: number | string): void{
    if(this.authService.getUsuarioEnLinea()){
      this.favoritosService.agregarFavorito(Number(id));
    }
    else{
      if(confirm('Esta funcionalidad está disponible para clientes registrados. Desea ingresar a su cuenta?')){
        this.router.navigate(['/login']);
      }
    }
  }

  eliminarFavorito(id: number | string): void{
    if(this.authService.getUsuarioEnLinea()){
      this.favoritosService.eliminarFavorito(Number(id));
    }
    else{
      if(confirm('Esta funcionalidad está disponible para clientes registrados. Desea ingresar a su cuenta?')){
        this.router.navigate(['/login']);
      }
    }
  }


  //Funcionalidad de eliminación de auto
  eliminarAuto(idAuto: number | string): void{
    if(confirm('Está seguro de eliminar este auto?')){
      this.autoService.eliminarAuto(Number(idAuto)).subscribe(() => {
      this.router.navigate(['/catalogo']);
      });
    }
  }

  //Funcionalidad de edición de auto
  protected modoEdicion = signal<boolean>(false);
  activarEdicion() {
    this.modoEdicion.set(true);
  }

  cancelarEdicion() {
    this.modoEdicion.set(false);
  }

  guardarCambios(autoActualizado: any){
    const autoActualizadoPrimitivo: Auto = {
      ...this.auto()!.auto,
      ...autoActualizado
    }

    const autoActualizadoCompleto: AutoCompleto = {
      ...this.auto()!,
      auto: {
        ...this.auto()!.auto,
        ...autoActualizado
      }
    }
    this.autoService.modificarAuto(autoActualizadoPrimitivo)
    .subscribe(() => {
      this.auto.set(autoActualizadoCompleto);
      this.modoEdicion.set(false);
      alert('Auto actualizado con éxito');
    });
  }


  //Formulario de solicitud de cita

  protected formularioVisible = signal<boolean>(false);
  protected formCita!: FormGroup;

  ngOnInit(): void {
    this.formCita = this.formBuilder.group({
      id: [null],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      motivo: [''],
      idUsuario: [this.authService.getUsuarioEnLinea()?.id, Validators.required],
      idAuto: [null, Validators.required],
      idConcesionaria: [null, Validators.required]
    });

    this.route.paramMap.subscribe(params => {

      const id = Number(params.get('id'));

      this.formCita.patchValue({
        idAuto: id
      });

      this.autoService.getAutoCompletoById(id).subscribe(auto => {

        this.auto.set(auto);

        this.formCita.patchValue({
          idConcesionaria: auto.concesionaria.id
        });

        this.recomendacionService
          .obtenerRecomendaciones(auto)
          .subscribe(recomendaciones => {
            this.recomendaciones.set(recomendaciones);
          });

      });

    });
  }



  mostrarForm(): void{
    if (!this.auto()?.auto.disponible) {
      alert('Este vehículo no se encuentra disponible.');
      return;
    }
    if(this.authService.getUsuarioEnLinea()){
      this.formularioVisible.set(true);
    }
    else{
      if(confirm('Esta funcionalidad está disponible para clientes registrados. Desea ingresar a su cuenta?')){
        this.router.navigate(['/login']);
      }
    }
  }

  ocultarForm(): void{
    this.formularioVisible.set(false);
  }

  onSubmit(): void{
    if(this.formCita.valid){
      this.citaService.agregarCita(this.formCita.value).subscribe({
        next: () => {
          alert('Cita agendada con éxito. Puede verla en la sección Mis Citas');
          this.ocultarForm();
        },
        error: (err) => {alert(err.message)} //Muestra al usuario el error correspondiente, arrojado en CitaService
      })
    }
  }

  

}
