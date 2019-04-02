import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageAddPage } from './image-add';
import { Camera} from "@ionic-native/camera";
import { ImagePicker } from '@ionic-native/image-picker';
import { PhotoViewer } from '@ionic-native/photo-viewer';
@NgModule({
  declarations: [
    ImageAddPage,
  ],
  imports: [
    IonicPageModule.forChild(ImageAddPage),
  ],
  providers: [
    Camera,
   ImagePicker,
   PhotoViewer
  ]
})
export class ImageAddPageModule {}
