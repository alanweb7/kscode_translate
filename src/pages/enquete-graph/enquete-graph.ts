import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { Chart } from 'chart.js';
//import Provider
import { NetworkProvider } from '../../providers/network/network';
import { CodeProvider } from './../../providers/code/code';
import { UtilService } from '../../providers/util/util.service';
@IonicPage({
  priority : 'off',
  segment  :'EnqueteGraph/:question/:option1/:option2/:label1/:label2'
})
@Component({
  selector: 'page-enquete-graph',
  templateUrl: 'enquete-graph.html',
})
export class EnqueteGraphPage {
  @ViewChild('doughnutCanvas') doughnutCanvas;
  doughnutChart: any;
  question:String;
  option1   : Number;
  option2   : Number;
  label1    : String;
  label2    : String;
  code_id   :String;
  ask_id    : String;
    constructor(public navCtrl  : NavController, 
              public navParams  : NavParams,
              public  viewCtrl  : ViewController, 
              private codeProvider   : CodeProvider,
              public  net            : NetworkProvider,
              public util            : UtilService,
              public toast           : ToastController,
              ) {
  }
  ionViewDidLoad() {
    //this.question         = this.navParams.get('question');
    this.util.showLoading("Aguarde...");
    this.option1          = this.navParams.get('option1');
    this.option2          = this.navParams.get('option2');
    this.code_id          = this.navParams.get('code_id');
    this.ask_id           = this.navParams.get('ask_id');
    
    this.getEnq();
    console.log(this.option1,this.option2,this.label1,this.label2);
   
    }
    fecharAvaliacao(){
 
      
       this.viewCtrl.dismiss();
    }
    getEnq(){
      if(this.net.ckeckNetwork()){
        this.codeProvider.getEnq(this.code_id,this.ask_id)
        .subscribe(
              (result: any) =>{
                  this.util.loading.dismiss(); 
                  if(result.status == 200){
                 
                    this.question   = result.question;
                    this.label1     = result.option1;
                    this.label2     = result.option2;
                    if(this.option1 == null){
                        this.option1 = 0;
                    }
                    if(this.option2 == null){
                      this.option2 = 0;
                  }
                    this.doughnutChart    = new Chart(this.doughnutCanvas.nativeElement, {
  
                      type: 'doughnut',
                      data: {
                          labels: [this.label1,this.label2],
                          datasets: [{
                              label: '# of Votes',
                              data: [this.option1,this.option2 ],
                              backgroundColor: [
                                  'rgba(0, 173, 12, 1)',
                                  'rgba(173, 0, 38, 1)'
                                 
                              ],
                              hoverBackgroundColor: [
                                  "#00ad0c",
                                  "#ad0026"
                                 
                              ]
                          }]
                      }
                  
                      });
                  }else if(result.status == 402){
                    this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                   // this.navCtrl.push('LoginPage');
                  }
                  else if(result.status == 403){
                    this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                    //this.navCtrl.push('HomePage');
                    this.viewCtrl.dismiss();
                  }
          
                } ,(error:any) => {
                  this.toast.create({ message:"Não foi possível conectar ao servidor!", position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                   
                  this.util.loading.dismiss(); 
                  this.viewCtrl.dismiss();
                });
              }else{
                this.util.loading.dismiss();
                this.navCtrl.setRoot('NotNetworkPage');
               }
         }
}
