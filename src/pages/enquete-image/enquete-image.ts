import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Camera, CameraOptions} from "@ionic-native/camera";
import { ImagePicker } from '@ionic-native/image-picker';
import { UtilService } from '../../providers/util/util.service';
/**
 * Generated class for the EnqueteImagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  priority : 'off',
  segment  : 'EnqueteImage/:imagens/:code/:token/:qtd/:pacote',
  defaultHistory:['EnqueteAddPage']
})
@Component({
  selector: 'page-enquete-image',
  templateUrl: 'enquete-image.html',
})
export class EnqueteImagePage {
  images: any[];
  token: any;
  id_code: any;
  imagesbase64: string;
  constructor(public navCtrl         : NavController,
              public navParams       : NavParams,
              public alertCtrl       : AlertController,
              public actionSheetCtrl : ActionSheetController,
              public camera          : Camera,
              public imagePicker     : ImagePicker,
              private photoViewer    : PhotoViewer, 
              public util            : UtilService,
            ) {
  }

  ionViewDidLoad() {
    this.images       = [];
    this.token        = String;
    this.id_code      = String;
    this.id_code      = "";
    this.token        = "";
    this.imagesbase64 = "";
    this.imagesbase64 = this.navParams.get('imagens');
    this.token        = this.navParams.get('token');
    this.id_code      = this.navParams.get('code');
    this.getImagenServe();
    console.log('ionViewDidLoad EnqueteImagePage');
  }
  getImagenServe(){
    if(this.imagesbase64 != "" && this.imagesbase64 != null){
         this.images=[];
         for (let i = 0; i < this.imagesbase64.length; i++) {
             this.images.push(this.imagesbase64[i]);
        }
         this.imagesbase64="";
     }
  }
  showConfirm_ItemArray(id_img) {
    const confirm = this.alertCtrl.create({
     title: 'Tem certeza que deseja excluir este item ?',
     message: '',
     buttons: [
       {
         text: 'Cancelar',
         handler: () => {
          
         }
       },
       {
         text: 'EXCLUIR',
         handler: () => {
           this.removeItemArray(id_img);
         }
       }
     ]
   });
   confirm.present();
  } 
  removeItemArray(item){
    console.log("item para remover",item);
    const index = this.images.indexOf(item);
    this.images.splice(index, 1);
    console.log( this.images );
  }
  //visualizar foto tamnho maior
viewPhoto(img){
  this.photoViewer.show(img);
}
    //chama pra escolher a opção da foto
onActionSheet(): void {
  this.actionSheetCtrl.create({
    title: 'Selecione a image',
    buttons: [
      {
        text: 'Galeria',
        handler: () => {
          
            this.getPictures(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Camera',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancelar'
      }
    ]
  }).present();
}  
private takePicture(sourceType: number): void {

  let cameraOptions    : CameraOptions = {
    correctOrientation: true,
    quality: 100,
    saveToPhotoAlbum: false,
    sourceType: sourceType,
    mediaType: this.camera.MediaType.PICTURE
        
  };
    this.camera.getPicture(cameraOptions)
    .then((fileUri: string) => {
              //converter base64
             this.util.converterBase64(fileUri).then((base64:any) => {
              base64.replace('', '+');
              console.log(base64);
              this.images.push({id: "",files:base64,img_link: fileUri,file_name: fileUri});
             });
          
          }).catch((err: Error) => console.log('Camera error: ', err));

     
}
getPictures(sourceType: number){ 
  let options = {
    maximumImagesCount: 2,
    quality: 100,
    sourceType: sourceType
  }
  this.imagePicker.getPictures(options).then( results =>{
    for(let i=0; i < results.length;i++){
      console.log("result image picker",results[i]);
      if(results[i] != "K" && results[i] != "O"){
          //converter base64
          this.util.converterBase64(results[i]).then((base64:any) => {
            base64.replace('', '+');
            console.log(base64);
            this.images.push({id: "",files:base64,img_link: results[i],file_name: results[i]});
          });
      } 
     
    }
  });

}
enviar(){
  JSON.stringify(this.images);
  this.navCtrl.push('EnqueteAddPage',{imagens:this.images,token:this.token,code:this.id_code});
 
}
}
