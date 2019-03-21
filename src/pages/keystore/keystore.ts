import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from "../../providers/global/global";

/**
 * Generated class for the KeystorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-keystore',
  templateUrl: 'keystore.html',
})
export class KeystorePage {

  keystore:any;
  keyType:any = '0';
  typeArray:any = ['Keystore','QR code'];
  isHideCode:any= true;

  constructor(public navCtrl: NavController, public navParams: NavParams,public global:GlobalProvider) {
    this.keystore = this.navParams.get('keystore');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KeystorePage');
  }

  ionViewDidEnter(){
    this.initQRcode();
  }

  initQRcode(){
    let code= this.keystore;
    console.log(code);
    $("#qrcode").empty().qrcode({
      render: "canvas",
      text: JSON.stringify(code)
    })
  }

  copyKeystore(){
    this.global.copyText(JSON.stringify(this.keystore));
  }

  selectType(index){
    this.keyType = index;
  }

}
