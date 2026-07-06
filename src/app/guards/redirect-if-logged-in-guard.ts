import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { inject } from '@angular/core';
import { map, take } from 'rxjs';

export const redirectIfLoggedInGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthenticationService);
  const router = inject(Router);

  const usuarioEnLinea = auth.getUsuarioEnLinea();

  if(usuarioEnLinea){
    router.navigate(['/catalogo']);
    return false;
  }

  return true;
};
