import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { CodeProvider } from './../../providers/code/code';
import { NetworkProvider } from '../../providers/network/network';
import { UtilService } from '../../providers/util/util.service';


@IonicPage()
@Component({
  selector: 'page-recuperasenha',
  templateUrl: 'recuperasenha.html',
})
export class RecuperasenhaPage {
//validação de formulario
public loginForm: any;
erro=false;
message="";
messageEmail = "";
errorEmail = false;
email :any;
class ="";
  constructor(
                public navCtrl         : NavController, 
                public navParams       : NavParams,
                formBuilder            : FormBuilder ,
                public toast           : ToastController,
                public net             : NetworkProvider,
                private codeProvider   : CodeProvider,
              ) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecuperasenhaPage');
  }
  closeModal() {
    this.navCtrl.pop();
  }
  forgotpass(){
    let { email } = this.loginForm.controls;
        if (!this.loginForm.valid) {
                  if (!email.valid) {
                    this.errorEmail = true;
                    this.messageEmail = "Ops! Email inválido";
                       this.class = "danger";
                  } else {
                    this.messageEmail = "";
                  }
              
                 
        }
        else {
              if(this.net.ckeckNetwork()){
                    this.codeProvider.forgotpass(this.email)
                        .subscribe(
                                (result: any) =>{
                                  if(result.status == 200){
                                    this.toast.create({ message: result.message, position: 'botton', duration: 4000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                                    this.navCtrl.push('LoginPage');  
                                  }if(result.status == 403){
                                    this.toast.create({ message: result.message, position: 'botton', duration: 4000 ,closeButtonText: 'Ok!',cssClass: 'erro'  }).present();
                                
                                  }
                        },(error:any) => {
                              if(error.status){
                                   this.message      = "";
                              }else{
                                    this.erro         = true;
                                    this.message      ='Email não encontrado';
                                    this.messageEmail = "";
                                    this.class        = "danger";
                                  
                              }
                
                      });

                  }else{
                      this.navCtrl.setRoot('NotNetworkPage');
                  
                  }
            
               
        }
  }
}
