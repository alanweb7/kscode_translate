import { Component } from '@angular/core';
import { IonicPage,Navbar, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
//import provider
import { ViewChild } from '@angular/core';
import { CodeProvider } from './../../providers/code/code';
import { UtilService } from '../../providers/util/util.service';
@IonicPage({
  priority : 'off',
  segment  : 'Pesquisa',
  defaultHistory:['HomePage']
})
@Component({
  selector: 'page-pesquisa',
  templateUrl: 'pesquisa.html',
})
export class PesquisaPage {
public users : any[];
page         : number;
public links : any = [];
@ViewChild(Navbar) navBar: Navbar;
  constructor(
    public navCtrl        : NavController, 
    public navParams      : NavParams,
    private codeProvider  : CodeProvider,
    public loadingCtrl    : LoadingController,
    public util           : UtilService,
    public toast          : ToastController,
  ) {
  }

  ionViewDidLoad() {
    this.util.showLoading("Aguarde..");
    this.navBar.backButtonClick = (e:UIEvent)=>{
      this.navCtrl.setRoot('HomePage');
    }  
  }
  ionViewDidEnter() {
   
    this.page = this.navParams.get('info');
    this.getAllinks(this.page);
  }

getAllinks(page: any) {
  this.codeProvider.getLinks(page)
  .subscribe(
    (result: any) =>{
        var user = result.data[0]; 
        this.util.loading.dismiss(); 
        this.links = user;
  
    })
     ,(error:any) => {
      this.toast.create({ message:"Não foi possível conectar ao servidor!", position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
      this.util.loading.dismiss(); 
      this.navCtrl.setRoot('HomePage');
    };
}

}
