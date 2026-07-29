import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, switchMap } from "rxjs";
import { Admin, Cliente, Usuario } from "../interfaces/usuario.interface";

@Injectable({
    providedIn: 'root'
})

export class UsuarioService{
    private url = 'http://localhost:3000/usuarios';
    
    constructor(private http: HttpClient){}

    getUsuarios() : Observable<(Cliente | Admin)[]>{
        return this.http.get<Cliente[] | Admin[]>(this.url);
    }

    getClientes(): Observable<Cliente[]> {
        return this.http.get<(Cliente | Admin)[]>(this.url).pipe(
        map(usuarios => usuarios.filter(u => u.tipo === "cliente") as Cliente[])
        );
    }       

    getUsuarioById(id: number) : Observable<Cliente | Admin>{
        return this.http.get<Cliente | Admin>(`${this.url}/${id}`);
    }

    agregarUsuario(usuarioNuevo: Cliente | Admin): Observable<Cliente | Admin>{
        return this.getUsuarios().pipe(
            map(usuarios => {

                if(this.validadorUsuarioExistente(usuarioNuevo.email, usuarios) == true){
                    throw new Error('El mail ingresado ya está registrado en el sistema');
                }

                return usuarioNuevo;

            }),

            switchMap(usuario =>
                this.http.post<Cliente | Admin>(this.url, usuario)
            )
        );
    }

    actualizarUsuario(usuarioNuevo: Cliente | Admin): Observable<Cliente | Admin>{
        return this.http.put<Cliente | Admin>(`${this.url}/${usuarioNuevo.id}`, usuarioNuevo);
    }

    eliminarUsuario(id: number): Observable<void>{
        return this.http.delete<void>(`${this.url}/${id}`);
    }

    validadorUsuarioExistente(mail: string, usuarios: Usuario[]): boolean{
        return usuarios.some(u =>
            u.email.trim().toLowerCase() === mail.trim().toLowerCase()
        );
    }
}