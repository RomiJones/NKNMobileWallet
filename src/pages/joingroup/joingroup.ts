import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Clipboard } from "@ionic-native/clipboard";
import { ToastController } from "ionic-angular";
import { AppConfig } from "../../ts/app.config";

/**
 * Generated class for the JoingroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-joingroup',
  templateUrl: 'joingroup.html',
})
export class JoingroupPage {

  groupArray:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private clipboard: Clipboard,private toastCtrl: ToastController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JoingroupPage');
  }

  copyItem(res){
    this.clipboard.copy(res);
    this.copyToast(res);
  }

  copyToast(res){
    let toast = this.toastCtrl.create({
      message: AppConfig.nknCrrrentTip.common.copied,
      duration: 1500,
      position: 'top'
    });
    toast.present();
  }

}
