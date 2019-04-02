import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnqueteVotarPage } from './enquete-votar';
import { PhotoViewer } from '@ionic-native/photo-viewer';
@NgModule({
  declarations: [
    EnqueteVotarPage,
  ],
  imports: [
    IonicPageModule.forChild(EnqueteVotarPage),
  ],
  
  providers: [
   PhotoViewer
  ]
})
export class EnqueteVotarPageModule {}
