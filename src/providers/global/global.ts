import { Injectable,ViewChild } from '@angular/core';
import { ToastController, NavController, AlertController} from "ionic-angular";
import { Clipboard } from "@ionic-native/clipboard";
import {AppConfig} from "../../ts/app.config";

/*
  Generated class for the GlobalProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalProvider {

  constructor(public toastCtrl: ToastController,public clipboard: Clipboard,public alertCtrl:AlertController) {
    console.log('Hello GlobalProvider Provider');
  }

  @ViewChild(NavController)
  public navCtrl:NavController

  /* 错误弹窗 */
  alertError(title,subTitle){
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [{
        text: AppConfig.nknCrrrentTip.common.ok,
        handler: () => {
          alert.dismiss();
          return false;
        }
      }],
      enableBackdropDismiss:false
    });
    alert.present();
  }

  /* Toast提示 */
  appToast(msg,position,duration) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: duration,
      position: position,
      cssClass: 'copyCode'
    });
    toast.present();
  }

  /* 复制keystore文本 */
  copyText(text){
    var that = this;
    that.clipboard.copy(text).then(
      function (data) {
        that.appToast("Copied",'middle',1500)
      },
      function (error) {
        console.log(error);
      }
    )

  }


}

