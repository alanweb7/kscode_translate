import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContatoCodePage } from './contato-code';
import { BrMaskerModule } from 'brmasker-ionic-3';
@NgModule({
  declarations: [
    ContatoCodePage,
  ],
  imports: [
    IonicPageModule.forChild(ContatoCodePage),
    BrMaskerModule
  ],
})
export class ContatoCodePageModule {}
