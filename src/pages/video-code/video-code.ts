import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,Alert, LoadingController, ToastController, ModalController, ActionSheetController, Platform, ViewController } from 'ionic-angular';
//import Native
import { Camera, CameraOptions} from "@ionic-native/camera";
import { MediaCapture, MediaFile, CaptureError,CaptureVideoOptions } from '@ionic-native/media-capture';
import { File, Entry } from '@ionic-native/file';
import { FTP } from '@ionic-native/ftp';
import { VideoEditor } from '@ionic-native/video-editor';
//import Provider
import { NetworkProvider } from '../../providers/network/network';
import { CodeProvider } from './../../providers/code/code';
import { UtilService } from '../../providers/util/util.service';
@IonicPage({
  priority : 'off',
  segment  : 'VideoCode/:videos/:code/:token/:qtd/:pacote',
  defaultHistory:['MenuCodePage']
})
@Component({
  selector: 'page-video-code',
  templateUrl: 'video-code.html',
})
export class VideoCodePage {
  token        : any;
  id_code      : any;
  videos       : any[];
  vidbase64    : String;
  caminho      : any[];
  package_codes          : Number;
  package_name       : String;
  videos_serve : any[];
  fullPath     : string;
  name         : String;
  localURL     : any;
  info         : any;
  size         : any;
  isConvertido : Number=3;
  alerte       : Alert;
  extension    : String;
  package_videos :Number;
  public progress: number = 0;
  isAdicionado  :number =  0;
 
  utmADD : String;
  constructor(
               public navCtrl         : NavController,
               public navParams       : NavParams,
               private codeProvider   : CodeProvider,
               public  net            : NetworkProvider,
               public toast           : ToastController,
               public camera          : Camera, 
               private alertCtrl      : AlertController,
               public file            : File,
               public platform        : Platform,
               public modalCtrl       : ModalController,
               public loadingCtrl     : LoadingController,
               public actionSheetCtrl : ActionSheetController,
               private mediaCapture   : MediaCapture,
               public util            : UtilService,
               public viewCtrl        : ViewController,
               private videoEditor    : VideoEditor,
               private fTP            : FTP,
               private ng_zone: NgZone,

              ) {}

  ionViewDidLoad() {
    this.caminho       = [];
    this.videos        = [];
    this.caminho       = [];
    this.videos_serve  = [];
    this.token         = String;
    this.id_code       = String;
    this.id_code       = "";
    this.token         = "";
    this.vidbase64     = "";
    this.package_codes = 0;
    this.package_name  = "";
    this.vidbase64     = this.navParams.get('videos');
    this.token         = this.navParams.get('token');
    this.id_code       = this.navParams.get('code');
    this.package_codes = this.navParams.get('package_codes');
    this.package_name  = this.navParams.get('package_name');
    this.package_videos = this.navParams.get('package_videos');
    this.getVideoServe();
  }
  //preencher lista vinda por parametro
getVideoServe(){
    this.videos =[];
    if(this.vidbase64 != "" && this.vidbase64 != null){
         for (let i = 0; i < this.vidbase64.length; i++) {
               this.videos.push(this.vidbase64[i]);
              this.videos_serve.push(this.vidbase64[i]);
        }
        this.vidbase64 ="";
    }
}
//chama pra escolher a opção da foto
onActionSheet(): void {
  this.actionSheetCtrl.create({
    title: 'Selecione a image',
    buttons: [
      {
        text: 'Link de vídeo externo',
        handler: () => {
          
            this.showPrompt();
        }
      },
      {
        text: 'Galeria',
        handler: () => {
          this.takePicture();
        }
      },
       {
        text: 'Camera',
        handler: () => {
          this.VideoCapture();
        }
      },  
      
      {
        text: 'Cancelar'
      }
    ]
  }).present();
}
showPrompt() {
    const prompt = this.alertCtrl.create({
        title: 'Escolha o seu CODE',
        message: "Informe o link do seu vídeo",
        inputs: [
          {
            name: 'link',
            placeholder: 'Informe o link'
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Publicar',
            handler: data => {
              console.log('Saved clicked',data.link);
              this.insertVideoLinkArray(data.link);
            }
          }
        ]
      });
      prompt.present();
}
public insertVideoLinkArray(link){
  this.util.showLoading("Enviando...");
    if(this.net.ckeckNetwork()){
      
          this.codeProvider.video_link_create(this.id_code,this.token,link) 
           .subscribe(
              (result: any) =>{    
                this.util.loading.dismiss(); 
                if(result.status == 200){
                  console.log("result delete code",result);
                  this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                  this.vidbase64 = result.midias;
                  this.getVideoServe();
                }else if(result.status == 402){
                  this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'alerta'  }).present();
                  this.navCtrl.push('LoginPage');
                }
                else if(result.status == 403){
                  this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                }

           } ,(error:any) => {
            this.toast.create({ message:"Não foi possível conectar ao servidor!", position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
            this.util.loading.dismiss(); 
            this.navCtrl.setRoot('HomePage');
           });

    }else{
      this.util.loading.dismiss(); 
        this.navCtrl.setRoot('NotNetworkPage');
    } 
 
}
 //gravar video pela camera
VideoCapture(){
    let options: CaptureVideoOptions = {
      limit: 1,
      duration: 18000,//segundos
      quality :100
    }
    this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {
       this.fullPath    = res[0]['fullPath'];
       this.extension   = this.util.getExtension(this.fullPath);
       console.log("extensio",this.extension);
      // this.name        = res[0]['name'];
       this.isConvertido =3;
       let capturedFile = res[0];
       this.videos = [];
       let fileName = capturedFile.name;
       let dir = capturedFile['localURL'].split('/');
       dir.pop();
       let fromDirectory = dir.join('/');    
       var toDirectory = this.file.externalCacheDirectory;
       this.correctPath(fromDirectory , fileName ,toDirectory , fileName);
     },
    (err: CaptureError) => console.error(err));
       
  }
