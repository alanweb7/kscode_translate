import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContatoListPage } from './contato-list';

@NgModule({
  declarations: [
    ContatoListPage,
  ],
  imports: [
    IonicPageModule.forChild(ContatoListPage),
  ],
})
export class ContatoListPageModule {}
