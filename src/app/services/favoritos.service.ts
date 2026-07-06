import { computed, inject, Injectable, Signal } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { AutoService } from './auto.service';
import { UsuarioService } from './usuario.service';
import { BusquedaService } from './busqueda.service';
import { AutoCompleto } from '../interfaces/auto-completo.interface';
import { toSignal } from '@angular/core/rxjs-interop';
import { Admin, Cliente } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class FavoritosService {
  private readonly authService = inject(AuthenticationService);
  private readonly usuarioService = inject(UsuarioService);
  
  private readonly clienteEnLinea = computed(() => {
    const usuarioEnLinea: Cliente | Admin | null = this.authService.getUsuarioEnLinea();

    if(usuarioEnLinea?.tipo != 'cliente'){
      return null;
    }
    else{
      return usuarioEnLinea;
    }
  });

  protected readonly listaFavoritos = computed<number[]>(() => {
    if(this.clienteEnLinea()){
      return this.clienteEnLinea()!.favoritos;
    }
    else{
      return [];
    }
  });

  esFavorito = (idAuto: number | string): boolean => {
    return this.listaFavoritos().includes(Number(idAuto));
  };

  obtenerAutosFavoritos(autosCompletos: AutoCompleto[]): AutoCompleto[] {
    const ids = this.listaFavoritos();
    return autosCompletos.filter(a => ids.includes(Number(a.auto.id)));
  }

  agregarFavorito(idFavorito: number): void{
    if(this.clienteEnLinea()){
      if(!this.clienteEnLinea()!.favoritos.includes(idFavorito)){
        const nuevosFavoritos = [...this.clienteEnLinea()!.favoritos, idFavorito];
        const clienteModificado: Cliente = {
          id: this.clienteEnLinea()!.id,
          nombre: this.clienteEnLinea()!.nombre,
          email: this.clienteEnLinea()!.email,
          password: this.clienteEnLinea()!.password,
          telefono: this.clienteEnLinea()!.telefono,
          tipo: 'cliente',
          favoritos: nuevosFavoritos
        }
        this.usuarioService.actualizarUsuario(clienteModificado).subscribe({
          next: (usuarioModificado) => {
            this.authService.actualizarUsuarioEnLinea(usuarioModificado);
            alert('Se ha agregado el vehículo a sus favoritos');
          },
          error: (err) => console.log(err)
        });
      }
    }
  }

  eliminarFavorito(idFavorito: number): void{
    if(this.clienteEnLinea()){
      if(this.listaFavoritos()!.includes(idFavorito)){
        const nuevosFavoritos = this.listaFavoritos()!.filter(id => id !== idFavorito);
        this.clienteEnLinea()!.favoritos = nuevosFavoritos;
        this.usuarioService.actualizarUsuario(this.clienteEnLinea()!).subscribe({
          next: (usuarioModificado) => {
            this.authService.actualizarUsuarioEnLinea(usuarioModificado);
            alert('Se ha eliminado el vehículo de sus favoritos');
          },
          error: (err) => console.log(err)
        });
      }
    }
  }
    
  

}


  
