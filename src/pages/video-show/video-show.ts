import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
@IonicPage({
  priority : 'off',
  segment  : 'VideoShow/:videos',
  defaultHistory:['MenuCodePage']
})
@Component({
  selector: 'page-video-show',
  templateUrl: 'video-show.html',
})
export class VideoShowPage {
  videos          : any;
  video_link      : any;
  post_status     : any;
  file_name       : any;
  video_pictures  : any;
  constructor(
               public navCtrl      : NavController, 
              public  navParams    : NavParams,
              private domSanitizer : DomSanitizer,
            ) {
  }
  handleIFrameLoadEvent(): void {
 
  }
  ionViewDidLoad() {
    this.videos         = this.navParams.get('videos');
    this.video_link     = String;
    this.post_status    = String;
    this.file_name      = String;
    this.video_pictures = String;
    this.video_link     = "";
    this.post_status    = "";
    this.file_name      = "";
    this.video_pictures = "";
    this.post_status    = this.videos.post_status;
    this.video_link     = this.videos.video_link;
    if(this.post_status == "complete"){
      this.video_link     = this.domSanitizer.bypassSecurityTrustResourceUrl(this.videos.video_link);   
    }
    this.file_name      = this.videos.file_name;
    this.video_pictures = this.videos.video_pictures;
  }
  closeModal() {
    this.navCtrl.pop();
  }

}
