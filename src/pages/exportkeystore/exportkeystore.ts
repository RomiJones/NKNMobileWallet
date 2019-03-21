import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { TabsPage } from "../tabs/tabs";
import { AppConfig } from "../../ts/app.config";

/**
 * Generated class for the ExportkeystorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-exportkeystore',
  templateUrl: 'exportkeystore.html',
})
export class ExportkeystorePage {

  outputKeystore:any;
  copyBtnText:any = AppConfig.nknCrrrentTip.common.copyKeystore;
  keyBox:any = 'key';
  isFirst:boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,private clipboard: Clipboard) {
    var keystore = navParams.get('keystore');
    this.isFirst = navParams.get('isFirst');
    this.outputKeystore = JSON.stringify(keystore);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExportkeystorePage');
  }

  ionViewDidEnter(){
    let views = this.navCtrl.getViews();
    let removeViewIndex = views.length-2;
    this.navCtrl.removeView(views[removeViewIndex]);
  }

  ionViewWilllLeave(){

  }

  ionViewDidLeave(){

  }

  /* 回退按钮事件 */
  navBack(){
    if(this.isFirst){
      this.navCtrl.setRoot(TabsPage);
    }else {
      this.navCtrl.pop();
    }
  }

  /* 复制keystore文本 */
  copyKeystore(){
    var that = this;
    that.clipboard.copy(that.outputKeystore).then(
      function (data) {
        $(".copyTip").show();
        that.copyBtnText = AppConfig.nknCrrrentTip.common.copied;
        setTimeout(function () {
          $(".copyTip").hide();
          that.copyBtnText = AppConfig.nknCrrrentTip.common.copyKeystore;
        },2000)
      },
      function (error) {
        console.log(error);
      }
    )

  }

  /* 显示keystore二维码 */
  showKeystoreQRcode(){
    var that = this;
    $(".safeTipBox").hide();
    $(".keystoreCodeShowBox").show();
    $(".keystoreCodeShowBox>div").qrcode({
      render: "canvas", //也可以替换为table
      text: that.outputKeystore
    })
  }

}
