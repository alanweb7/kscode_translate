import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '../../../node_modules/@angular/forms';
import { CodeProvider } from './../../providers/code/code';
import { NetworkProvider } from '../../providers/network/network';
import { UtilService } from '../../providers/util/util.service';
@IonicPage({
  priority : 'off',
  segment  : 'ContatoCode/:contato/:code/:token',
  defaultHistory:['MenuCodePage']
})
@Component({
  selector: 'page-contato-code',
  templateUrl: 'contato-code.html',
})
export class ContatoCodePage {
  model          : contato;
  ctt_pais       : String;
  ctt_whatsapp   : String;
  ctt_telefone   : String;
  ctt_email      : String;
  ctt_site       : String;
  ctt_facebook   : String;
  ctt_instagram  : String;
  ctt_linkedin   : String;
  token          : any;
  word=/[^0-9]+/g;
  id_code          : any;
  contato :any;
  pais           : any[];
  //validação de formulario
  public cadastroForm : any;
  constructor(
              public navCtrl         : NavController, 
               public navParams      : NavParams, 
               formBuilder           : FormBuilder,
               private codeProvider  : CodeProvider,
               public  net           : NetworkProvider,
               public loadingCtrl    : LoadingController,
               public toast          : ToastController,
               public util           : UtilService
              ) {
    this.model = new contato();
      this.cadastroForm = formBuilder.group({
       pais        : ['', Validators.required],
       whatsapp    : ['', Validators.required],
       telefone    : ['', Validators.required],
       email       : ['', Validators.required],
       site        : ['', Validators.required],
       facebook    : ['', Validators.required],
       instagram   : ['', Validators.required],
       linkedin    : ['', Validators.required],

     }); 
  }
  contato_Edit(){
    if(this.net.ckeckNetwork()){
      this.util.showLoading("Aguarde...");
      this.codeProvider.contato_Edit(this.id_code,this.token,this.model.pais,this.model.whatsapp,this.model.telefone,this.model.email,this.model.site,this.model.facebook,this.model.instagram,this.model.linkedin)
      .subscribe(
            (result: any) =>{
              this.util.loading.dismiss(); 
              if(result.status == 200){
               this.toast.create({ message: 'Informações atualizadas com sucesso !', position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
              }
            } ,(error:any) => {
              this.toast.create({ message: 'Ocorreu um erro inesperado !', position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
           
          });
    
      }else{
            this.util.loading.dismiss(); 
            this.navCtrl.setRoot('NotNetworkPage');
      }

  
}
 

  ionViewDidLoad() {
      this.ctt_pais              = "";
      this.ctt_pais              = "";
      this.ctt_whatsapp          = "";
      this.ctt_telefone          = "";
      this.ctt_email             = "";
      this.ctt_site              = "";
      this.ctt_facebook          = "";
      this.ctt_instagram         = "";
      this.ctt_linkedin          = "";
      this.contato          = this.navParams.get('contato');
      this.id_code          = this.navParams.get('code');
      this.token            = this.navParams.get('token');
      this.ctt_whatsapp     = this.contato.whatsapp;
      this.ctt_telefone     = this.contato.telefone;
      this.ctt_email        = this.contato.email;
      this.ctt_site         = this.contato.website;
      this.ctt_facebook     = this.contato.facebook;
      this.ctt_instagram    = this.contato.instagram;
      this.ctt_linkedin     = this.contato.linkedin;
      this.ctt_pais         = this.contato.pais;
      console.log("pais",this.contato.pais);
     
      this.model.pais       = "";
      this.model.email      = "";
      this.model.site       = "";
      this.model.facebook   = "";
      this.model.instagram  = "";
      this.model.linkedin   = "";
    
      if(this.ctt_whatsapp ==  null){
          this.model.whatsapp = "";
      }else{
        this.model.whatsapp   = this.ctt_whatsapp;
      }
      if(this.ctt_telefone ==  null){
        this.model.telefone   = ""
      }else{
        this.model.telefone   = this.ctt_telefone;
      }
     
      this.model.email      = this.ctt_email;
      this.model.site       = this.ctt_site;
      this.model.facebook   = this.ctt_facebook;
      this.model.instagram  = this.ctt_instagram;
      this.model.linkedin   = this.ctt_linkedin;
      this.getPais();
      if(this.contato.pais == ""){
        this.model.pais       = "Brazil";
        console.log("entrei aqui");
      }else{
        this.model.pais       = this.ctt_pais;
      }
  }
  getPais(){
    if(this.net.ckeckNetwork()){
    this.util.getPaisALL().subscribe((result: any) =>{  
      this.pais = result.data;
   
      } ,(error:any) => {});
    }
  }
  change_segmento($event) {
    $event.replace("+",'');
    this.model.pais =$event;
  }
  compareFn(e1: String, e2: String): boolean {
    return e1 && e2 ? e1 === e2 : e1 === e2;
  }

}
export class contato{
  pais        :  String;
  whatsapp    : String;
  telefone    : String;
  email       : String;
  site        : String;
  facebook    :  String;
  instagram   : String;
  linkedin    : String;
}
