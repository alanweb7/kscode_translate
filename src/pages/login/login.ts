import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams , MenuController, ModalController,Events, ToastController, LoadingController} from 'ionic-angular';
import { BrowserTab } from '@ionic-native/browser-tab';

//import Provider
import { ClienteProvider } from './../../providers/cliente/cliente';
import { UsuarioService } from '../../providers/movie/usuario.service';
import { NetworkProvider } from '../../providers/network/network';
import { UtilService } from '../../providers/util/util.service';
//Import Model
import { Usuario } from './../../models/usuario.model';
@IonicPage({
  priority : 'off',
  segment  : 'Login',
  defaultHistory:['HomePage']
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  model            : Login;
  //validação de formulario
  public loginForm : any;
  messageEmail     = "";
  messagePassword  = "";
  errorEmail       = false;
  errorPassword    = false;
  erro             = false;
  //tira a máscara
  word             =/[^0-9]+/g;
  public type      = 'password';
  public showPass  = false;
 
  data = {
     id_serv     :Number,
     name        :String,
     sobrenome   :String,
     email       :String,
     photo       :String,
     tp_pessoa   :String,
     cpf         :String,
     cnpj        :String,
     cep         :String,
     endereco    :String,
     numero      :String,
     complemento :String,
     bairro      :String,
     cidade      :String,
     estado      :String,
     telefone    :String,
     celular     :String,
     usuario     :String,
     logado      :String,
     token       :String
}
  constructor(public navCtrl        : NavController, 
            public navParams        : NavParams,
            public menu             : MenuController,
            public  net             : NetworkProvider,
            private cli_Provider    : ClienteProvider ,
            private browserTab      : BrowserTab,
            private events          : Events,
            public toast            : ToastController,
            public modalCtrl        : ModalController,
            private usuario         : UsuarioService,
            public loadingCtrl      : LoadingController,
            public  util            : UtilService,
            formBuilder             : FormBuilder) {
            //instanica do model login
            this.model = new Login();
            //instancia do formulario builder para validar os campos
            this.loginForm = formBuilder.group({
              email    : ['', Validators.required],
              password : ['', Validators.required]});
  }

  ionViewDidLoad() {
    this.data.logado = String;
    //inicia o banco de dados local
    this.usuario.getAll().then((movies:any) => {
      if(movies.length == 1){
        this.data.name     = movies[0].name;
        this.data.sobrenome= movies[0].sobrenome;
        this.data.email    = movies[0].email;
        this.data.token    = movies[0].token;
        this.data.logado   = movies[0].logado;
        this.data.id_serv  = movies[0].id_serv;
        this.data.photo    = movies[0].photo;
        this.data.usuario  = movies[0].usuario;
        this.events.publish('dados',this.data);
   }else{
      
        this.events.publish('dados',this.data);
   }
    })
  }
  ionViewDidEnter() {
    //disabilita menu lateral
    this.menu.enable(false);
  }
 
  login() {
    
    let { email, password } = this.loginForm.controls;
    
    if (!this.loginForm.valid) {
              if (!email.valid) {
                this.errorEmail = true;
                this.messageEmail = "Ops! Email inválido";
              } else {
                this.messageEmail = "";
              }
          
              if (!password.valid) {
                this.errorPassword = true;
                this.messagePassword ="A senha é obrigatória!"
              } else {
                this.messagePassword = "";
              }
    }
    else {
       if(this.net.ckeckNetwork()){
                  let contextCliente: Usuario;
                  this.util.showLoading("Aguarde...");
                  this.cli_Provider.login(this.model.email,this.model.password)
                  .subscribe(
                        (result: any) =>{
                        
                          if(result.code == 403.001){
                                 this.util.loading.dismiss(); 
                                 this.toast.create({ message: result.message, position: 'top', duration: 10000,showCloseButton: true,closeButtonText: 'Ok!',cssClass: 'error' }).present();
                          
                            }else if(result.code == 403.002){
                                 this.util.loading.dismiss(); 
                                 this.toast.create({ message: result.message, position: 'top', duration: 10000,showCloseButton: true,closeButtonText: 'Ok!',cssClass: 'error' }).present();                              
                            }else{
                                     this.util.loading.dismiss(); 
                                     this.usuario.getById(result.data_user.id)
                                     .then((existe: Number) => {
                                 
                                       if (existe < 0) {
                                         contextCliente = new Usuario(result.data_user.id,result.data_user.first_name,result.data_user.last_name,result.user_email,result.data_user.avatar,"","","","","","","","","","","","","","1",result.token);
                                         this.usuario.create(contextCliente)
                                         .then((data: any) => {
                                               this.data.name     = result.data_user.first_name;
                                               this.data.sobrenome = result.data_user.last_name;
                                               this.data.email    = result.user_email;
                                               this.data.token    = result.token;
                                               this.data.usuario  = result.user_nicename;
                                               this.data.id_serv  = result.data_user.id;
                                               this.data.photo    = result.data_user.avatar;
                                               this.events.publish('dados',this.data);
                                               this.navCtrl.setRoot('HomePage'); 
                                               
                                         });
                                         
                                       }else{
                                         
                                         this.usuario.update(result.data_user.first_name,result.data_user.last_name,result.user_email,result.data_user.avatar,"","","1",result.token,result.data_user.id)
                                         .then((data: any) => {
                                                this.data.name      = result.data_user.first_name;
                                                this.data.sobrenome = result.data_user.last_name;
                                                this.data.email     = result.user_email;
                                                this.data.token     = result.token;
                                                this.data.usuario   = result.user_nicename;
                                                this.data.id_serv   = result.data_user.id;
                                                this.data.photo     = result.data_user.avatar;
                                                this.events.publish('dados',this.data);
                                                this.navCtrl.setRoot('HomePage');  
                                                
                                         });
                               
                                     } 
                                  
                                     
                                    }); 

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
recuperarsenhaModal() {
  let myModal = this.modalCtrl.create('RecuperasenhaPage');
  myModal.present();
}

voltar(){
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
  ionViewWillLeave() {
    // to enable menu.
    this.menu.enable(true);
   }
//adquira seu code  
shopcode() {
    var url = 'https://kscode.com.br/pacotes/';
    this.browserTab.isAvailable()
    .then(isAvailable => {
      if (isAvailable) {
        this.browserTab.openUrl(url);
      } 
    }); 
  }
}
export class Login{
  email     :  String;
  password  : String;
  fcm_token : String;
}