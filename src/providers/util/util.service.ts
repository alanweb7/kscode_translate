import { Injectable } from '@angular/core';
import { Http,Response} from '@angular/http';
import { Loading, LoadingController } from 'ionic-angular';
import { Base64 } from '@ionic-native/base64';
import { File} from '@ionic-native/file';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class UtilService {
  loading    : Loading;
   APP_URL_PAIS ='https://kscode.com.br/ksc_2020/wp-json/admin/v1/users/codes?countries=all'
  constructor(public http: Http,
               public loadingCtrl    : LoadingController,
               private base64         : Base64,
               public file            : File,
              ) {
    console.log('Hello UtilProvider Provider');
  }

  getPaisALL(): Observable<any>{
    let url = this.APP_URL_PAIS;
    return this.http.get(url).map((resp:Response)=> resp.json());
  }
  createNewFileName(oldFileName: String): String {
    let extension: string = oldFileName.substr(oldFileName.lastIndexOf('.')); // .png, .jpg
    return new Date().getTime() + extension; // 1264546456.jpg
  }
  getExtension(file: String): String{
    let extension: string = file.substr(file.lastIndexOf('.')); // .png, .jpg
    return  extension; // .jpg
  }
  converterBase64(file): Promise<String>{
     return <Promise<String>> this.base64.encodeFile(file).then(base64File => base64File.replace('data:image/*;charset=utf-8;base64,',''))
     .catch((error: Error) => console.log(`Error updating ${name} movie!`, error)); 
  }

  showLoading(msg){
    this.loading= this.loadingCtrl.create({
      content  : msg,
     cssClass  : "loadingInterna"
   });
   this.loading.present();
  }
  getCEP(cep):Observable<any[]>{
    let url = '  https://api.postmon.com.br/v1/cep/'+cep;
    return this.http.get(url).map((resp:Response)=> resp.json());
   }

}
