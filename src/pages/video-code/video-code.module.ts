import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VideoCodePage } from './video-code';
import { Camera} from "@ionic-native/camera";
import { MediaCapture } from '@ionic-native/media-capture';
import { VideoEditor } from '@ionic-native/video-editor';
import { FileTransfer} from '@ionic-native/file-transfer';
import { FTP } from '@ionic-native/ftp';
@NgModule({
  declarations: [
    VideoCodePage,
  ],
  imports: [
    IonicPageModule.forChild(VideoCodePage),
  ],
  
  providers: [
    Camera,
    MediaCapture,
    FTP,
    VideoEditor,
    FileTransfer
  ]
})
export class VideoCodePageModule {}
