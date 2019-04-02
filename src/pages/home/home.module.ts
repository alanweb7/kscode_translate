import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { OneSignal } from '@ionic-native/onesignal';
import { Keyboard } from '@ionic-native/keyboard';
//TRANSLATE
import { TranslateService } from '@ngx-translate/core';
@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
  ],
  providers:[
    OneSignal,
    Keyboard
  ]
})
export class HomePageModule {

  constructor(
    public translateService:TranslateService
    ) { }
  changeLanguage(langauge){
  this.translateService.use(langauge);
  }

}
