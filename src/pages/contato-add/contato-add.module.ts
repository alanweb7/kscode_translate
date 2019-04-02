import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContatoAddPage } from './contato-add';
import { BrMaskerModule } from 'brmasker-ionic-3';
@NgModule({
  declarations: [
    ContatoAddPage,
  ],
  imports: [
    IonicPageModule.forChild(ContatoAddPage),
    BrMaskerModule
  ],
})
export class ContatoAddPageModule {}
