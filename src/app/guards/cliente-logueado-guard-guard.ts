import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { inject } from '@angular/core';

export const clienteLogueadoGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if(authService.getUsuarioEnLinea()?.tipo === 'cliente'){
    return true;
  }
  router.navigate(['/login']);
  return false;
};
