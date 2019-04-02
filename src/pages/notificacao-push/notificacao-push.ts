import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { CodeProvider } from './../../providers/code/code';
import { FormBuilder, Validators } from '@angular/forms';
import { NetworkProvider } from '../../providers/network/network';
import { UtilService } from '../../providers/util/util.service';
@IonicPage({
  priority : 'off',
  segment  : 'NotificacaoPush/:token/:codeNumber',
  defaultHistory:['HomePage']
})
@Component({
  selector: 'page-notificacao-push',
  templateUrl: 'notificacao-push.html',
})
export class NotificacaoPushPage {
  model            : Push;
  messageTitulo     = "";
  messageMessagem   = "";
  errorTitulo       = false;
  errorMessagem     = false;
  token            : any;
  code             : any;
  //validação de formulario
  public pushForm : any;
  constructor(
              public navCtrl          : NavController,
              public  viewCtrl        : ViewController,
              public navParams        : NavParams,
              formBuilder             : FormBuilder,
              public toast            : ToastController,
              public  net             : NetworkProvider,
              private codeProvider    : CodeProvider,
              public util             : UtilService
            ) {
                //instanica do model login
              this.model = new Push();
              //instancia do formulario builder para validar os campos
              this.pushForm = formBuilder.group({
                titulo       : ['', Validators.required],
                mensagem     : ['', Validators.required],
              });
  }

  ionViewDidLoad() {
    this.token   = String;
    this.token   = "";
    this.token   = this.navParams.get('token');
    this.code   = String;
    this.code   = "";
    this.code   = this.navParams.get('codeNumber');
  }
  createPusg(){
           
    let { titulo, mensagem} = this.pushForm.controls;
    if (!this.pushForm.valid) {
              if (!titulo.valid) {
                this.errorTitulo = true;
                this.messageTitulo ="Este campo é obrigatório";
              } else {
                this.messageTitulo = "";
              }
              if (!mensagem.valid) {
                this.errorMessagem = true;
                this.messageMessagem ="Este campo é obrigatório";
              } else {
                this.messageMessagem = "";
              }
    }
        else {
          if(this.net.ckeckNetwork()){
            this.util.showLoading("Aguarde..");
            this.codeProvider.create_push(this.code,this.model.titulo,this.model.mensagem,this.token)
            .subscribe(
                  (result: any) =>{
                    this.util.loading.dismiss(); 
                    if(result.status == 200){
                      this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                      this.viewCtrl.dismiss();
                    } else if(result.status == 402){
                      this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                      this.navCtrl.push('LoginPage');
        
                    }
                  },(error:any) => {
                    this.toast.create({ message:"Não foi possível conectar ao servidor!", position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                      this.util.loading.dismiss(); 
                      this.navCtrl.setRoot('HomePage');
                  });
          }else{
            this.navCtrl.setRoot('NotNetworkPage');
           } 
      }
  }
  fecharAvaliacao(){

    this.viewCtrl.dismiss();
 }
}
export class Push{
  titulo  : String;
  mensagem : String;
}