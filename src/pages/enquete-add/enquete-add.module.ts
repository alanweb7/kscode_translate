import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnqueteAddPage } from './enquete-add';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Camera, CameraOptions} from "@ionic-native/camera";
import { ImagePicker } from '@ionic-native/image-picker';
@NgModule({
  declarations: [
    EnqueteAddPage,
  ],
  imports: [
    IonicPageModule.forChild(EnqueteAddPage),
    BrMaskerModule,
  ],
  
  providers: [
    Camera,
   ImagePicker,
   PhotoViewer
  ]
})
export class EnqueteAddPageModule {}
