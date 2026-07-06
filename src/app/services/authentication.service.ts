import { Injectable, signal, computed, inject } from "@angular/core";
import { Usuario, Cliente, Admin } from "../interfaces/usuario.interface";
import { Observable, of } from "rxjs";
import { UsuarioService } from "./usuario.service";
import { catchError, map } from 'rxjs/operators';
import { toObservable } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";

type ResultadoLogin = 
    | {resultado: 'exitoso', usuario: Cliente | Admin}
    | {resultado: 'password_incorrecta'}
    | {resultado: 'mail_inexistente'}
    | {resultado: 'mail_existente'};

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService{
    private readonly usuario = signal<Cliente | Admin | null>(null);

    readonly esAdmin = computed(() => this.usuario()?.tipo === 'admin');
    readonly esCliente = computed(() => this.usuario()?.tipo === 'cliente');
    readonly estaLogueado = computed(() => this.usuario() !== null);
    readonly usuarios = computed(() => this.usuarioService.getUsuarios());

    constructor(private usuarioService: UsuarioService,
        private router: Router
    ){}

    initUsuario(): Promise<void> {
        return new Promise(resolve => {
            const saved = localStorage.getItem('usuario');
            if (saved) {
            try {
                this.usuario.set(JSON.parse(saved));
            } catch (e) {
                this.usuario.set(null);
            }
            }
            resolve();
         });
    }

    login(email: string, password: string): Observable<ResultadoLogin>{
        return this.usuarioService.getUsuarios().pipe(
            map(usuarios => {

                const usuarioEncontrado = usuarios.find(u => u.email === email);

                if(!usuarioEncontrado){
                    return {resultado: 'mail_inexistente'} as ResultadoLogin;
                }

                if(usuarioEncontrado.password.trim() != password.trim()){
                    return {resultado: 'password_incorrecta'} as ResultadoLogin;
                }
                this.usuario.set(usuarioEncontrado);
                localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));
                return {resultado: 'exitoso', usuario: usuarioEncontrado} as ResultadoLogin;
            })
        );
    }

    signUp(newUser: Usuario ): Observable<ResultadoLogin>{
        const nuevoId = this.obtenerNuevoIdUsuarios();
        const clienteAGuardar: Cliente = {
        ...newUser,
        id: nuevoId,
        tipo: 'cliente',
        favoritos: []
      };

        return this.usuarioService.agregarUsuario(clienteAGuardar).pipe(
            map(currentUser =>{
                this.usuario.set(currentUser);
                return {resultado: 'exitoso',usuario:currentUser} as ResultadoLogin;
            }),
            //catchError(()=> of ({ resultado: 'error al registrar' } as unknown as ResultadoLogin))
        );
    }

    logout(): void{
        this.usuario.set(null);
        localStorage.removeItem('usuario');
        this.router.navigate(['/']);
    }

    getUsuarioEnLinea(): Cliente | Admin | null{
        return this.usuario();
    }

    getUsuarioEnLineaBoolean(): boolean{
        return this.usuario() != null;
    }

    //Nos encontramos con el inconveniente de que, al actualizar campos de usuario (como su lista de favoritos, por ejemplo) el sitio solo se actualizaba al recargar
    //ya que volvían a cargarse los servicios de get desde el JSON. Con esta función logramos actualizar en tiempo real el sitio.
    actualizarUsuarioEnLinea(usuarioActualizado: Cliente | Admin): void {
        this.usuario.set(usuarioActualizado);
        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
    }

    obtenerNuevoIdUsuarios(): number{
        let arregloUsuarios: Usuario[] = [];
        this.usuarioService.getUsuarios().subscribe((usuarios) => {
            arregloUsuarios = usuarios;
        });
        if(arregloUsuarios && arregloUsuarios.length > 0){
            const idUsuarios = arregloUsuarios.map(a => Number(a.id));
            return Math.max(...idUsuarios) + 1;
        }
        return 1;
    }
}
