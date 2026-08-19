import { Component } from '@angular/core';
import { Usuario } from '../../interfaces/usuario.interface';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AVATAR_DEFAULT } from '../../shared/avatar-default';

@Component({
  selector: 'app-sign-up',
  imports: [FormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
newUser: Usuario = {
  id: 0,
  nombre: '',
  email: '',
  password: '',
  telefono:'',
  tipo:'cliente',
  foto: ''
}

protected readonly avatarDefault = AVATAR_DEFAULT;

  constructor(private auth:AuthenticationService, private router: Router){}

  singUp(){
    this.auth.signUp(this.newUser).subscribe({
      next: (res)=>{
        if(res.resultado==='exitoso'){
          alert("Usuario registrado correctamente");
          this.router.navigate(['/catalogo']);
        }else if (res.resultado === 'mail_existente'){
          alert("El mail ingresado ya está registrado en el sistema");
        }else{
          alert("error al registrarse");
        }
      },
      error(err) {
        console.error('error en el registro: ',err);
      },

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
    this.newUser.foto = reader.result as string;
  };

  reader.readAsDataURL(archivo);
}

}
