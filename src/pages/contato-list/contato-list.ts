import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ToastController, AlertController } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { CodeProvider } from './../../providers/code/code';
import { UtilService } from '../../providers/util/util.service';
import { t } from '@angular/core/src/render3';


@IonicPage()
@Component({
  selector: 'page-contato-list',
  templateUrl: 'contato-list.html',
})
export class ContatoListPage {
  @ViewChild('mySlider') slider: Slides;
  selectedSegment      : string;
  slides               : any; 
  token        : String;
  code_id      : String; 
  facebook     : any[];
  instagram    : any[];
  whatsapp     : any[];
  fone         : any[];
  email        : any[];
  linkedin     : any[];
  site         : any[];  
  selectTipo   : String;         

  constructor( public navCtrl         : NavController, 
               public navParams       : NavParams,
               public alertCtrl       : AlertController,
               private codeProvider   : CodeProvider,
               public  net            : NetworkProvider,
               public toast           : ToastController,
               public util            : UtilService,
               ) {
    this.selectedSegment = '0';
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContatoListPage');
    this.token         = this.navParams.get('token');
    this.code_id       = this.navParams.get('code_id');
    this.selectTipo    = "";
    this.facebook      = [];
    this.instagram     = [];
    this.whatsapp      = [];
    this.fone          = [];
    this.email         = [];
    this.linkedin      = [];
    this.site          = [];   
    this.selectTipo    = "whatsapp";

  
    }
    private ionViewDidEnter() {
          this.util.showLoading("Aguarde...");
      this.getList();
    }
//trocar o slide de acordo com o segment
onSegmentChanged(segmentButton) {
  const selectedIndex = segmentButton.value;
  this.slider.slideTo(selectedIndex);
 }
//trocar a o segment de acordo com o slide
onSlideChanged(slider) {
  const currentSlide = slider.getActiveIndex();
  if(currentSlide == 0){
    this.selectedSegment = '0';
    this.selectTipo = "whatsapp";
  }else if(currentSlide == 1){
      this.selectedSegment = '1';
      this.selectTipo = "telefone";
  }else if(currentSlide == 2){
    this.selectedSegment = '2';
    this.selectTipo = "email";
  }
  else if(currentSlide == 3){
    this.selectedSegment = '3';
    this.selectTipo = "site";
  }
  else if(currentSlide == 4){
    this.selectedSegment = '4';
    this.selectTipo = "facebook";
  }
  else if(currentSlide == 5){
    this.selectedSegment = '5';
    this.selectTipo = "instagram";
  }else if(currentSlide == 6){
    this.selectedSegment = '6';
    this.selectTipo = "linkedin";
  }
  console.log(this.selectTipo);
}
 getList(){
  if(this.net.ckeckNetwork()){
     this.codeProvider.contato(this.code_id,this.token,"true","","","","","","get","").subscribe(
      (result: any) =>{    
      this.util.loading.dismiss(); 
            if(result.status == 200){
                  this.whatsapp  = result.code_sectors.whatsapp;
                  this.facebook  = result.code_sectors.facebook;
                  this.instagram = result.code_sectors.instagram;
                  this.fone      = result.code_sectors.telefone;
                  this.email     = result.code_sectors.email;
                  this.linkedin  = result.code_sectors.linkedin;
                  this.site      = result.code_sectors.site;
                  console.log(this.whatsapp,this.facebook,this.instagram,this.fone);
            }else if(result.status == 402){
              this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'alerta'  }).present();
              this.navCtrl.push('LoginPage');
            }
            else if(result.status == 403){
              this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
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
 newSetor(id){
  this.navCtrl.push('ContatoAddPage', {token:this.token,code_id:this.code_id ,setor_id:id,tipo:this.selectTipo});
 }
  //chamada alerta de confirmação antes de excluir
  showConfirm(id_code,tipo) {
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
           this.deleteSetor(id_code,tipo);
         }
       }
     ]
   });
   confirm.present();
  
  
  } 
 deleteSetor(id,tipo){
      if(this.net.ckeckNetwork()){
        this.codeProvider.contato(this.code_id,this.token,"true","","","","","","delete",id).subscribe(
        (result: any) =>{    
        this.util.loading.dismiss(); 
              if(result.status == 200){
                this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                this.removeItemArray(id,tipo);
              }else if(result.status == 402){
                this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'alerta'  }).present();
                this.navCtrl.push('LoginPage');
              }
              else if(result.status == 403){
                this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
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
 removeItemArray(item,tipo){
  console.log("item para remover",item,tipo);
   
  if(tipo == 0){
     const index = this.whatsapp.indexOf(item);
      this.whatsapp.splice(index, 1);
  }else if(tipo == 1){
    const index = this.fone.indexOf(item);
    this.fone.splice(index, 1);
  }else if(tipo == 2){
    const index = this.email.indexOf(item);
    this.email.splice(index, 1);
  }
  else if(tipo == 3){
    const index = this.site.indexOf(item);
    this.site.splice(index, 1);
  }
  else if(tipo == 4){
    const index = this.facebook.indexOf(item);
    this.facebook.splice(index, 1);
  }
  else if(tipo == 5){
    const index = this.instagram.indexOf(item);
    this.instagram.splice(index, 1);
  }else if(tipo == 6){
    const index = this.linkedin.indexOf(item);
    this.linkedin.splice(index, 1);
  }
}

}
