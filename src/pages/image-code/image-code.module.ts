import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageCodePage } from './image-code';
import { PhotoViewer } from '@ionic-native/photo-viewer';

@NgModule({
  declarations: [
    ImageCodePage,
  ],
  imports: [
    IonicPageModule.forChild(ImageCodePage),
  ],
  providers: [
   PhotoViewer
  ]
})
export class ImageCodePageModule {}
