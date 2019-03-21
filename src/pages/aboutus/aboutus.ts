import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppConfig } from "../../ts/app.config";
import { AppVersion } from "@ionic-native/app-version";
import { ChangeDetectorRef } from "@angular/core";

/**
 * Generated class for the AboutusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-aboutus',
  templateUrl: 'aboutus.html',
})
export class AboutusPage {

  appVersion:any = '0.0.1';
  groupArray:any = [
    {
      name:'Website',
      contact:'https://nkn.org '
    },
    {
      name:'Twitter',
      contact:'@NKN_ORG'
    },
    {
      name:'Telegram',
      contact:'@nknorg'
    },
    {
      name:'Medium',
      contact:'https://medium.com/nknetwork'
    },
    {
      name:'Wechat',
      contact:'@NKN资讯'
    },
    {
      name:'Email',
      contact:'contact@nkn.org'
    }
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams,private AppVersion: AppVersion,public cd:ChangeDetectorRef) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutusPage');
  }

  ionViewWillEnter(){
    let that = this;
    let version = AppConfig.appVersion;

    if(version){
      that.appVersion = version;
    }else {
      that.AppVersion.getVersionNumber().then(function(res:any){
        that.appVersion = AppConfig.appVersion = res;
        that.cd.detectChanges();
      });
    }
  }


}
