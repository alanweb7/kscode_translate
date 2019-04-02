import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, ModalController } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';
//import Provider
import { NetworkProvider } from '../../providers/network/network';
import { CodeProvider } from './../../providers/code/code';
import { UtilService } from '../../providers/util/util.service';
import { ViewEnqueteService } from '../../providers/view-enquete/view-enquete.service';
@IonicPage({
  priority : 'off',
  segment  :'EnqueteVotar/:token/:code_id/:ask_id'
})
@Component({
  selector: 'page-enquete-votar',
  templateUrl: 'enquete-votar.html',
})
export class EnqueteVotarPage {
  code_id   : String;
  question  : String;
  option1   : String;
  option2   : String;
  data_enc  : String;
  ask_id    : String;
  automatic : Boolean;
  midias    : any[];
  vote      : Number;
  item      : string;
  img1      : String;
  img2      : String;

  constructor( 
            public navCtrl         : NavController, 
            public navParams       : NavParams,
            private photoViewer    : PhotoViewer,
            public  viewCtrl       : ViewController, 
            private codeProvider   : CodeProvider,
            public toast           : ToastController,
            public  net            : NetworkProvider,
            public modalCtrl       : ModalController,
            public util            : UtilService,
            public view            : ViewEnqueteService
          ) {
  }
//visualizar foto tamnho maior
viewPhoto(img){
  this.photoViewer.show(img);
}
ionViewDidLoad() {
  
    this.util.showLoading("Aguarde...");
    this.code_id          = this.navParams.get('code_id');
    this.ask_id           = this.navParams.get('ask_id');
    console.log('ionViewDidLoad EnqueteVotarPage',this.code_id,this.ask_id);
    this.item=this.ask_id+"-"+this.code_id;
    this.midias           = [];
   
    this.vote = 1;
    this.getEnq();
}
fecharAvaliacao(){
 
 /*  this.view.getById(result.data_user.id)
                                     .then((existe: Number) => {
                                 
                                       if (existe < 0) {} */
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
                this.automatic  = result.automatic;
                this.midias     = result.midias;
                this.img1       = result.midias[0]["img_link"];
                this.img2       = result.midias[1]["img_link"];

              }else if(result.status == 402){
                this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
               // this.navCtrl.push('LoginPage');
                this.viewCtrl.dismiss();
              }
              else if(result.status == 403){
                this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
               // this.navCtrl.push('HomePage');
                this.viewCtrl.dismiss();
              }
              else if(result.status == 404){
                this.viewCtrl.dismiss();
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
VotarEnq(){
  if(this.net.ckeckNetwork()){
    console.log("voto",this.vote);
    this.codeProvider.votarEnq(this.vote,this.ask_id,this.code_id)
    .subscribe(
          (result: any) =>{
            this.util.loading.dismiss(); 
            if(result.status == 200){
              this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
              
            /*   this.nativeStorage.set(this.item,1)
              .then(
                  () => console.log('Stored item!'),
                  error => console.log('Error storing item', error)
              ); */
              let myModal =this.modalCtrl.create('EnqueteGraphPage',{question:this.question,option1:result.results.option1,option2:result.results.option2,code_id:this.code_id,ask_id:this.ask_id});
              myModal.present();
              this.viewCtrl.dismiss();

            }else if(result.status == 402){
              this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
              //this.navCtrl.push('LoginPage');
              this.viewCtrl.dismiss();
            }
            else if(result.status == 403){
              this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
              //this.navCtrl.push('HomePage');
              this.viewCtrl.dismiss();
            }
          },(error:any) => {
            this.toast.create({ message:"Não foi possível conectar ao servidor!", position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
              this.util.loading.dismiss(); 
             
          });

    }else{
      this.util.loading.dismiss();
      this.navCtrl.setRoot('NotNetworkPage');
     }
}
}
