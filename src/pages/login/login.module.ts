import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { ClienteProvider } from '../../providers/cliente/cliente';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
  ],
  
  providers:[
    ClienteProvider,
    
  ]
})
export class LoginPageModule {}
