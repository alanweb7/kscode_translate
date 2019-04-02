import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MeusCodesPage } from './meus-codes';

@NgModule({
  declarations: [
    MeusCodesPage,
  ],
  imports: [
    IonicPageModule.forChild(MeusCodesPage),
  ],
})
export class MeusCodesPageModule {}
