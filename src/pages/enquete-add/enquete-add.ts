import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController,Navbar, NavParams, LoadingController, AlertController, ToastController, ActionSheetController, ViewController, reorderArray } from 'ionic-angular';
import { FormBuilder , Validators} from '../../../node_modules/@angular/forms';
import { CodeProvider } from './../../providers/code/code';
import { NetworkProvider } from '../../providers/network/network';
import { UtilService } from '../../providers/util/util.service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { PhotoViewer } from '@ionic-native/photo-viewer';


@IonicPage({
  priority : 'off',
  segment  : 'EnqueteAdd/:imagens/:code/:token/:qtd/:pacote',
  defaultHistory:['EnqueteListPage']
})
@Component({
  selector: 'page-enquete-add',
  templateUrl: 'enquete-add.html',
})
export class EnqueteAddPage {
  @ViewChild(Navbar) navBar: Navbar;
  model                : enq;
   //validação de formulario
   public loginForm     : any;
  images          : any[];
  token           : any;
  code_id         : any;
  imagesbase64    : string;
  errorquestion   = false;
  erroroption1    = false;
  erroroption2    = false;
  errordata_enc   = false;
  messagequestion = "";
  messageoption1  = "";
  messageoption2  = "";
  messagedata_enc = "";
  ask_id            : String;
  question      : String;
  option1       : String;
  option2       : String;
  data_enc      : String;
  automatic     : Boolean;
  ask_active    :String;
  constructor(
           public navCtrl         : NavController, 
           public formBuilder     : FormBuilder,
           public navParams       : NavParams,
           public alertCtrl       : AlertController,
           public loadingCtrl     : LoadingController,
           private codeProvider   : CodeProvider,
           public  net            : NetworkProvider,
           public toast           : ToastController,
           public util            : UtilService,
           public actionSheetCtrl : ActionSheetController,
           public camera          : Camera,
           public imagePicker     : ImagePicker,
           public  viewCtrl       : ViewController, 
           private photoViewer    : PhotoViewer
          ) {
            this.model = new enq();
            //instancia do formulario builder para validar os campos
             this.loginForm = formBuilder.group({
                question        : ['', Validators.required],
                option1         : ['', Validators.required],
                option2         : ['', Validators.required],
                data_enc        : ['', Validators.required],
                automatic       : ['', Validators.nullValidator],
                ask_active       : ['', Validators.nullValidator],
             });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EnqueteAddPage');
    this.images        = [];
    this.token         = String;
    this.code_id       = String;
    this.code_id       = "";
    this.token         = "";
    this.imagesbase64  = "";
    this.ask_id        = "";
    this.question      = "";
    this.option1       = "";
    this.option2       = "";
    this.data_enc      = "";
    this.ask_active    = "";
    //this.images        = this.navParams.get('imagens');
    this.token         = this.navParams.get('token');
    this.code_id       = this.navParams.get('code');
    this.ask_id        = this.navParams.get('ask_id');
    this.ask_active    = this.navParams.get('ask_active');
     if(this.ask_active == this.ask_id){
          this.model.ask_active = true;
     }else{
          this.model.ask_active = false;
     }
     if(this.net.ckeckNetwork()){
      this.util.showLoading("Aguarde...");
      if(this.ask_id == ""){
        this.util.loading.dismiss();
      }else{
        this.getEnq();
      }
     
      
    }else{
      
      this.util.loading.dismiss();
      this.navCtrl.setRoot('NotNetworkPage');
    } 
   this.navBar.backButtonClick = (e:UIEvent)=>{
    this.navCtrl.setRoot('EnqueteListPage',{token:this.token,code:this.code_id,ask_id:this.ask_id});
   
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
         this.deleteImgEnq(id_img);
       }
     }
   ]
 });
 confirm.present();
} 
  reorderItem(indexes){
    console.log("index",indexes);
    this.images   = reorderArray(this.images,indexes);
   console.log(this.images);
    
   }
  getImagenServe(){
    
         for (let i = 0; i < this.images.length; i++) {
             this.images.push(this.images[i]);
            //base64.replace('', '+');
        }
         
         console.log("img",this.images);
     
  }
 
  fecharAvaliacao(){
 
     this.viewCtrl.dismiss();
  }
  getEnq(){
    if(this.net.ckeckNetwork()){
      this.codeProvider.getEnq(this.code_id,this.ask_id)
      .subscribe(
            (result: any) =>{
                this.util.loading.dismiss(); 
                if(result.status == 200){
                  this.code_id    = result.code_id;
                  this.question   = result.question;
                  this.option1    = result.option1;
                  this.option2    = result.option2;
                  this.data_enc   = result.data_enc;
                  this.model.data_enc   = result.data_enc;
                  console.log(result.automatic);
                  if(result.automatic == ""){
                      this.automatic = false;
                      this.model.automatic =false;
                      console.log("entrei no 1 false");
                  }if(result.automatic == "1"){
                    this.automatic       = true;
                    this.model.automatic = true;
                    console.log("entrei no true");
                  }
                  if(result.automatic == "0"){
                    this.automatic       = false;
                    this.model.automatic = false;
                    console.log("entrei no 2 false");
                  }
                
                  this.images     = result.midias;
                  this.ask_id     = result.id;
                  this.model.id   = result.id;
  
                }else if(result.status == 402){
                  this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                  this.navCtrl.push('LoginPage');
                }
                else if(result.status == 403){
                  this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                  this.navCtrl.push('HomePage');
                }
        
              } ,(error:any) => {
                this.toast.create({ message:"Não foi possível conectar ao servidor!", position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                  this.util.loading.dismiss(); 
                 
              });
            }else{
              this.util.loading.dismiss();
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
    validaPacote(){
      if(this.images.length > 0){
        console.log("entrei aqui no >0");
        if(this.images.length == 2 ){
          const alert = this.alertCtrl.create({
            title: 'Alerta',
            subTitle: 'Você atingiu a quantidade uploads de 2 imagens diponíveis nesta enquete',
            buttons: ['OK']
          });
          alert.present();
        }else{
          console.log("entrei aqui no ==");
            this.onActionSheet();
        }
      }else {
        console.log("entrei aqui no else");
        this.onActionSheet();
     } 
    
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
                  this.images.push({id: "",files:base64,img_link:fileUri,file_name: fileUri});
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
              console.log("result image picker",this.images.length);
            
                    if(results[i] != "K" && results[i] != "O"){
                      //converter base64

                      this.util.converterBase64(results[i]).then((base64:any) => {
                        base64.replace('', '+');
                       // console.log(base64);
                        this.images.push({id: "",files:base64,img_link: results[i],file_name: results[i]});
                        console.log("result image picker",this.images.length);
                      });
                  } 
              
            
            
            }
          });
     
    
    }
    validaEnvio(){
      if(this.images.length > 0){
        if(this.images.length >2){
          const alert = this.alertCtrl.create({
            title: 'Alerta',
            subTitle: 'Você ultrapassou a quantidade uploads de 2 imagens disponíveis nesta enquete,reveja a lista!',
            buttons: ['OK']
          });
          alert.present();
        }else{
           this.Salvar();
        }
      }else{
        this.Salvar();
      }
    }
    Salvar(){
     
      let { question, option1,option2,data_enc} = this.loginForm.controls;
     
      if (!this.loginForm.valid) {
        console.log("entrei");
                if (!question.valid) {
                  this.errorquestion = true;
                  this.messagequestion = "Ops! Campo obrigatório.";
                } else {
                  this.messagequestion = "";
                }
            
                if (!option1.valid) {
                  this.erroroption1 = true;
                  this.messageoption1 ="Ops! Campo obrigatório."
                } else {
                  this.messageoption1 = "";
                }
                if (!option2.valid) {
                  this.erroroption2 = true;
                  this.messageoption2 ="Ops! Campo obrigatório."
                } else {
                  this.messageoption2 = "";
                }
                if (!data_enc.valid) {
                  this.errordata_enc = true;
                  this.messagedata_enc ="Ops! Campo obrigatório."
                } else {
                  this.messagedata_enc = "";
                }
      }
       else {
        console.log("entrei else",this.model.automatic);
        this.util.showLoading("Aguarde...");
        if(this.net.ckeckNetwork()){
              
           console.log("imagens",this.images);
          this.codeProvider.createEnq(this.code_id,this.model.id,this.model.question,this.model.option1,this.model.option2,this.model.data_enc,this.model.automatic,this.model.ask_active,this.token,this.images)
          .subscribe(
                (result: any) =>{
                  this.util.loading.dismiss(); 
                  if(result.status == 200){  
                    this.toast.create({ message: 'Informações foram salvas com sucesso !', position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                   // this.navCtrl.push('EnqueteListPage', {token:this.token,code:this.code_id});
                  }else if(result.status == 403){
                    this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                    this.navCtrl.setRoot('LoginPage');
                  }
                  
                }
                  ,(error:any) => {
                    this.toast.create({ message:"Não foi possível conectar ao servidor!", position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                    this.util.loading.dismiss(); 
                    this.navCtrl.setRoot('HomePage');
               });
  
              
  
          }else{
          
            this.navCtrl.setRoot('NotNetworkPage');
          } 
            
       }
    }
    deleteImgEnq(midia_id){
      this.codeProvider.deleteImgEnq(this.code_id,this.ask_id,midia_id,this.token).subscribe(
        (result: any) =>{
          this.util.loading.dismiss(); 
          if(result.status == 200){  
            this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
            //this.navCtrl.push('EnqueteListPage', {token:this.token,code:this.code_id});
            console.log("item para remover",midia_id);
            const index = this.images.indexOf(midia_id);
            this.images.splice(index, 1);
            console.log( this.images );
          }else if(result.status == 403){
            this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
            this.navCtrl.setRoot('LoginPage');
          }
          
        }
          ,(error:any) => {
            this.toast.create({ message:"Não foi possível conectar ao servidor!", position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
            this.util.loading.dismiss(); 
            this.navCtrl.setRoot('HomePage');
       });
    }
}
export class enq{
  id            : String;
  question      : String;
  option1       : String;
  option2       : String;
  data_enc      : String;
  automatic     : Boolean;
  ask_active    : Boolean;



}