private takePicture(): void {

    const options: CameraOptions = {
      quality: 100,
      sourceType :this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.VIDEO,
      saveToPhotoAlbum: true
    }
    
      this.camera.getPicture(options).then((imageData) => {
         //testa se o arquivo selecionado é um video
         this.extension   = this.util.getExtension(imageData);
         console.log("extensio",this.extension);
          if(this.util.getExtension(imageData) != '.mp4'){
            let alert = this.alertCtrl.create({
              title: 'Arquivo Inválido',
              subTitle: 'Selecione um arquivo de Vídeo',
              buttons: ['OK']
            });
            alert.present();
          }else{
            //inclui na array da tela 
            this.caminho   = [];
            this.videos    = [];
            this.isConvertido =3;
           // this.videos    = this.videos_serve;
            this.fullPath = 'file://'+imageData;
            console.log(imageData);
            console.log("size",this.size);
            console.log(this.searchString(this.fullPath),this.searchString2(this.fullPath),this.searchString3(this.fullPath),this.searchString4(this.fullPath));
            if(this.searchString(this.fullPath) < 0  && this.searchString2(this.fullPath) < 0 &&  this.searchString3(this.fullPath) < 0 && this.searchString4(this.fullPath) < 0 ){
                   this.inicia();
                  console.log("entrei no 1 if");
             }
            
             else{
                //converter base64
                this.videos = this.videos_serve;
                this.showAlert();
                this.util.converterBase64(imageData).then((base64:any) => {
                  base64.replace('', '+');
                  this.alerte.dismiss();
                  console.log(base64);
                  this.isAdicionado =2;
                  this.videos      = [];
                  this.videos      = this.videos_serve;
                  this.caminho=[];
                  this.caminho[0]= {files:base64,file_name:imageData};
                  this.isConvertido = 1;
                  this.videos.push({id: "",video_link:imageData,file_name:imageData,post_status:1}); 
                  /* this.utmADD
                  if(this.isAdicionado == 1 || this.isAdicionado == 2){
                        this.removeItemArray(imageData);
                        this.isAdicionado = 0;
                  }  */
                });
                
              
              } 
    }

    }, (err) => {
     // Handle error
    });
  
    

}

inicia(){
    this.showAlert();
    this.transcodeVideo().then((result)=>{
          console.log("result transcode",result);
          this.alerte.dismiss();
          if(result == undefined){
            let alert = this.alertCtrl.create({
              title: 'Aviso!!!',
              subTitle: 'Houve um problema na conversão do vídeo,tente novamente.',
              buttons: ['OK']
            });
            alert.present();
          }
          
    });
}
showAlert(){
    this.alerte= this.alertCtrl.create({
      title: 'Convertendo vídeo!',
      subTitle: 'Aguarde até o fim da conversão.<br><br><div class="circle"></div><br><br>',
      enableBackdropDismiss: false 
    });
    this.alerte.present();
  }
