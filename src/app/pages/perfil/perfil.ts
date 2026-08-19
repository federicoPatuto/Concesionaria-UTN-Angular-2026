import { Component, computed, effect, inject, signal } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Admin, Cliente, Usuario } from '../../interfaces/usuario.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { AVATAR_DEFAULT } from '../../shared/avatar-default';

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil {

  private readonly authService = inject(AuthenticationService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly fb = inject(FormBuilder);
  protected fotoSeleccionada: string | null = null;
  protected mostrarCambioContrasenia = signal(false);
  protected readonly avatarDefault = AVATAR_DEFAULT;

  protected readonly usuario = computed<Usuario | null>(() => {
    return this.authService.getUsuarioEnLinea();
  });

  protected formPerfil = this.fb.group({
  nombre: ['', [Validators.required]],
  telefono: ['', [Validators.required]]
  });

  protected formContrasenia = this.fb.group({
  passwordActual: ['', Validators.required],
  passwordNueva: ['', [Validators.required, Validators.minLength(8)]],
  confirmacion: ['', Validators.required]
  });

protected readonly cargarFormulario = effect(() => {

  const usuario = this.usuario();

  if (!usuario) return;

  this.formPerfil.patchValue({
    nombre: usuario.nombre,
    telefono: usuario.telefono
  });

});

guardarCambios(): void {

  if (this.formPerfil.invalid || !this.usuario()) {
    this.formPerfil.markAllAsTouched();
    return;
  }

  let usuarioActualizado: Cliente | Admin;

  if (this.usuario()!.tipo === 'admin') {
    usuarioActualizado = {
      ...this.usuario()!,
      nombre: this.formPerfil.value.nombre!,
      telefono: this.formPerfil.value.telefono!,
      foto: this.fotoSeleccionada ?? this.usuario()!.foto
    } as Admin;
  } 
  else {
    usuarioActualizado = {
      ...this.usuario()!,
      nombre: this.formPerfil.value.nombre!,
      telefono: this.formPerfil.value.telefono!,
      foto: this.fotoSeleccionada ?? this.usuario()!.foto
    } as Cliente;
  }
  this.usuarioService.actualizarUsuario(usuarioActualizado).subscribe({
    next: usuario => {
      this.authService.actualizarUsuarioEnLinea(usuario);
      this.fotoSeleccionada = null;
      alert('Perfil actualizado correctamente');
    },
    error: err => {
      alert(err.message);
    }
  });
}

onFotoSeleccionada(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) {
    return;
  }

  const archivo = input.files[0];

  if (!archivo.type.startsWith('image/')) {
    alert('El archivo seleccionado debe ser una imagen.');
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    this.fotoSeleccionada = reader.result as string;
  };

  reader.readAsDataURL(archivo);
}

formularioContraseniaVisible(): void {
  this.mostrarCambioContrasenia.update(valor => !valor);

  if (!this.mostrarCambioContrasenia()) {
    this.formContrasenia.reset();
  }
}

cambiarPassword(): void {

  const usuario = this.usuario();

  if (!usuario || this.formContrasenia.invalid) {
    this.formContrasenia.markAllAsTouched();
    return;
  }

  const contraseñaActual = this.formContrasenia.value.passwordActual!;
  const contraseñaNueva = this.formContrasenia.value.passwordNueva!;
  const confirmacion = this.formContrasenia.value.confirmacion!;

  if (contraseñaActual !== usuario.password) {
    alert('La contraseña actual es incorrecta.');
    return;
  }

  if (contraseñaNueva !== confirmacion) {
    alert('Las nuevas contraseñas no coinciden.');
    return;
  }

  if (contraseñaNueva === contraseñaActual) {
    alert('La nueva contraseña debe ser diferente de la contraseña actual.');
    return;
  }

  let usuarioActualizado: Cliente | Admin;

  if (usuario.tipo === 'admin') {
    usuarioActualizado = {
      ...usuario,
      password: contraseñaNueva
    } as Admin;
  } else {
    usuarioActualizado = {
      ...usuario,
      password: contraseñaNueva
    } as Cliente;
  }

  this.usuarioService.actualizarUsuario(usuarioActualizado).subscribe({
    next: usuarioGuardado => {

      this.authService.actualizarUsuarioEnLinea(usuarioGuardado);

      this.formContrasenia.reset();
      this.mostrarCambioContrasenia.set(false);

      alert('Contraseña actualizada correctamente.');
    },

    error: err => {
      alert(err.message);
    }
  });
}

}