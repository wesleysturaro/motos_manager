import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { HomeComponent } from './components/home/home.component';
import { FormularioCadastroMotoComponent } from './components/formulario-cadastro-moto/formulario-cadastro-moto.component';
import { GestaoEstoqueComponent } from './components/gestao-estoque/gestao-estoque.component';
import { VisualizarMotoComponent } from './components/visualizar-moto/visualizar-moto.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'cadastro', component: FormularioCadastroMotoComponent },
      { path: 'motos/:id', component: VisualizarMotoComponent },
      { path: 'estoque', component: GestaoEstoqueComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
