import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, ToastController } from 'ionic-angular';
//Import Native
import { Camera, CameraOptions } from "@ionic-native/camera";
import { BrowserTab } from '@ionic-native/browser-tab';
//Import Provider
import { UtilService } from '../../providers/util/util.service';
import { NetworkProvider } from '../../providers/network/network';
import { CodeProvider } from '../../providers/code/code';
@IonicPage({
  priority : 'off',
  segment  : 'DocumentoCode/:docs/:code/:token/:qtd',
  defaultHistory:['MenuCodePage']
})
@Component({
  selector: 'page-documento-code',
  templateUrl: 'documento-code.html',
})
export class DocumentoCodePage {
  token      : any;
  id_code    : any;
  docs       : any[];
  docbase64  : String;
  caminho    : any[];
  url        : any;
  qtd        : Number;
  pacote     : String;
  constructor(
               public navCtrl        : NavController,
               public navParams      : NavParams,
               private codeProvider  : CodeProvider,
               public  net           : NetworkProvider,
               public camera         : Camera, 
               private browserTab    : BrowserTab,
               public toast          : ToastController,
               public util           : UtilService,
               private alertCtrl     : AlertController,
            
              ) {
  }

  ionViewDidLoad() {
    this.caminho    = [];
    this.docs       = [];
    this.caminho    = [];
    this.token      = String;
    this.id_code    = String;
    this.url        = String;
    this.url        = "";
    this.id_code    = "";
    this.token      = "";
    this.qtd        = 0;
    this.docbase64  = "";
    this.pacote     = "";
    this.docbase64  = this.navParams.get('docs');
    this.token      = this.navParams.get('token');
    this.id_code    = this.navParams.get('code');
    this.qtd        = this.navParams.get('qtd');
    this.pacote     = this.navParams.get('pacote');
    this.getDocServe();
  }
  //chamada alerta de confirmação antes de excluir
  showConfirm(id_code) {
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
           this.doc_delete(id_code);
         }
       }
     ]
   });
   confirm.present();
  
  
  } 
 
  doc_delete(id_code){
    if(this.net.ckeckNetwork()){
          this.util.showLoading("Aguarde..");
          this.codeProvider.doc_delete(this.token,id_code)
          .subscribe(
                (result: any) =>{
                  this.util.loading.dismiss(); 
                  if(result.status == 200){
                    console.log("result delete code",result);
                    this.toast.create({ message: 'Excluído com sucesso !', position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                    this.docbase64 = result.midias;
                    this.getDocServe();
                  }else if(result.status == 402){
                    this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'alerta'  }).present();
                    this.navCtrl.push('LoginPage');
                  }
                  else if(result.status == 403){
                    this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                  }

          } ,(error:any) => {});
        
   }else{
    
    this.navCtrl.setRoot('NotNetworkPage');
   } 
  }
  getDocServe(){
    this.docs =[];
    if(this.docbase64 != "" && this.docbase64 != null){
         for (let i = 0; i < this.docbase64.length; i++) {
            this.docs.push(this.docbase64[i]);
          }
         this.docbase64 ="";
       
    }
  }
  private takePicture(): void {

    const options: CameraOptions = {
      quality: 100,
      allowEdit:true,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.ALLMEDIA,
      saveToPhotoAlbum: true
    }
  
     this.camera.getPicture(options).then((imageData) => {
          if(this.util.getExtension(imageData) != '.pdf'){
            let alert = this.alertCtrl.create({
              title: 'Arquivo Inválido',
              subTitle: 'Selecione um arquivo PDF',
              buttons: ['OK']
            });
            alert.present();
          }else{
            this.docs.push({id: "",doc_link:imageData,file_name:imageData});
            //converter base64
            this.util.converterBase64(imageData).then((base64:any) => {
                base64.replace('', '+');
                this.caminho.push({files:base64,file_name:imageData});
            });
              
      
          }

    }, (err) => {
     // Handle error
    });
  
  

  }
 enviar(){
    this.util.showLoading("Enviando...");
    if(this.caminho.length >0){
        if(this.net.ckeckNetwork()){
              this.codeProvider.doc_create(this.id_code,this.token,this.caminho) 
              .subscribe(
                    (result: any) =>{
                      if(result.status == 200){
                        this.util.loading.dismiss(); 
                        this.docbase64    = "";
                        this.caminho      = [];
                        this.docbase64    = result.midias;
                        this.getDocServe();
                      }
                      else if(result.status == 402){
                        this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                        this.navCtrl.push('LoginPage');
                      }
                      else if(result.status == 403){
                        this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                      }
                      
                  },(error:any) => {
                      this.util.loading.dismiss();  
                      this.toast.create({ message: "Ocorreu um erro!", position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'erro'  }).present();
                  });   
        } else{
                this.util.loading.dismiss();
                this.navCtrl.setRoot('NotNetworkPage');
           }   
    }else{
        
        this.util.loading.dismiss();
              let alert = this.alertCtrl.create({
                title: 'AVISO!',
                subTitle: 'Selecione uma documento antes de enviar',
                buttons: ['OK']
              });
              alert.present();
    }
  }

  viewPDF(url){
    this.browserTab.isAvailable()
    .then(isAvailable => {
      if (isAvailable) {
        this.browserTab.openUrl('https://docs.google.com/viewer?url='+url);
      } 
    });

  }
  
}
