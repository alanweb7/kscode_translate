import { Component } from '@angular/core';
import { IonicPage,Navbar , NavController, NavParams,AlertController, ToastController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { HistoricoService } from '../../providers/historico/historico.service';
import { Historico } from '../../models/historico.model';
import { ViewChild } from '@angular/core';
@IonicPage({
  priority : 'off',
  segment  : 'Historico/:token',
  defaultHistory:['HomePage'],
  
})
@Component({
  selector: 'page-historico',
  templateUrl: 'historico.html',
})
export class HistoricoPage {
  hist        : Historico[] = [];
  @ViewChild(Navbar) navBar: Navbar;
  token            : any;
  constructor(
    public navCtrl        : NavController, 
    public navParams      : NavParams,
    public alertCtrl      : AlertController,
    private historico     : HistoricoService,
    public toast          : ToastController,
    private socialSharing : SocialSharing

  ) {
   
  }
  ionViewDidLoad() {
    this.token   = String;
    this.token   = "";
    this.token   = this.navParams.get('token');
    //CHAMDA DO BANCO DE DADOS
     this.mostrarStorage();
     this.navBar.backButtonClick = (e:UIEvent)=>{
      this.navCtrl.setRoot('HomePage');
     
     }  
   
  }

// capta o que tem no storage
  mostrarStorage(){
     this.historico.getAll()
     .then((movies:any) => {
         this.hist = movies;
     });
  } 
  pushPage(codeNumber){

    let latitude ;
    let longitude ;
    //console.log();
    
    this.navCtrl.push('DetalheCodePage', {liberado:false,origem:3,
      info: {
        code: codeNumber,
        position:{"latitude": latitude, "longitude": longitude},
        telephone: ""
      }
    });

  }
//chamada alerta de confirmação antes de excluir
 showConfirm(id_serv) {
       const confirm = this.alertCtrl.create({
        title: 'Tem certeza que deseja excluir este item ?',
        message: '',
        buttons: [
          {
            text: 'Cancelar',
            handler: () => {
              //console.log('Disagree clicked');
            }
          },
          {
            text: 'EXCLUIR',
            handler: () => {
              this.removerFavorito(id_serv);
            }
          }
        ]
      });
      confirm.present();
  

}  
removerFavorito(id_serv) {
   //grava o historico
   this.historico.delete(id_serv)
   .then((remove: Boolean) => {
          if(remove){
            this.navCtrl.setRoot(this.navCtrl.getActive().component); //atualiza apagina atual
            this.toast.create({ message: 'Excluído com sucesso !', position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
            
          }else{
            this.toast.create({ message: 'Ocorreu um erro inesperado !', position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
            
          }

    });
  
}
 // compartilhar social share
 shareSheetShare(code,card) {
   console.log("card",card);
  this.socialSharing.share("Visite meu Code ->", "Share subject",card, "https://kscode.com.br/card?code="+code).then(() => {
    console.log("shareSheetShare: Success");
  }).catch(() => {
    console.error("shareSheetShare: failed");
  });

}


}
