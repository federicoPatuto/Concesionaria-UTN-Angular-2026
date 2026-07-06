import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-log-in',
  standalone:true,
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './log-in.html',
  styleUrl: './log-in.css',
})
export class LogIn {
loginData = {
  email:'',
  password:''
}

errorMessage: string | null = null;

constructor(private auth:AuthenticationService, private router: Router){}

login(){
  this.auth.login(this.loginData.email, this.loginData.password).subscribe({
    next: (resultadoLogin) => {
      if (resultadoLogin.resultado === 'exitoso'){
        this.errorMessage = null;
        setTimeout(() => {
        this.router.navigate(['/catalogo']);
      });
      }
      else{
        switch (resultadoLogin.resultado){
          case 'mail_inexistente': 
            this.errorMessage = 'El mail ingresado no corresponde a ningún usuario';
            break;

          case 'password_incorrecta': 
            this.errorMessage = 'La contraseña ingresada es incorrecta';
            break;
        }
      }
    },
    error: (err) => console.error(err)
  })
}

}
