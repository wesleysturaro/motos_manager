import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { MenuLateralComponent } from './components/menu-lateral/menu-lateral.component';
import { HomeComponent } from './components/home/home.component';
import { TabelaPrincipalEstoqueComponent } from './components/tabela-principal-estoque/tabela-principal-estoque.component';
import { FormularioCadastroMotoComponent } from './components/formulario-cadastro-moto/formulario-cadastro-moto.component';
import { GestaoEstoqueComponent } from './components/gestao-estoque/gestao-estoque.component';
import { LoginComponent } from './components/login/login.component';
import { VisualizarMotoComponent } from './components/visualizar-moto/visualizar-moto.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { CheckboxModule } from 'primeng/checkbox';
import { appConfig } from './app.config';

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    MenuLateralComponent,
    HomeComponent,
    TabelaPrincipalEstoqueComponent,
    FormularioCadastroMotoComponent,
    GestaoEstoqueComponent,
    LoginComponent,
    VisualizarMotoComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    SidebarModule,
    PanelMenuModule,
    ButtonModule,
    TableModule,
    DropdownModule,
    InputTextModule,
    InputTextarea,
    InputNumberModule,
    CalendarModule,
    ToastModule,
    ChartModule,
    CardModule,
    TagModule,
    ToolbarModule,
    ProgressSpinnerModule,
    DialogModule,
    ConfirmDialogModule,
    FileUploadModule,
    GalleriaModule,
    CheckboxModule,
  ],
  providers: [
    ...appConfig.providers,
    MessageService,
    ConfirmationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
