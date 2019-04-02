import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MinhaContaPage } from './minha-conta';
import { Camera} from "@ionic-native/camera";
import { ClienteProvider } from '../../providers/cliente/cliente';
@NgModule({
  declarations: [
    MinhaContaPage,
  ],
  imports: [
    IonicPageModule.forChild(MinhaContaPage),
  ],
  providers:[
    Camera,
    ClienteProvider

  ]
})
export class MinhaContaPageModule {}
