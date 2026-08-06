import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Comparador } from './comparador';

describe('Comparador', () => {
  let component: Comparador;
  let fixture: ComponentFixture<Comparador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Comparador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Comparador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