selectUpload(){ 
   if(this.caminho.length > 0 ){
      this.enviar();
   }else{
      this.onUploadFTP();
   }
}
handleIFrameLoadEvent(): void {
 
}
removeItemArray(item){
  console.log("item para remover",item);
  const index = this.videos.indexOf(item);
  this.videos.splice(index, 1);
  console.log( this.videos );
}
video_delete(id_code){
    if(this.net.ckeckNetwork()){
          this.util.showLoading("Aguarde..");
          this.codeProvider.video_delete(this.token,id_code)
          .subscribe(
                (result: any) =>{
                  this.util.loading.dismiss(); 
                  if(result.status == 200){
                    console.log("result delete code",result);
                    this.toast.create({ message: 'Excluído com sucesso !', position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                    if(result.midias.length > 0){
                      //this.vidbase64 =result.midias;
                       this.removeItemArray(id_code);
                      //this.getVideoServe();
                    }else{
                      this.videos = [];
                     
                    }
                   
                  }else if(result.status == 402){
                    this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'alerta'  }).present();
                    this.navCtrl.push('LoginPage');
                  }
                  else if(result.status == 403){
                    this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                  }

          } ,(error:any) => {
            this.toast.create({ message:"Não foi possível conectar ao servidor!", position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
            this.util.loading.dismiss(); 
            this.navCtrl.setRoot('HomePage');
          });
        
   }else{
    this.navCtrl.setRoot('NotNetworkPage');
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
//chamada alerta de confirmação antes de excluir
showConfirm(id_img) {
  const confirm = this.alertCtrl.create({
   title: 'Tem certeza que deseja excluir este item ?',
   message: '',
   buttons: [
     {
       text: 'Cancelar',
       handler: () => {
         console.log('Disagree clicked');
       }
     },
     {
       text: 'EXCLUIR',
       handler: () => {
         this.video_delete(id_img);
       }
     }
   ]
 });
 confirm.present();
} 
//muda a qualidade do vídeo
transcodeVideo():Promise<string>{
 return <Promise<string>> this.videoEditor.transcodeVideo({
    fileUri: this.fullPath,
    outputFileName: ""+new Date().getTime(),
    outputFileType: this.videoEditor.OutputFileType.MPEG4,
    optimizeForNetworkUse: this.videoEditor.OptimizeForNetworkUse.YES,
    saveToLibrary: false,
    maintainAspectRatio: true,
    videoBitrate: 7000000, // 5 megabit
    audioChannels: 2,
    audioSampleRate: 44100,
    audioBitrate: 128000, // 128 kilobits,
    progress: function(info) {
        console.log('transcodeVideo progress callback, info: ' + info);
        console.log('transcodeVideo progress callback, info: ' + info*100);
        this.info = 3000;
    } 
  })
  .then((fileUri: string) =>{ 
       this.isConvertido = 1;
       this.videos       = this.videos_serve;
       this.fullPath     = fileUri;
       this.videos       = [];
       this.videos       = this.videos_serve;
       this.videos.push({id: "",video_link: this.fullPath,file_name:this.fullPath,post_status:1}); 
       this.isAdicionado = 1;
       this.toast.create({ message:"Vídeo convertido com sucesso!", position: 'top', duration: 4000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
       return fileUri;
       
  }, (err) => {
        this.isConvertido = 2;
        this.toast.create({ message:"Não foi possível converter o vídeo selecionado!", position: 'top', duration: 4000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
        this.alerte.dismiss();
  })
  .catch((error: any) => {
        this.isConvertido = 2;
        this.alerte.dismiss();
        this.toast.create({ message:"Não foi possível converter o vídeo selecionado!", position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
  });  

}
///envio base64
enviar(){
  if(this.caminho.length >0){
   
      if(this.net.ckeckNetwork()){
        this.util.showLoading("Enviando...");
      this.codeProvider.video_create(this.id_code,this.token,this.caminho) 
                  .subscribe(
                       (result: any) =>{
                        this.util.loading.dismiss(); 
                          if(result.status == 200){
                              //limpa array
                              this.extension ="";
                              this.vidbase64="";
                              this.caminho =[];
                              console.log("result servidor",result);
                              //repopula result do servidor
                              this.vidbase64 = result.midias;
                              this.getVideoServe();
                              this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                       
                          } else if(result.status == 402){
                            this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                            this.navCtrl.push('LoginPage');
                          }
                          else if(result.status == 403){
                            this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                          }
                        },(error:any) => {
                          console.log('erro',error);
                          this.toast.create({ message:error, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                          this.util.loading.dismiss(); 
                       
                        }); 
                  } else{
                    this.util.loading.dismiss();
                    this.navCtrl.setRoot('NotNetworkPage');
               }   
   }else{
          this.util.loading.dismiss();
                  let alert = this.alertCtrl.create({
                    title: 'AVISO!',
                    subTitle: 'Selecione uma vídeo antes de enviar',
                    buttons: ['OK']
                  });
                  alert.present();
    }
}
validaPacote(){
  console.log();
  if(this.videos.length > 0){
    if(this.videos.length >= this.package_videos ){
      const alert = this.alertCtrl.create({
        title: 'Alerta',
        subTitle: 'Você atingiu a quantidade uploads de vídeos disponíveis no pacote <br>'+'Pacote :'+this.package_name+'<br> Vídeos por CODE: '+this.package_videos,
        buttons: ['OK']
      });
      alert.present();
    }else{
        this.onActionSheet();
    }
  }else {
    this.onActionSheet();
 } 

}
//envio pelo FTP
onUploadFTP():void{
  if(this.isConvertido == 1){
    if(this.net.ckeckNetwork()){
         this.util.showLoading("Enviando...");
            this.fTP.connect('ftp.kscode.com.br', 'carolx54@kscode.com.br', 'carolx2018')
            .then((res: any) =>{ 
              console.log("conexão iniciada");
              //let 
             
              this.name = this.createNewFileName(this.fullPath);
              console.log("name",name);
              let url = "/"+this.id_code+"/"+this.name;
              console.log("url arq",url);
              this.fTP.upload(this.fullPath, url).subscribe((result: any) =>{
                  console.log('Login successful', result);
                  console.log('Login successful', result*100);
                  let up=result*100;
                  this.on_progress;
                  if(up== 100){
                    this.codeProvider.video_create_ftp(this.id_code,this.token,this.name) 
                    .subscribe(
                         (result: any) =>{
                          this.util.loading.dismiss(); 
                            if(result.status == 200){
                                //limpa array
                                this.vidbase64="";
                                this.extension ="";
                                this.caminho =[];
                                console.log("result servidor",result);
                                //repopula result do servidor
                                this.vidbase64 = result.midias;
                                this.getVideoServe();
                                this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                         
                            } else if(result.status == 402){
                              this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                              this.navCtrl.push('LoginPage');
                            }
                            else if(result.status == 403){
                              this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                            }
                          },(error:any) => {
                            console.log('erro',error);
                            this.toast.create({ message:error, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                            this.util.loading.dismiss(); 
                         
                          }); 
                  }
              })
            })
            .catch((error: any) => {
              console.error(error);
              this.toast.create({ message:error, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
              this.util.loading.dismiss(); 
                         
            });

          } else{
          
            this.navCtrl.setRoot('NotNetworkPage');
       }  
  
  
  }else{
            
            this.util.loading.dismiss();
                  let alert = this.alertCtrl.create({
                    title: 'AVISO!',
                    subTitle: 'Selecione uma vídeo antes de enviar',
                    buttons: ['OK']
                  });
                  alert.present();
        }
}
public on_progress = (progressEvent: ProgressEvent): void => {
  this.ng_zone.run(() => {
      if (progressEvent.lengthComputable) {
          let progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          if (progress > 100) progress = 100;
          if (progress < 0) progress = 0;
          this.progress = progress;
      }
  });
}
private createNewFileName(oldFileName: string): string {
  let extension: string = oldFileName.substr(oldFileName.lastIndexOf('.')); // .png, .jpg
  return new Date().getTime() + extension; // 1264546456.jpg
}
ShowVideo(video){
    let myModal =this.modalCtrl.create('VideoShowPage',{videos:video});
    myModal.present();
}
getSizeAq(){
    this.file.resolveLocalFilesystemUrl(this.fullPath).then((res: Entry) => {
      res.getMetadata((metadata) => {
         this.size = metadata.size;
         console.log("size",metadata.size);
      });
    })
}
correctPath2(fromDirectory , fileN ,toDirectory , fileName){
  console.log(fromDirectory);
  if (this.platform.is('android')) {
    this.file.copyFile(fromDirectory , fileN ,toDirectory , fileName).then((res) => {
           this.fullPath=res.nativeURL;
           console.log("caminho",this.fullPath);
          },err => {
            console.log("caminho",err);
          });

        }
}
correctPath(fromDirectory , fileN ,toDirectory , fileName){
   if (this.platform.is('android')) {
     this.file.copyFile(fromDirectory , fileN ,toDirectory , fileName).then((res) => {
            this.fullPath=res.nativeURL;
            this.inicia();
    },err => {
        
    });
     
    }else{
            this.inicia();
    }
}
checkDir(url,past):Boolean{
     let check ;
    this.file.checkDir(url, past).then((result:Boolean) =>{
      check = result;
    }).catch((err) => {});
    return check;
}
searchString(str1):Number{
    var index = str1.indexOf( "WhatsApp" ); 
    
    return index;
}
searchString2(str1):Number{
    var index = str1.indexOf( "fb" ); 
    
    return index;
}
searchString3(str1):Number{
    var index = str1.indexOf( "video" ); 
    
    return index;
}
searchString4(str1):Number{
    var index = str1.indexOf( "downloader" ); 
    
    return index;
}
createDir(url,past){

  if(this.checkDir(url,past)){
   }else{
      this.file.createDir(url,past,false).then(res=>{});  
  }
}
 
}
