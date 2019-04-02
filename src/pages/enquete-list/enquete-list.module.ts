import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnqueteListPage } from './enquete-list';

@NgModule({
  declarations: [
    EnqueteListPage,
  ],
  imports: [
    IonicPageModule.forChild(EnqueteListPage),
  ],
})
export class EnqueteListPageModule {}
