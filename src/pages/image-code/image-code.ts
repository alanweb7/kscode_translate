import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform ,App, ViewController,LoadingController, ToastController, AlertController, ModalController} from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';
//Import Provider
import { NetworkProvider } from '../../providers/network/network';
import { CodeProvider } from '../../providers/code/code';
import { UtilService } from '../../providers/util/util.service';
@IonicPage({
  priority : 'off',
  segment  : 'ImageCode/:imagens/:code/:token/:qtd/:pacote',
  defaultHistory:['MenuCodePage']
})
@Component({
  selector: 'page-image-code',
  templateUrl: 'image-code.html',
})
export class ImageCodePage {

  images        : any[];
  imagesbase64  : String;
  caminho       : any[];
  token         : any;
  id_code       : any;
  qtd           : Number;
  pacote        : String;
  control_reverse :Boolean;
  package_name: String;
  package_imagens: Number;

  constructor(
    public navCtrl         : NavController, 
    public navParams       : NavParams, 
    public platform        : Platform,
    public viewCtrl        : ViewController,
    public appCtrl         : App,
    private photoViewer    : PhotoViewer,
    private codeProvider   : CodeProvider,
    public  net            : NetworkProvider,
    public toast           : ToastController,
    public alertCtrl       : AlertController,
    public loadingCtrl     : LoadingController,
    public modalCtrl       : ModalController,
    public util            : UtilService,
             ) {
  }

  ionViewDidLoad(){
    this.images       = [];
    this.caminho      = [];
    this.token        = String;
    this.id_code      = String;
    this.pacote       = "";
    this.id_code      = "";
    this.token        = "";
    this.imagesbase64 = "";
    this.qtd          = 0;
    //this.imagesbase64 = this.navParams.get('imagens');
    this.token        = this.navParams.get('token');
    this.id_code      = this.navParams.get('code');
    this.package_name      = this.navParams.get('package_name');
    this.package_imagens      = this.navParams.get('package_imagens');
    this.getImagenServe();
    this.control_reverse = true;
  }
  //fazer o start do slide
 ionViewDidEnter() {
  this.getShowCode();
 
 }
  ShowCam(){

 this.navCtrl.push('ImageAddPage',{imagens:this.images,token:this.token,code:this.id_code,package_imagens:this.package_imagens,package_name:this.package_name});
   // myModal.present();
   // this.viewCtrl.dismiss();
    
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

 getShowCode(){
  if(this.net.ckeckNetwork()){
        this.util.showLoading("Aguarde...");
        this.codeProvider.getShowCode(this.id_code)
        .subscribe(
              (result: any) =>{
                this.util.loading.dismiss(); 
                console.log("result",result);
                if(result.status == 200){  
                  this.images              = result.data[0]['galeria'];
                  this.getImagenServe();
                     
       
                }else{
                  this.toast.create({ message: 'Ocorreu um erro inesperado !', position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                  
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
 //chamada alerta de confirmação antes de excluir
 showConfirm(id_img) {
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
         this.imagen_delete(id_img);
       }
     }
   ]
 });
 confirm.present();
} 
//visualizar foto tamnho maior
viewPhoto(img){
  this.photoViewer.show(img);
}
imagen_delete(id_img){
  if(this.net.ckeckNetwork()){
        this.util.showLoading("Aguarde...");
        this.codeProvider.imagen_delete(this.token,id_img)
        .subscribe(
              (result: any) =>{
               this.util.loading.dismiss(); 
                if(result.status == 200){
                
                  this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                  this.imagesbase64="";
                  if(result.midias.length > 0){
                    this.imagesbase64 =result.midias;
                    this.getImagenServe();
                  }else{
                    this.images = [];
                   
                  }
                  }else if(result.status == 402){
                    this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                    this.navCtrl.push('LoginPage');
                  }
                  else if(result.status == 403){
                    this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                  }

        } ,(error:any) => {
          this.toast.create({ message: "Não foi possível conectar ao servidor!", position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
              
        });
      
  }else{
    this.navCtrl.setRoot('NotNetworkPage');
  } 
}

  
}
