import { Component, computed, OnInit, signal } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { CitaService } from '../../services/cita.service';
import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Admin, Usuario } from '../../interfaces/usuario.interface';
import { AutoService } from '../../services/auto.service';
import { AutoCompleto } from '../../interfaces/auto-completo.interface';
import { Cita } from '../../interfaces/cita.interface';
import { AsyncPipe } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { CitaCompleta } from '../../interfaces/cita-completa.interface';

@Component({
  selector: 'app-cita',
  imports: [],
  templateUrl: './cita.component.html',
  styleUrl: './cita.component.css',
})
export class CitaComponent implements OnInit{
  private readonly citaService = inject(CitaService);
  private readonly authService = inject(AuthenticationService);
  protected readonly autoService = inject(AutoService);
  protected readonly usuarioService = inject(UsuarioService);


  protected readonly citasCliente = signal<CitaCompleta[]>([]);
  protected readonly citasAdmin = signal<CitaCompleta[]>([]);
  

  protected readonly usuarioEnLinea = computed(() => {
    return this.authService.getUsuarioEnLinea();
    }
  );

  ngOnInit(): void {
    if(this.usuarioEnLinea()?.tipo === 'cliente'){
      this.setCitasCliente();
    }
    if(this.usuarioEnLinea()?.tipo === 'admin'){
      this.setCitasAdmin();
    }
  }
  

  setCitasCliente(){
    if(this.usuarioEnLinea()?.tipo === 'cliente'){
      this.citaService.getCitasCompletasPorCliente(this.usuarioEnLinea()!.id).subscribe(
        (citas) => this.citasCliente.set(citas)
      );
    }
  }

  setCitasAdmin(){
    const usuario = this.usuarioEnLinea();//Acá se crea una nueva variable para guardar el valor de la signal en el momento. El sistema valida que el usuario sea admin y me permite acceder al atributo idConcesionaria
    if(usuario?.tipo === 'admin'){
      this.citaService.getCitasCompletasPorConcesionaria(usuario.idConcesionaria).subscribe(
        (citas) => this.citasAdmin.set(citas)
      );
    }
  }

  eliminarCita(id: number){
    if(confirm('Está seguro de eliminar la cita')){
      this.citaService.eliminarCita(id).subscribe(() => 
      {
        this.citasCliente.update(citas => citas.filter(c => c.cita.id !== id));
        alert('Cita eliminada correctamente');
      });
    }
  }

}
