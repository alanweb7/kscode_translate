import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController, ModalController, AlertController } from 'ionic-angular';
//import Provider
import { NetworkProvider } from '../../providers/network/network';
import { CodeProvider } from './../../providers/code/code';
import { UtilService } from '../../providers/util/util.service';


@IonicPage()
@Component({
  selector: 'page-enquete-list',
  templateUrl: 'enquete-list.html',
})
export class EnqueteListPage {
  token            : any;
  code_id             : any;
  minhas_enq       : any[];
  searchTerm       : string = '';
  enq_serve        : any[];
  ask_id           :String;
  constructor(
               public navCtrl        : NavController,
               public navParams      : NavParams ,
               private codeProvider  : CodeProvider,
               public toast          : ToastController,
               public  net           : NetworkProvider,
               public util           : UtilService,
               public viewCtrl       : ViewController,
               public modalCtrl      : ModalController,
               public alertCtrl      : AlertController,
               
             ) 
  {
  }

  ionViewDidLoad() {
    this.token            = this.navParams.get('token');
    this.code_id             = this.navParams.get('code');
    //this.ask_id           = this.navParams.get('ask_id');
    this.enq_serve        = [];
    this.minhas_enq       = [];
    console.log('ionViewDidLoad EnqueteListPage',this.ask_id);
  
  }
  //fazer o start do slide
  private ionViewDidEnter() {
     if(this.net.ckeckNetwork()){
        this.util.showLoading("Aguarde...");
        this.getAllEnq(this.token,this.code_id);
        this.setFilteredItems();
      }else{
      
        this.util.loading.dismiss();
        this.navCtrl.setRoot('NotNetworkPage');
      } 
   }
  setFilteredItems() {
    if(this.searchTerm == ""){
       this.minhas_enq=[];
       this.onCancel();
    }else{
     this.minhas_enq = this.filterItems(this.searchTerm);
    }
  
 
 }
 filterItems(searchTerm){
  return this.minhas_enq.filter((item) => {
      return item.question.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
  });     

}
 onCancel(){
  return this.minhas_enq =this.enq_serve;

}
 viewEnq(ask_id){
  let myModal =this.modalCtrl.create('EnqueteVotarPage',{ask_id:ask_id,code_id:this.code_id});
  myModal.present();
 }
  addEnquete(ask_id){
   // let myModal =this.modalCtrl.create('EnqueteAddPage', {token:this.token,_icode_id:this.code,ask_id:ask_id,ask_active:this.ask_id });
    //myModal.present();
    this.navCtrl.push('EnqueteAddPage', {token:this.token,code:this.code_id,ask_id:ask_id,ask_active:this.ask_id });
  }
  getAllEnq(token,code_id){
    
    if(this.net.ckeckNetwork()){
    this.codeProvider.getEnqALL(token,code_id)
    .subscribe(
          (result: any) =>{
              this.util.loading.dismiss(); 
              if(result.status == 200){
               
                this.minhas_enq = result.data;
                this.enq_serve  = result.data;
                this.ask_id           = result.ask_active;
                console.log("oi",this.ask_id);
              }else if(result.status == 402){
                this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                this.navCtrl.push('LoginPage');
              }
              else if(result.status == 403){
                this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                this.navCtrl.push('HomePage');
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
   //chamada alerta de confirmação antes de excluir
 showConfirm(ask_id) {
  const confirm = this.alertCtrl.create({
   title: 'Tem certeza que deseja excluir este item ?',
   message: '',
   buttons: [
     {
       text: 'Cancelar',
       handler: () => {
         console.log('Disagree clicked');
       }
     },
     {
       text: 'EXCLUIR',
       handler: () => {
         this.deleteEnq(ask_id);
       }
     }
   ]
 });
 confirm.present();


} 
  deleteEnq(ask_id){
    this.util.showLoading("Aguarde...");
      this.codeProvider.deleteEnq(this.code_id,ask_id,this.token).subscribe(
        (result: any) =>{
            this.util.loading.dismiss(); 
           
              if(result.status == 200){
                 this.removeItemArray(ask_id);
                console.log("oi",this.ask_id);
                this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
               
              }else if(result.status == 402){
                this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                this.navCtrl.push('LoginPage');
              }
              else if(result.status == 403){
                this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                this.navCtrl.push('HomePage');
              }
      
            } ,(error:any) => {
              this.toast.create({ message:"Não foi possível conectar ao servidor!", position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                this.util.loading.dismiss(); 
               
            });
  }
  removeItemArray(item){
    console.log("item para remover",item);
    const index = this.minhas_enq.indexOf(item);
    this.minhas_enq.splice(index, 1);
    console.log( this.minhas_enq );
  }
}
