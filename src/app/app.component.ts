import { Component, ViewChild } from '@angular/core';
import { Events,Nav, Platform, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UsuarioService } from '../providers/movie/usuario.service';
import {Deeplinks} from "@ionic-native/deeplinks";
import { NativeStorage } from '@ionic-native/native-storage';
//translate servide
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'HomePage';
    mostra     : Boolean;
    id_serv     :Number;
    name        :String;
    sobrenome   :String;
    email       :String;
    photo       :String;
    tp_pessoa   :String;
    cpf         :String;
    cnpj        :String;
    cep         :String;
    endereco    :String;
    numero      :String;
    complemento :String;
    bairro      :String;
    cidade      :String;
    estado      :String;
    telefone    :String;
    celular     :String;
    usuario     :String;
    logado      :String;
    token       :String;
  
  pages      : Array<{ color:string,icon: string, title: string, component: any}>;
  constructor(private usuarioService : UsuarioService,
              public platform        : Platform,
              private event          : Events,
              public statusBar       : StatusBar,
              public splashScreen    : SplashScreen,
              public modalCtrl       : ModalController,
              deeplinks              : Deeplinks,
              private nativeStorage: NativeStorage,
              private translateService: TranslateService,
              ) {

      //translate service
        translateService.setDefaultLang('en');
        platform.ready().then(() => {
        statusBar.styleDefault();
        splashScreen.hide();
        });

      //native functions
    this.initializeApp();
    deeplinks.routeWithNavController(this.nav, {
      '/card': {'card':'DetalheCodePage',},
      '/about-us': {'card':'DetalheCodePage'},
    }).subscribe((match) => {
      var code = match.$link.queryString.substring(5,50); 
      if(code){
          this.redirectPush(code);
      }
      console.log('Successfully routed',match.$link.queryString.substring(4,50));
      console.log('Successfully routed',match.$link.queryString);
    }, (nomatch) => {
      console.log('Unmatched Route', nomatch);
    });
    //capturar do evento da home
    this.event.subscribe("dados", (data:any) => { 
          if(data.logado == "1"){
              this.name    = data.name;
              this.token   = data.token;
              this.email   = data.email;
              this.usuario = data.usuario;
              this.id_serv = data.id_serv;
              this.sobrenome = data.sobrenome;
              this.photo     = data.photo;
              this.mostra  = true;
                     
         }else{
               this.mostra = false;
               this.photo  = "";
               this.name    = "";
               this.token   = undefined;
               this.email   = "";
               this.usuario = "";
               this.id_serv = 0;
               this.sobrenome = "";
         }
       
    });
    // aqui eu seto o meu menu
    this.pages = [
      { color:'primary',  icon: 'home',               title: 'Home',                component: 'HomePage'},
      { color:'primary',  icon: 'contact',            title: 'Meus Codes',          component: 'MeusCodesPage' },
      { color:'primary',  icon: 'star',               title: 'Meus Favoritos',      component: 'HistoricoPage'},
      { color:'primary',  icon: 'search',             title: 'Pesquisa',            component: 'PesquisaPage' },
    // { color:'primary',  icon: 'search',             title: 'Pesquisa',            component: 'EnqueteVotarPage' },
      /*  { color:'primary',  icon: 'search',             title: 'Enquete',             component: 'EnqueteVotarPage' } 
      */
    ];

  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.sobrenome= "";
    this.photo = "";
    this.email = "";
   
  
  }
  
// redirect push enter
redirectPush(notificationCode){
   this.nav.push('DetalheCodePage', {liberado :false,
    info: {
      code: notificationCode,
      position:{"latitude": "", "longitude": ""},
      telephone:""
    }
  
  });
 }
  openPage(page) {
    if(page.title == 'Meus Codes'){
          if(this.token == undefined){
            this.nav.push('LoginPage');
          }else{
            this.nav.push(page.component,{token:this.token});
          }
    }else if(page.title == 'Home'){
      this.nav.setRoot(page.component,{token:this.token});
    }
    else{
           this.nav.push(page.component,{token:this.token});
    }
  
  }
 
  minhaConta(){
    console.log("token",this.token);
    if(this.token == undefined){
      this.nav.push('LoginPage');
    }else{
        let myModal =this.modalCtrl.create('MinhaContaPage',{token:this.token});
        myModal.present();
    }
    
  }
  login(){
    this.nav.setRoot('LoginPage');
  }
   //sair eu atualizo os dados
   logout(){
    this.usuarioService.update(this.name,this.sobrenome,this.email,"","","","0",this.token,this.id_serv)
    .then((data: any) => {
            if(data){
              console.log("uusuario atualizado");
            }
    });
    this.nav.push('LoginPage');
 }
}
