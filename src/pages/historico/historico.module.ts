import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistoricoPage } from './historico';
import { HistoricoService } from '../../providers/historico/historico.service';
@NgModule({
  declarations: [
    HistoricoPage,
  ],
  imports: [
    IonicPageModule.forChild(HistoricoPage),
  ],
  
  providers: [
    HistoricoService
  ]
})
export class HistoricoPageModule {}
