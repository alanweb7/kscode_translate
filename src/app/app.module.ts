import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule,CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpModule, } from '@angular/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
//import native
import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import { Deeplinks } from '@ionic-native/deeplinks';
import { SocialSharing } from '@ionic-native/social-sharing';
import { BrowserTab } from '@ionic-native/browser-tab';
import { Base64 } from '@ionic-native/base64';
import {  File } from '@ionic-native/file';
import { NativeStorage } from '@ionic-native/native-storage';
//import provider
import { SqliteHelperService } from '../providers/sqlite-helper/sqlite-helper.service';
import { CodeProvider } from '../providers/code/code';
import { NetworkProvider } from '../providers/network/network';
import { UsuarioService } from '../providers/movie/usuario.service';
import { UtilService } from '../providers/util/util.service';
import { DetalheCodePageModule } from '../pages/detalhe-code/detalhe-code.module';
import { Autosize} from '../directives/autosize/autosize';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar';


@NgModule({
  declarations: [
    MyApp,
    Autosize,
    ProgressBarComponent
   
  ],
  imports: [
    BrowserModule,
    HttpModule,
    DetalheCodePageModule,
    IonicModule.forRoot(MyApp,),
    IonicStorageModule.forRoot()    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  
  ],
  providers: [
    SQLite,
    NativeStorage,
    SqliteHelperService,
    CodeProvider,
    Geolocation,
    Deeplinks,
    Base64,
    SocialSharing,
    BrowserTab,
   
    File,
    Network,
    NetworkProvider,
    StatusBar,
    SplashScreen,
    UsuarioService,
    UtilService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  
    
  ]
  ,
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule {}
