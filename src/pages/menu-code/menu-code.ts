import { Component, ViewChild, ElementRef} from '@angular/core';
import { IonicPage, NavController, NavParams , Slides, ModalController,  LoadingController, ToastController, AlertController, ViewController} from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FormBuilder , Validators} from '../../../node_modules/@angular/forms';
import { File} from '@ionic-native/file';
import { NetworkProvider } from '../../providers/network/network';
import { CodeProvider } from './../../providers/code/code';
import { UtilService } from '../../providers/util/util.service';

@IonicPage({
  priority : 'low',
  segment  : 'MenuCode/:token/:code/:qtd/:pacote',
  defaultHistory:['MeusCodesPage']
})
@Component({
  selector: 'page-menu-code',
  templateUrl: 'menu-code.html',
})
export class MenuCodePage {
  @ViewChild('mySlider') slider: Slides;
  @ViewChild('myInput') myInput: ElementRef;
  token            : any;
  code             : any;
  imagens          : any;
  videos           : any[];
  vid_aux          : any;
  docs             : any;
  name             : any;
  link             : any;
  descricao        : any;
  titulo           : any;
  id_code          : any;
  qtd_img          : Number;
  package_videos       : Number;
  package_name           : String;
  word             = /[^0-9]+/g;
  tag              = /<[^>]*>/g;
  password         : String;
  isprivate        : Boolean;
  meu_link         : any;
  t_conteudo       : String;
  card             : string;
  package_imagens  :String;
  contato={
    pais           :  String,
    whatsapp       : String,
    telefone       : String,
    email          : String,
    facebook       : String,
    instagram      : String,
    linkedin       : String,
    website        : String
  }
  constructor(
              public navCtrl        : NavController, 
              public modalCtrl      : ModalController , 
              public navParams      : NavParams, 
              public formBuilder    : FormBuilder,
              public toast          : ToastController,
              private codeProvider  : CodeProvider,
              public loadingCtrl    : LoadingController,
              public  net           : NetworkProvider,
              public util           : UtilService,
              public  viewCtrl      : ViewController, 
              public alertCtrl      : AlertController,
              private socialSharing : SocialSharing,
              public file           : File
            ) {
                  this.selectedSegment = '0';
                  //instanica do model login
                  this.model = new Link();
                  //instancia do formulario builder para validar os campos
                   this.loginForm = formBuilder.group({
                      link        : ['', Validators.required],
                      islink      : ['', Validators.required]
                    
                    });
                    this.modelC       = new Code();
                    this.cadastroCode = formBuilder.group({
                        name    : ['', Validators.required],
                      
                      });
                    //instanica do model login
                    this.modelG = new geral();
                    //instancia do formulario builder para validar os campos
                    this.cadastroForm = formBuilder.group({
                      titulo       : ['', Validators.required],
                      descricao    : ['', Validators.required],
                      password     : ['', Validators.required],
                      isprivate    : ['', Validators.required]
                    }); 
  }
  modelG            : geral;
  //validação de formulario
  public cadastroForm  : any;
  public  cadastroCode : any;
  model                : Link;
  modelC               : Code;
  //validação de formulario
  public loginForm     : any;
  messageEmail         = "";
  selectedSegment      : string;
  slides               : any;  

