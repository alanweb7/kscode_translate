import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VideoShowPage } from './video-show';

@NgModule({
  declarations: [
    VideoShowPage,
  ],
  imports: [
    IonicPageModule.forChild(VideoShowPage),
  ],
})
export class VideoShowPageModule {}
