import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminLogueadoGuard } from './admin-logueado-guard';

describe('adminLogueadoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminLogueadoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
