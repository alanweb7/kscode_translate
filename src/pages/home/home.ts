import { Component } from '@angular/core';
import { NavController,IonicPage, NavParams, Platform, LoadingController,Events, AlertController } from 'ionic-angular';
//Import Native
import { OneSignal } from '@ionic-native/onesignal'; 
import { Deeplinks } from '@ionic-native/deeplinks';
import { Geolocation } from '@ionic-native/geolocation';
import { SocialSharing } from '@ionic-native/social-sharing';
import { BrowserTab } from '@ionic-native/browser-tab';
//import Provider
import { CodeProvider } from '../../providers/code/code';
import { NetworkProvider } from '../../providers/network/network';
import { UsuarioService } from '../../providers/movie/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { Keyboard } from '@ionic-native/keyboard';
@IonicPage({
  priority : 'high'
})@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  codeNumber         : any;
  endLat             : any;
  endLong            : any;
  myfone             : any;
  movies             : Usuario[] = [];
  token              : any;
  id                 : any ; 
  footerIsHidden     : Boolean = true;
  public myGlobalVar : string;
  data = {
    id_serv     :Number,
    name        :String,
    sobrenome   :String,
    email       :String,
    photo       :String,
    logado      :String,
    token       :String,
    usuario     :String
}
  constructor(
    public loadingCtrl     : LoadingController,
    public navCtrl         : NavController,
    public navParams       : NavParams,
    private global         : CodeProvider,
    private geo            : Geolocation,
    private platform       : Platform,
    private events         : Events,
    private socialSharing  : SocialSharing,
    private browserTab     : BrowserTab,
    private oneSignal      : OneSignal, 
    public alertCtrl       : AlertController,
    public  net            : NetworkProvider,
    private deeplinks      : Deeplinks,
    private usuario        : UsuarioService,
    private keyboard       : Keyboard
    
  ) {
     
     this.oneSignalApp();
  
    }
    ionViewDidLoad(){
 
      if(this.net.ckeckNetwork()){
        //CHAMDA DO BANCO DE DADOS
                  this.usuario.getAll()
                      .then((movies:any) => {
                        if(movies.length == 1){
                              this.data.name     = movies[0].name;
                              this.data.sobrenome= movies[0].sobrenome;
                              this.data.email    = movies[0].email;
                              this.data.token    = movies[0].token;
                              this.token         = movies[0].token;
                              this.data.logado   = movies[0].logado;
                              this.data.id_serv  = movies[0].id_serv;
                              this.data.photo    = movies[0].photo;
                              this.data.usuario  = movies[0].usuario;
                              this.events.publish('dados',this.data);
                         }
                         this.pushGeoinfo();
          })
      }else{
                           
       
        this.navCtrl.setRoot('NotNetworkPage');
             
      }
      this.keyboard.onKeyboardShow().subscribe(() => {
          this.footerIsHidden= false;
      });
      this.keyboard.onKeyboardHide().subscribe(() => {
          this.footerIsHidden= true;
      });
    }  
  
  pushPage(){

      this.geo.getCurrentPosition().then(res => {
        this.endLat = res.coords.latitude;
        this.endLong = res.coords.longitude;
      }).catch(() => {})
     let latitude = this.endLat;
    let longitude = this.endLong;
    this.navCtrl.push('DetalheCodePage', {liberado :false,origem:1,token:this.token,
      info: {
        code: this.codeNumber,
        position:{"latitude": latitude, "longitude": longitude},
        telephone: this.global.myGlobalVar
      }
    });

  }

pushGeoinfo(){
  this.platform.ready().then(() => {

    this.geo.getCurrentPosition().then(res => {
       this.endLat = res.coords.latitude;
       this.endLong = res.coords.longitude;
      // console.log(this.endLat );
      
    }).catch(() => {
      
      // console.log('Erro ao pegar Localização');
    })         
    });
} 
pushPageCode(){
  this.geo.getCurrentPosition().then(res => {
    this.endLat = res.coords.latitude;
    this.endLong = res.coords.longitude;
  }).catch(() => {})
 
  let latitude = this.endLat;
  let longitude = this.endLong;

  this.navCtrl.push('DetalheCodePage', {liberado :false,
    info: {
      code: 'KSCODE',
      position:{"latitude": latitude, "longitude": longitude},
      telephone: this.global.myGlobalVar
    }
  });
}

pushPagePesquisa(){
  this.navCtrl.push('PesquisaPage', {

  });
}

// compartilhar social share
shareSheetShare() {
  this.socialSharing.share("KSCODE - Tudo se conecta aqui! ->", "Share subject", "", "https://play.google.com/store/apps/details?id=com.kcode360.kcode").then(() => {
  
  }).catch(() => {});
}

shopcode() {
  var url = 'https://kscode.com.br/pacotes/';
   this.browserTab.isAvailable()
    .then(isAvailable => {
      if (isAvailable) {
        this.browserTab.openUrl(url);
      } 
    });
}
// push notification onesignal
 oneSignalApp(){
  this.oneSignal.startInit('d9687a3a-3df5-4565-b183-653e84ed8207', '8700496258');
  this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
  this.oneSignal.handleNotificationReceived().subscribe(() => {});
  this.oneSignal.handleNotificationOpened().subscribe( notification => {
    var notificationData       = notification.notification.payload;
    var notificationAdditional = notificationData.additionalData;
    var notificationCode       = notificationAdditional.code;
    const confirm              = this.alertCtrl.create({
      title: notification.notification.payload.title,
      message: notification.notification.payload.body,
      buttons: [
        {
          text: 'Fechar',
          handler: () => {
           
          }
        },
        {
          text: 'Ir para Code',
          handler: () => {
            this.redirectPush(notificationCode);
          }
        }
      ]
    });
    confirm.present();
  });
  
  this.oneSignal.endInit();
} 

// redirect push enter
redirectPush(notificationCode){
  this.geo.getCurrentPosition().then(res => {
    this.endLat  = res.coords.latitude;
    this.endLong = res.coords.longitude;
  }).catch(() => {})
  let latitude   = this.endLat;
  let longitude  = this.endLong;
  this.navCtrl.push('DetalheCodePage', {liberado :false,
    info: {
      code: notificationCode,
      position:{"latitude": latitude, "longitude": longitude},
      telephone: this.global.myGlobalVar
    }
  
  });
 }

// redirect links
openDeeplinks(){
  this.deeplinks.routeWithNavController(this.navCtrl, {
    '/card': {'card':'DetalheCodePage',},
    '/about-us': {'card':'DetalheCodePage'},
  }).subscribe((match) => {
    var code = match.$link.queryString.substring(5,50); 
    if(code){
        this.redirectPush(code);
    }
  
  }, (nomatch) => {});
  
}

}