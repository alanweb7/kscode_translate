import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificacaoPushPage } from './notificacao-push';

@NgModule({
  declarations: [
    NotificacaoPushPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificacaoPushPage),
  ],
})
export class NotificacaoPushPageModule {}
