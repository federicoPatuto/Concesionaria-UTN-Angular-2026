import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { autoConcesionariaAdminGuard } from './auto-concesionaria-admin-guard';

describe('autoConcesionariaAdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => autoConcesionariaAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
