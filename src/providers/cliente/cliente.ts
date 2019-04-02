import { Injectable } from '@angular/core';
import { Http,Response} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ClienteProvider {
  //CHAMADA DA URL PRINCIPAL DA API
  private API_URL = 'https://kscode.com.br/ksc_2020/wp-json/admin/v1/users/login/'
  private CLIENTE_URL ='https://kscode.com.br/ksc_2020/wp-json/admin/v1/users/codes?'
  constructor(public http: Http) {
    
  }
    
UpdateAccount(first_name:String,last_name:String,avatar:String,user_email:String,nome_empresa:String,segmento_empresa:String,user_cep:String,estado_empresa:String,cidade_empresa:String,token:String) : Observable<any[]>{
     var data = {
        first_name        : first_name,
        last_name          : last_name,
        user_email        : user_email,
        avatar            : avatar,
        nome_empresa      : nome_empresa,
        segmento_empresa  : segmento_empresa,
        user_cep          : user_cep,
        estado_empresa    : estado_empresa,
        cidade_empresa    : cidade_empresa,
        bloco             : 9,
        token             : token
     };
      return this.http.post(this.CLIENTE_URL, data).map((resp:Response)=> resp.json());
  
}
 setPicture(picture :any,id:String) : Observable<any[]>{
    var data = {
         id :id, 
         picture  : picture
       };
    return this.http.post(this.API_URL + 'clients/picture', data).map((resp:Response)=> resp.json())
 }
login(username: String, password: String) : Observable<any[]>{
    let data ={
      username: username,
      password: password
    };
    return this.http.post(this.API_URL ,data).map((resp:Response)=> resp.json());
  }
    getinfConta(token:String):Observable<any[]>{
  let url = this.CLIENTE_URL+'token='+token+'&bloco=9';
  return this.http.get(url).map((resp:Response)=> resp.json());  
 }
 getSegmento():Observable<any[]>{
  let url = 'https://kscode.com.br/ksc_2020/wp-json/admin/v1/users/codes?segments=all';
  return this.http.get(url).map((resp:Response)=> resp.json());
 }
 forgotpass(email: String) : Observable<any[]>{
     var data = {
      email: email
    };
   return this.http.post(this.API_URL + 'clients/forgotpass', data).map((resp:Response)=> resp.json());
  }


}
