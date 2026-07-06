import { Component } from '@angular/core';
import { Usuario } from '../../interfaces/usuario.interface';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  imports: [FormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
newUser: Usuario = {
  id: 0, //MODIFICAR, ES UN PLACEHOLDER
  nombre: '',
  email: '',
  password: '',
  telefono:'',
  tipo:'cliente'
}

  constructor(private auth:AuthenticationService, private router: Router){}

  singUp(){
    //Crear en C:\Users\Usuario\Desktop\Concesionaria-UTN-desarrollo\src\app\services\authentication.service.ts el servicio de registro
    this.auth.signUp(this.newUser).subscribe({
      next: (res)=>{
        if(res.resultado==='exitoso'){
          alert("Usuario registrado correctamente");
          this.router.navigate(['/catalogo']);
        }else if (res.resultado === 'mail_existente'){
          alert("mail ya registrado");
        }else{
          alert("error al registrarse");
        }
      },
      error(err) {
        console.error('error en el registro: ',err);
      },

    });
  }

}
