import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Concesionaria } from '../interfaces/concesionaria.interface';

@Injectable({
  providedIn: 'root'
})
export class ConcesionariaService {

  private urlConcesionarias = 'http://localhost:3000/concesionarias';

  constructor(private http: HttpClient) {}

  getConcesionarias(): Observable<Concesionaria[]> {
    return this.http.get<Concesionaria[]>(this.urlConcesionarias);
  }

  getConcesionariaById(idConcesionaria: number): Observable<Concesionaria> {
    return this.http.get<Concesionaria>(
      `${this.urlConcesionarias}/${idConcesionaria}`
    );
  }

  agregarConcesionaria(concesionariaNueva: Concesionaria): Observable<Concesionaria> {
    return this.http.post<Concesionaria>(
      this.urlConcesionarias,
      concesionariaNueva
    );
  }

  modificarConcesionaria(concesionariaNueva: Concesionaria): Observable<Concesionaria> {
    return this.http.put<Concesionaria>(
      `${this.urlConcesionarias}/${concesionariaNueva.id}`,
      concesionariaNueva
    );
  }
}