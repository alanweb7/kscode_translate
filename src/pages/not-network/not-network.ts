import { Component } from '@angular/core';
import { IonicPage, NavController,ToastController, NavParams } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
@IonicPage({
  priority : 'off',
  segment  :'NotNetwork/:isOrigem'
})
@Component({
  selector: 'page-not-network',
  templateUrl: 'not-network.html',
})
export class NotNetworkPage {

  isOrigem :any;
  constructor(  public  toast        : ToastController, 
                public net           : NetworkProvider,
                public navCtrl       : NavController, 
                public navParams     : NavParams) {
  }
  ionViewDidLoad() {
    this.isOrigem = Number;
    this.isOrigem = 0;
    this.isOrigem= this.navParams.get('isOrigem');
    console.log('ionViewDidLoad NotNetworkPage');
  }
  check(){
    //VERIFICA SE TEM CONEXÃO COM A INTERNET
                    if(this.net.ckeckNetwork()){

                          if(this.isOrigem == 1){
                              this.navCtrl.setRoot('LoginPage');
                          }else{
                                this.navCtrl.setRoot('HomePage');
                          }
                    
                      
                    }else{
                       this.toast.create({ message: 'Sem conexão com a internet no momento', position: 'botton', duration: 2000 }).present();
                    }
  }

}
