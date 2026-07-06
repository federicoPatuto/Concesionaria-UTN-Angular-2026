import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { clienteLogueadoGuardGuard } from './cliente-logueado-guard-guard';

describe('clienteLogueadoGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => clienteLogueadoGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
