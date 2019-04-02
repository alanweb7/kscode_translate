import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';

@Injectable()
export class NetworkProvider {
   isConnection : any;
  constructor(private network: Network) {
    this.isConnection =Boolean;
  }
  ckeckNetwork():Boolean{
     this.network.onConnect().subscribe(()=>{
      this.isConnection = true;
      });
     this.network.onDisconnect().subscribe(()=>{
       this.isConnection = false;
     });
    return this.isConnection;
  } 
}