import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { CodeProvider } from './../../providers/code/code';
import { FormBuilder, Validators } from '@angular/forms';
import { NetworkProvider } from '../../providers/network/network';
import { UtilService } from '../../providers/util/util.service';
import { BrowserTab } from '@ionic-native/browser-tab';
@IonicPage({
  priority : 'off',
  segment  : 'CodeSenha/:info/:id_code/:link/:origem/:token',
  defaultHistory:['HomePage'],
  
})
@Component({
  selector: 'page-code-senha',
  templateUrl: 'code-senha.html',
})
export class CodeSenhaPage {
  model            : Login;
  errorPassword    = false;
  messagePassword  = "";
  id_code          : Number;
  info             : String;
  link             : String;
  token            : String;
  public type      = 'password';
  public showPass  = false;
  origem           :Number;
  //validação de formulario
  public loginForm : any;
  constructor(
          public navCtrl        : NavController,
           public navParams     : NavParams     ,
           private codeProvider : CodeProvider,
           formBuilder          : FormBuilder,
           public  util         : UtilService,
           public toast         : ToastController,
           public  net          : NetworkProvider,
           public viewCtrl      : ViewController,
           private browserTab   : BrowserTab,
          ) {
           //instanica do model login
           this.model = new Login();
           //instancia do formulario builder para validar os campos
           this.loginForm = formBuilder.group({
          
             password : ['', Validators.required]});
  }

  ionViewDidLoad() {
    this.id_code = this.navParams.get('id_code');
    this.info    = this.navParams.get('info');
    this.link    = this.navParams.get('link');
    this.token   = this.navParams.get('token');
    this.origem  = this.navParams.get('origem');
    
  }
  ionViewWillUnload() {
    this.navCtrl.setRoot('HomePage');
  } 
  showPassword() {
    this.showPass = !this.showPass;
  
    if(this.showPass){
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }
  login() {
    
    let {  password } = this.loginForm.controls;
    
    if (!this.loginForm.valid) {
              if (!password.valid) {
                this.errorPassword = true;
                this.messagePassword ="Este campo é obrigatório!"
              } else {
                this.messagePassword = "";
              }
    }
    else {

        this.util.showLoading("Enviando..");
          if(this.net.ckeckNetwork()){
            
                this.codeProvider.getCodePassword(this.model.password,this.id_code) 
                 .subscribe(
                    (result: any) =>{    
                      this.util.loading.dismiss(); 
                      if(result.status == 200){
                        if(this.link == null){
                          this.toast.create({ message: result.messagem, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                          this.navCtrl.push('DetalheCodePage', {
                           liberado:true, info: this.info
                             
                          });
                        }else{
                          this.toast.create({ message: result.messagem, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                          this.navCtrl.push('DetalheCodePage', {
                           liberado:true, info: this.info
                          });
                          this.viewCtrl.dismiss();
                        }
                       
                      }
                      else if(result.status == 403){
                        this.toast.create({ message:result.messagem, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                        
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
  }
  voltar(){
    if(this.origem == 1){
      this.navCtrl.setRoot('HomePage');
    }else if(this.origem == 2){
      this.navCtrl.setRoot('MeusCodesPage',{token:this.token});
    }else if(this.origem == 3){
      this.navCtrl.setRoot('HistoricoPage',{token:this.token});
    }else{
      this.navCtrl.setRoot('HomePage');
    }
  
    
  }
  openWithInAppBrowser(url){
    this.browserTab.isAvailable()
    .then(isAvailable => {
      if (isAvailable) {
        this.browserTab.openUrl(url);
      } 
    });
  }

}
export class Login{
  password  : String;
}