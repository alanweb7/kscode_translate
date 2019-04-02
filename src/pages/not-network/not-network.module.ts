import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotNetworkPage } from './not-network';

@NgModule({
  declarations: [
    NotNetworkPage,
  ],
  imports: [
    IonicPageModule.forChild(NotNetworkPage),
  ],
})
export class NotNetworkPageModule {}
