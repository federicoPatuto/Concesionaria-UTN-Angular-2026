import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AutoService } from '../../../services/auto.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auto } from '../../../interfaces/auto.interface';
import { BusquedaService } from '../../../services/busqueda.service';
import { concat } from 'rxjs';
import { AutoCompleto } from '../../../interfaces/auto-completo.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication.service';
import { Admin, Cliente } from '../../../interfaces/usuario.interface';


@Component({
  selector: 'app-catalogo',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class Catalogo{

   private readonly autoService = inject(AutoService);
  private readonly router = inject(Router);
  protected readonly busquedaService = inject(BusquedaService);
  private readonly authService = inject(AuthenticationService);

  protected readonly usuarioEnLinea = computed(() => {
      const usuarioEnLinea: Cliente | Admin | null = this.authService.getUsuarioEnLinea();
  
      if(usuarioEnLinea?.tipo != 'admin'){
        return null;
      }
      else{
        return usuarioEnLinea as Admin;
      }
  });

  protected readonly filtroConcesionariaAdmin = computed(() => {
    return this.usuarioEnLinea()?.idConcesionaria;
  })
  

  protected readonly isLoading = computed(
    () =>
      this.autosConNombres() === undefined ||
      this.autosFiltrados() === undefined
  );

  protected readonly autosConNombres = toSignal(this.autoService.getAutosCompletos(), {initialValue: []});

  protected readonly autosFiltrados = computed<AutoCompleto[]>(() => {
      let resultadosFiltrados = this.busquedaService.filtrarYOrdenarAutos(this.autosConNombres()!);
      if(this.filtroConcesionariaAdmin()){
        resultadosFiltrados = resultadosFiltrados.filter(resultado => Number(resultado.concesionaria.id) === Number(this.filtroConcesionariaAdmin()));
      }
      return resultadosFiltrados;
  }); 

}


