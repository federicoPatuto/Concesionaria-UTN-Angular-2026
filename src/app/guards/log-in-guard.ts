import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { inject } from '@angular/core';

export const logInGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if(authService.getUsuarioEnLinea()){
    return true;
  }
  router.navigate(['/login']);
  return false;
};
