import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '../../../node_modules/@angular/forms';
import { CodeProvider } from './../../providers/code/code';
import { NetworkProvider } from '../../providers/network/network';
import { UtilService } from '../../providers/util/util.service';
/**
 * Generated class for the ContatoAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contato-add',
  templateUrl: 'contato-add.html',
})
export class ContatoAddPage {
  pais                 : any[];
    //validação de formulario
  public cadastroForm : any;
  model               : contato;
  ctt_pais       : String;
  ctt_titulo     : String;
  ctt_conteudo   : String;
  ctt_tipo       : String;
  token          : any;
  word=/[^0-9]+/g;
  id_code          : any;
  tipo           :any[];
  tp:String;
  isMostraNumber  : String;
  sector_id :String;
  tipos2 : any[];
  constructor(
                public navCtrl        : NavController, 
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
                   titulo      : ['', Validators.required],
                   conteudo    : ['', Validators.required],
                   tipo        : ['', Validators.required],
                
                  }); 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContatoAddPage');
    this.sector_id        = "";
    this.id_code          = this.navParams.get('code_id');
    this.token            = this.navParams.get('token');
    this.sector_id        = this.navParams.get('setor_id');
    console.log(this.sector_id);
    this.tp               = this.navParams.get('tipo');
    console.log(this.tp);
    console.log(this.tp);
    this.pais             = [];
    this.tipo             = [];
    this.tipos2           = [];
    this.isMostraNumber   = "";
    this.getPais();
    this.getListTipo();
  
    if(this.sector_id != ""){
        this.getSetor();
        this.util.showLoading("Aguarde...");
    }
    //this.model.tipo="Whatsapp";
    if(this.sector_id == ""){
      this.model.pais       = "Brazil";
      this.model.calling_code ="+55";
      this.ctt_pais="Brazil";
      console.log("entrei aqui",this.tp);
      this.model.tipo=this.tp;
      if(this.model.tipo   =="whatsapp" || this.model.tipo   =="telefone"){
        this.isMostraNumber = "true";
      }else{
        this.isMostraNumber = "";
      }
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
    this.setFilteredItems();
    console.log(this.model.pais,this.model.calling_code);
    
  }
  change_segmento_tipo($event) {
   // $event.replace("+",'');
    this.model.tipo =$event;
    if($event =="whatsapp" || $event =="telefone"){
      this.isMostraNumber = "true";
    }else{
      this.isMostraNumber = "";
    }
  }
  compareFn(e1: String, e2: String): boolean {
    return e1 && e2 ? e1 === e2 : e1 === e2;
  }
  compare(e1: String, e2: String): boolean {
    return e1 && e2 ? e1 === e2 : e1 === e2;
  }
  getSetor(){
    if(this.net.ckeckNetwork()){
        this.codeProvider.contato(this.id_code,this.token,"true","","","","","","get",this.sector_id).subscribe(
          (result: any) =>{    
          this.util.loading.dismiss(); 
                if(result.status == 200){
                      this.model.tipo              = result.code_sector.tipo;
                      this.model.titulo            = result.code_sector.titulo;
                      this.ctt_conteudo            = result.code_sector.conteudo;
                      this.model.pais              = result.code_sector.pais;
                      this.model.calling_code      = result.code_sector.calling_code;
                      this.model.conteudo          = this.ctt_conteudo;
                      this.tp = this.model.tipo;
                      console.log(this.model.tipo,this.model.conteudo);
                      if(this.model.tipo   =="whatsapp" || this.model.tipo   =="telefone"){
                        this.isMostraNumber = "true";
                      }else{
                        this.isMostraNumber = "";
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
            this.util.loading.dismiss(); 
            this.navCtrl.setRoot('NotNetworkPage');
    }
  }
  getListTipo(){
    if(this.net.ckeckNetwork()){
    this.codeProvider.contato(this.id_code,this.token,"list","","","","","","get",this.sector_id).subscribe(
      (result: any) =>{    
      //this.util.loading.dismiss(); 
             this.tipo = result;
             console.log(result);
        } ,(error:any) => {
          this.toast.create({ message:"Não foi possível conectar ao servidor!", position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
         // this.util.loading.dismiss(); 
         // this.navCtrl.setRoot('HomePage');
        });
      }else{
       // this.util.loading.dismiss(); 
        this.navCtrl.setRoot('NotNetworkPage');
    }
}
 create(){ 
  if(this.net.ckeckNetwork()){
    this.util.showLoading("Aguarde...");
          let action;
          if(this.sector_id == ""){
              action ="create";
              if(this.model.pais == "Brazil"){
                  this.model.pais= this.ctt_pais;
              }

          }else{
            action ="update";
          }
          this.codeProvider.contato(this.id_code,this.token,"true",this.model.tipo,this.model.calling_code,this.model.pais,this.model.conteudo,this.model.titulo,action,this.sector_id).subscribe(
            (result: any) =>{    
            this.util.loading.dismiss(); 
                  if(result.status == 200){
                    this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                    this.navCtrl.push('ContatoListPage', {token:this.token,code_id:this.id_code });
                    // this.navCtrl.push('LoginPage');
                  }else if(result.status == 402){
                    this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'alerta'  }).present();
                    this.navCtrl.push('LoginPage');
                  }
                  else if(result.status == 403){
                    this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'alerta'  }).present();
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
 
 filterItems(searchTerm){
  return this.pais.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
  });     

}
setFilteredItems() {
  this.tipos2 = this.filterItems(this.model.pais);
  this.model.calling_code = this.tipos2[0].dial_code;
  console.log(this.tipos2[0]);
}
}
export class contato{
  calling_code : String;
  pais        :  String;
  titulo      : String;
  conteudo    : String;
  setor_id    : String;
  tipo        : String;
 
}
