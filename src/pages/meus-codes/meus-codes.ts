import { Component } from '@angular/core';
import { IonicPage, NavController, Navbar ,NavParams,AlertController,  LoadingController, ToastController,  ViewController } from 'ionic-angular';
import { CodeProvider } from './../../providers/code/code';
import { NetworkProvider } from '../../providers/network/network';
import { UtilService } from '../../providers/util/util.service';
import { ViewChild } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import { FormControl } from '@angular/forms';
@IonicPage({
  priority : 'high',
  segment  : 'MeusCodes/:token',
  defaultHistory:['HomePage']
})
@Component({
  selector: 'page-meus-codes',
  templateUrl: 'meus-codes.html',
})
export class MeusCodesPage {
  @ViewChild(Navbar) navBar: Navbar;
  meus_codes       : any[];
  token            : any;
  codes            : any;
  codes_videos     : any;
  code_expiratiion : any;
  package_name     : any;
  package_imagens  : any;
  package_videos   : String;
  codes_serve      : any[];
  searchTerm       : string = '';
  searchControl    : FormControl;
  ask_id           : String;
  constructor(
              public navCtrl       : NavController,
              public navParams     : NavParams,
              public alertCtrl     : AlertController,
              private codeProvider : CodeProvider,
              public toast         : ToastController,
              public  net          : NetworkProvider,
              public viewCtrl      : ViewController,
              public loadingCtrl   : LoadingController,
              public util          : UtilService
             ) {
              this.searchControl   = new FormControl();
  }

ionViewDidLoad() {
    this.token        = String;
    this.token        = "";
    this.token        = this.navParams.get('token');
    this.meus_codes   = [];
    this.codes_serve  = [];
     
    if(this.net.ckeckNetwork()){
        this.util.showLoading("Aguarde...");
        this.getAllCode(this.token);
        this.setFilteredItems();
    }else{
     
    
      this.navCtrl.setRoot('NotNetworkPage');
    } 
    this.navBar.backButtonClick = (e:UIEvent)=>{
      this.navCtrl.setRoot('HomePage');
     
     }  
   
}
onCancel(){
    return this.meus_codes =this.codes_serve;
  
}
filterItems(searchTerm){
    return this.meus_codes.filter((item) => {
        return item.code.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });     

}
setFilteredItems() {
   if(this.searchTerm == ""){
      this.meus_codes=[];
      this.onCancel();
   }else{
    this.meus_codes = this.filterItems(this.searchTerm);
   }
 

}
showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Informações',
      subTitle: 'Pacote :'+this.package_name+'<br>'+this.codes+' CODES<br>'+this.codes_videos+' Vídeos por CODE<br>Vencimento em : '+this.code_expiratiion+' dias',
      buttons: ['OK']
    });
    alert.present();
}
ShowMenu(code){
    this.navCtrl.push('MenuCodePage', {token:this.token,code:code,package_imagens:this.package_imagens,package_videos:this.codes_videos,package_name:this.package_name});
}
showEnquete(code){
    this.navCtrl.push('EnqueteListPage', {token:this.token,code:code,ask_id:this.ask_id});
}
getAllCode(token){
    if(this.net.ckeckNetwork()){
    this.codeProvider.getAllCode(token)
    .subscribe(
          (result: any) =>{
              this.util.loading.dismiss(); 
              if(result.status == 200){
                    for (var i = 0; i < result.codes.length; i++) {
                          var nov = result.codes[i];
                           if(nov.descricao != "" && nov.descricao != null){
                            nov.descricao = " - " +nov.descricao.substring(0,33)+'...';
                          } 
                          this.codes_serve.push(nov);
                         
                      }
                      this.codes            = result.info_user.package_code.package_codes;
                      this.codes_videos     = result.info_user.package_code.package_videos;
                      this.code_expiratiion = result.info_user.package_code.package_days;
                      this.package_name     = result.info_user.package_code.package_name;
                      this.package_imagens  = result.info_user.package_code.package_imagens;
                      console.log("img2",this.package_imagens);
                   
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
        } else{
          this.util.loading.dismiss();
          this.navCtrl.setRoot('NotNetworkPage');
     }
  }
  //chamada alerta de confirmação antes de excluir
 showConfirm(id_code) {
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
         this.code_remove(id_code);
       }
     }
   ]
 });
 confirm.present();


} 
pushPage(codeNumber){

  let latitude ;
  let longitude ;
  
  this.navCtrl.push('DetalheCodePage', {liberado:false,token:this.token,origem:2,
    info: {
      code: codeNumber,
      position:{"latitude": latitude, "longitude": longitude},
      telephone: ""
    }
  });

}
validaPacote(){
  console.log();
 // this.meus_codes.length = 100;
  if(this.meus_codes.length > 0){
    if(this.meus_codes.length >= this.codes ){
      const alert = this.alertCtrl.create({
        title: 'Alerta',
        subTitle: 'Você atingiu a quantidade de codes diponíveis no pacote <br>'+'Pacote :'+this.package_name+'<br>'+this.codes+' CODES<br>'+this.codes_videos+' Vídeos por CODE<br>Vencimento em : '+this.code_expiratiion+' dias',
        buttons: ['OK']
      });
      alert.present();
    }else{
        this.showPrompt();
    }
  }else {
    this.showPrompt();
 } 

}
showPrompt() {
     const prompt = this.alertCtrl.create({
        title: 'Escolha o seu CODE',
        message: "Exemplo: Rafael Rodrigues = (RR15)",
        enableBackdropDismiss: false ,
        inputs: [
          {
            name: 'code',
            placeholder: 'Informe seu code'
          },
          {
            label:'Se o seu code for um link informe',
            name: 'link',
            placeholder: 'Se o seu code for um link informe',
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            handler: data => {
              
            }
          },
          {
            text: 'Salvar',
            handler: data => {
              this.code_create(data.code,data.link);
            }
          }
        ]
      });
      prompt.present();
  
}

