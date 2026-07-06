import { Routes } from '@angular/router';
import { LogIn } from './pages/log-in/log-in';
import { SignUp } from './pages/sign-up/sign-up';
import { Catalogo } from './pages/auto/catalogo/catalogo';
import { Detalle } from './pages/auto/detalle/detalle';
import { redirectIfLoggedInGuard } from './guards/redirect-if-logged-in-guard';
import { FavoritosComponent } from './pages/favoritos/favoritos.component';
import { clienteLogueadoGuardGuard } from './guards/cliente-logueado-guard-guard';
import { CitaComponent } from './pages/cita/cita.component';
import { AutoFormComponent } from './forms/auto-form/auto-form.component';
import { logInGuard } from './guards/log-in-guard';
import { autoConcesionariaAdminGuard } from './guards/auto-concesionaria-admin-guard';
import { adminLogueadoGuard } from './guards/admin-logueado-guard';

export const routes: Routes = [
    {path:"",redirectTo: 'catalogo',pathMatch:'full'},
    {path:"login",component: LogIn, canActivate: [redirectIfLoggedInGuard]},
    {path:"sign-up",component:SignUp, canActivate: [redirectIfLoggedInGuard]},
    {path:"catalogo", component:Catalogo},
    {path:"detalle/:id", component: Detalle, canActivate: [autoConcesionariaAdminGuard]},
    {path:"favoritos", component: FavoritosComponent, canActivate: [clienteLogueadoGuardGuard]},
    {path:"citas", component: CitaComponent, canActivate: [logInGuard]},
    {path:"agregar-auto", component: AutoFormComponent, canActivate: [adminLogueadoGuard]},
    {path: '**', redirectTo: 'catalogo'}
];
