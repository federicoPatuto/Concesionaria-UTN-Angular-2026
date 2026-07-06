import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAppInitializer, inject } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),

    /*Función encargada de ejecutar initUsuario() como primera responsabilidad al cargar una página,
      de manera tal que, al hacer un login exitoso, el usuario se guarde en LocalStorage y el guard redirect-if-logged-in-guard reciba ese valor.
      El inconveniente que surgió durante el desarrollo fue que el guard se cargaba antes que las señales de AuthenticationService, con lo cual
      el valor de usuarioEnLinea en el guard era null, más allá de haber una sesión iniciada. Eso imposibilitaba bloquear la navegación a /sign-up y /login
      estando logueado. La función provideAppInitializer() nos permite solucionarlo.
    */
    provideAppInitializer(() => {
      const auth = inject(AuthenticationService);
      return auth.initUsuario();
    })
  ]
};