code_create(name_code,link){
    if(this.net.ckeckNetwork()){
          this.util.showLoading("Aguarde..");
          let t_conteudo = "1";
          if(link != "" && link != null){
                t_conteudo = "2";
          }

          this.codeProvider.code_create(this.token,name_code,link,t_conteudo)
          .subscribe(
                (result: any) =>{
                  this.util.loading.dismiss(); 
                  if(result.status == 200){
                    console.log("result",result);
                    this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                    this.navCtrl.push('MenuCodePage', {token:this.token,code:result.IDentrada,qtd_img:this.package_imagens,qtd_videos:this.codes_videos,pacote:this.package_name});
                  }else if(result.status == 402){
                    this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                    this.navCtrl.push('LoginPage');

                  }else{
                    this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                    
                  }

          } ,(error:any) => {
            this.toast.create({ message:"Não foi possível conectar ao servidor!", position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
              this.util.loading.dismiss(); 
              this.navCtrl.setRoot('HomePage');
          });
        
   }else{
    this.navCtrl.setRoot('NotNetworkPage');
   } 
}
  code_remove(id_code){
    if(this.net.ckeckNetwork()){
          this.util.showLoading("Aguarde...");
          this.codeProvider.code_remove(this.token,id_code)
          .subscribe(
                (result: any) =>{
                  this.util.loading.dismiss(); 
                  if(result.status == 200){
                    this.toast.create({ message: 'Excluído com sucesso !', position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                    this.navCtrl.setRoot(this.navCtrl.getActive().component,{token:this.token}); //atualiza apagina atual
                  }else if(result.status == 402){
                    this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                    this.navCtrl.push('LoginPage');

                  }else{
                    this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                    
                  }

          } ,(error:any) => {
            this.toast.create({ message:"Não foi possível conectar ao servidor!", position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
            this.util.loading.dismiss(); 
            this.navCtrl.setRoot('HomePage');
          });
        
   }else{
    this.navCtrl.setRoot('NotNetworkPage');
   } 
  }
  share(code){
    this.navCtrl.push('DetalheCodePage',{liberado :false,info: {
      code: code,
      position:{"latitude": "", "longitude": ""},
      telephone: ""
    }})
  }

}