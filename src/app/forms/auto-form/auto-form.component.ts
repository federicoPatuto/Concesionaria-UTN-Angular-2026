import { Component, computed, effect, EventEmitter, inject, Input, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutoService } from '../../services/auto.service';
import { AuthenticationService } from '../../services/authentication.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Admin, Cliente } from '../../interfaces/usuario.interface';
import { Marca } from '../../interfaces/marca.interface';
import { Modelo } from '../../interfaces/modelo.interface';
import { CommonModule } from '@angular/common';
import { AutoCompleto } from '../../interfaces/auto-completo.interface';

@Component({
  selector: 'app-auto-form',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './auto-form.component.html',
  styleUrl: './auto-form.component.css',
})
export class AutoFormComponent implements OnInit{

  @Input() auto!: AutoCompleto;
  @Input() modoEdicion = false;
  @Output() guardar = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<void>();

  formAuto!: FormGroup;

  private readonly formBuilder = inject(FormBuilder);
  private readonly autoService = inject(AutoService);
  private readonly authService = inject(AuthenticationService);

  marcas = signal<Marca[]>([]);
  modelos = signal<Modelo[]>([]);
  modelosFiltrados = signal<Modelo[]>([]);

  private readonly adminEnLinea = computed(() => {
    const usuarioEnLinea: Cliente | Admin | null = this.authService.getUsuarioEnLinea();

    if(usuarioEnLinea?.tipo != 'admin'){
      return null;
    }
    else{
      return usuarioEnLinea;
    }
  });


  ngOnInit(): void {
    this.formAuto = this.formBuilder.group({
    id: [null], //El id se setea como null, ya que la función agregarAuto() (presente en AutoService) se encarga de generar un id autoincremental al momento del guardado en JSON.
    precio: ['', [Validators.required, Validators.min(1)]],
    color: ['', Validators.required],
    kilometros: [0, [Validators.required, Validators.min(0)]],
    disponible: [true],
    imagen: [''], 
    idMarca: ['', Validators.required], //Utilización temporal de este campo para acceder a las marcas disponibles. Se elimina antes de realizar el submit ya que no pertenece a la estructura Auto
    idModelo: ['', Validators.required],
    idConcesionaria: [null, Validators.required]
  });

    if (this.modoEdicion) {
    //Por lógica de negocio, buscamos que solo puedan editarse el precio y la disponibilidad del auto.
    Object.keys(this.formAuto.controls).forEach(campo => {
      if (!['precio', 'disponible'].includes(campo)) {
        this.formAuto.get(campo)?.disable();
      }
    });
    }

    this.cargarMarcas();
    this.cargarModelos();
  }


  cargarMarcas() {
    this.autoService.getMarcas().subscribe(m => this.marcas.set(m));
  }

  cargarModelos() {
    this.autoService.getModelos().subscribe(m => this.modelos.set(m));
  }


  filtrarModelosPorMarca() {
    const idMarca = Number(this.formAuto.get('idMarca')?.value);
    const modelosFiltrados = this.modelos().filter(m => m.idMarca === idMarca);
    this.modelosFiltrados.set(modelosFiltrados);
    this.formAuto.patchValue({ idModelo: '' });
  }


  //Gestión de agregado de marca nueva
  protected mostrarModalMarca = false;
  abrirModalMarca() { this.mostrarModalMarca = true; }
  cerrarModalMarca() { this.mostrarModalMarca = false; }

  protected nombreMarcaNueva = '';
  crearMarca() {
    const nuevaMarca = this.nombreMarcaNueva;
    this.autoService.agregarMarca(nuevaMarca).subscribe(marcaNueva => {
      this.marcas.update(list => [...list, marcaNueva]);
      this.formAuto.patchValue({ idMarca: marcaNueva.id });
      this.cerrarModalMarca();
    });
  }

  //Gestión de agregado de modelo nuevo
  protected mostrarModalModelo = false;
  abrirModalModelo() { this.mostrarModalModelo = true; }
  cerrarModalModelo() { this.mostrarModalModelo = false; }

  protected nuevoModeloNombre = '';
  protected nuevoModeloAnio: number | string = '';
  protected nuevoModeloHp = 0;
  protected nuevoModeloTransmision = '';
  protected nuevoModeloCombustible = '';

  crearModelo() {
    const modelo = {
      nombre: this.nuevoModeloNombre,
      anio: this.nuevoModeloAnio,
      hp: this.nuevoModeloHp,
      transmision: this.nuevoModeloTransmision,
      combustible: this.nuevoModeloCombustible,
      idMarca: Number(this.formAuto.get('idMarca')?.value),
    };

    this.autoService.agregarModelo({...modelo, id: 0}).subscribe(modeloCreado => {
      this.modelos.update(list => [...list, modeloCreado]);
      this.filtrarModelosPorMarca();
      this.formAuto.patchValue({ idModelo: modeloCreado.id });
      this.cerrarModalModelo();
    });
  }

  
  onSubmit(): void{
    if(this.formAuto.valid){
      //Elimino el campo idMarca
      const { idMarca, ...autoSinMarca } = this.formAuto.value;
      if(this.modoEdicion){
        const autoEditado = {
          precio: this.formAuto.get('precio')?.value,
          disponible: this.formAuto.get('disponible')?.value
        }
        this.guardar.emit(autoSinMarca);//Para la reutilización del formulario en otro componente, emitimos la orden de ejecutar la función asignada a guardar en detalle.html
      }
      else{
        this.autoService.agregarAuto(autoSinMarca).subscribe(() => {
          alert('Auto agregado con éxito');
        })
      }
    }
  }

  cancelarEdicion() {
    this.cancelar.emit();
  }

}