  ionViewDidLoad() {
    this.token            = String;
    this.code             = String;
    this.titulo           = String;
    this.descricao        = String;
    this.link             = String;
    this.videos           = [];
    this.code             = "";
    this.token            = "";
    this.link             = "";
    this.descricao        = "";
    this.titulo           = "";
    this.contato.telefone = String;
    this.package_name           = "";
    this.qtd_img          = 0;
    this.package_videos       = 0;
    this.meu_link         = String;
    this.meu_link         = "";
    this.t_conteudo       = "";
    this.package_imagens  = this.navParams.get('package_imagens');
    this.token            = this.navParams.get('token');
    this.id_code          = this.navParams.get('code');
    this.package_name           = this.navParams.get('package_name');
    this.package_imagens          = this.navParams.get('package_imagens');
    this.package_videos       = this.navParams.get('package_videos');
     console.log("img",this.package_imagens);
  }
   //fazer o start do slide
   private ionViewDidEnter() {
    this.getShowCode();
    this.slider.slideTo(1);
   }
   resize() {
    this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
   }
   //trocar o slide de acordo com o segment
   onSegmentChanged(segmentButton) {
    const selectedIndex = segmentButton.value;
    this.slider.slideTo(selectedIndex);
   }
  //trocar a o segment de acordo com o slide
  onSlideChanged(slider) {
    const currentSlide = slider.getActiveIndex();
    if(currentSlide == 0){
      this.selectedSegment = '0';
    }else if(currentSlide == 1){
        this.selectedSegment = '1';
    }else if(currentSlide == 2){
      this.selectedSegment = '2';
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
                            //popula todas a variaveis                       
                            this.titulo               = result.data[0]['titulo'];
                            this.modelG.titulo        = this.titulo;
                            this.code                 = result.data[0]['code'];
                            this.modelC.name          = this.code;
                            this.link                 = result.data[0]['link'];
                            
                            if(result.data[0]['t_conteudo'] == "2"){
                              this.model.isLink = "true";
                               this.meu_link ="2";
                            }else{
                              this.model.isLink = "false";
                              this.meu_link ="1";
                            }
                            this.model.link           = this.link;
                            this.descricao            = result.data[0]['descricao']; 
                            this.modelG.descricao     = this.descricao;
                            this.contato.pais         = result.data[0]['pais'];
                            this.contato.email        = result.data[0]['email'];
                            this.contato.website      = result.data[0]['website'];
                            this.contato.facebook     = result.data[0]['facebookUser'];
                            this.contato.instagram    = result.data[0]['instagramUser'];
                            this.contato.linkedin     = result.data[0]['linkedin'];
                            this.vid_aux              = result.data[0]['album_vimeo'];
                            this.docs                 = result.data[0]['documento'];
                            this.imagens              = result.data[0]['galeria'];
                            this.modelG.isprivate     = result.data[0]['isprivate'];
                            this.modelG.password      = result.data[0]['password'];
                            this.t_conteudo           = result.data[0]['t_conteudo'];
                            this.card                 = result.data[0]['card'];
                            //retirar a mascara do telefone
                            if(result.data[0]['tel_contato'] != ""){
                                   var str                = result.data[0]['tel_contato'];
                                   this.contato.telefone  = str.replace(this.word,'');
                              }else{
                                this.contato.telefone=null;
                              }
                            //retirando a máscara do telefone
                            if(result.data[0]['tel_whatsapp']!= ""){
                                var newstr                = result.data[0]['tel_whatsapp']; 
                                this.contato.whatsapp     = newstr.replace(this.word,'');
   
                            }else{
                              this.contato.whatsapp  = null;
                            }
             
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
  showPromptPush(codeNumber) {
    this.navCtrl.push('NotificacaoPushPage',{codeNumber:codeNumber,token:this.token});
   
}

  ShowContato(){
    this.navCtrl.push('ContatoListPage', {contato:this.contato,token:this.token,code_id:this.id_code });
  }
  ShowContato2(){
    this.navCtrl.push('ContatoCodePage', {contato:this.contato,token:this.token,code_id:this.id_code });
  }

  ShowCam(){
    this.navCtrl.push('ImageCodePage',{imagens:this.imagens,token:this.token,code:this.id_code,package_imagens:this.package_imagens,package_name:this.package_name});
    
  }
  ShowDoc(){
    this.navCtrl.push('DocumentoCodePage',{docs:this.docs,token:this.token,code:this.id_code});
    
  }
  ShowVideo(){
    this.navCtrl.push('VideoCodePage',{videos:this.vid_aux,token:this.token,code:this.id_code,package_videos:this.package_videos,package_name:this.package_name});
    
  }
  // "Edição do code,titulo,descrição,link,t_conteudo",
  editCode(){
    if(this.net.ckeckNetwork()){
      this.util.showLoading("Aguarde...");
      this.codeProvider.code_Edit(this.token,this.id_code,this.modelC.name,this.modelG.titulo,this.modelG.descricao,this.model.link,this.meu_link,this.modelG.password,this.modelG.isprivate)
      .subscribe(
            (result: any) =>{
              this.util.loading.dismiss(); 
              if(result.status == 200){  
                this.toast.create({ message: 'Informações foram salvas com sucesso !', position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
             
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
      
     }else{this.navCtrl.setRoot('NotNetworkPage');} 
  }
  change_segmento(item) {
    
    this.model.isLink =item;
    if(this.model.isLink){
    
       this.meu_link ="2";
    }else{
    
      this.meu_link ="1";
    }
  
    
  }
  change_senha(item) {
    
    this.modelG.isprivate =item;
       
  }
  // compartilhar social share
shareSheetShare(code) {
  this.socialSharing.share("Visite meu Code ->", "Share subject", this.card, "https://kscode.com.br/card?code="+code).then(() => {
    console.log("shareSheetShare: Success");
  }).catch(() => {
    console.error("shareSheetShare: failed");
  });

}

}
export class Link{
  link     :  String;
  isLink   : String;
}
export class geral{
  titulo     :  String;
  descricao  : String;
  password   : String;
  isprivate  : Boolean;


}
export class Code{
   name : String;
}