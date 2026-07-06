import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { inject } from '@angular/core';
import { AutoService } from '../services/auto.service';
import { catchError, map, of } from 'rxjs';
import { Admin } from '../interfaces/usuario.interface';

export const autoConcesionariaAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const autoService = inject(AutoService);
  const router = inject(Router);

  const idAuto = Number(route.paramMap.get('id'));
  const usuarioEnLinea = authService.getUsuarioEnLinea();

  if (!usuarioEnLinea || usuarioEnLinea.tipo !== 'admin') {
    return true;
  }

  return autoService.getAutoCompletoById(idAuto).pipe(
    map(auto => {
      if (auto.concesionaria.id == usuarioEnLinea.idConcesionaria) {
        return true;
      } else {
        alert('No tenés permiso para ver este auto');
        router.navigate(['/catalogo']);
        return false;
      }
    }),
    catchError(() => {
      // Si ocurre un error (auto no existe), redirigimos
      router.navigate(['/catalogo']);
      return of(false);
    })
  );
};
