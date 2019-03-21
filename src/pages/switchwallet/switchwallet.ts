import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppConfig } from "../../ts/app.config";
import { ChangeDetectorRef } from '@angular/core';
import { CreatewalletPage } from "../createwallet/createwallet";

/**
 * Generated class for the SwitchwalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-switchwallet',
  templateUrl: 'switchwallet.html',
})
export class SwitchwalletPage {

  WallatListArray:any;
  wei:number = Math.pow(10,18);
  createWallet:any = CreatewalletPage;

  constructor(public navCtrl: NavController, public navParams: NavParams,public cd: ChangeDetectorRef) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SwitchwalletPage');
  }

  ionViewWillEnter(){
    var that = this;

    that.WallatListArray = JSON.parse(AppConfig.getStorage('walletAccounts'));

    for (let item of that.WallatListArray ){
      var coinNum = item.asset[0].coinNum;
      coinNum = ( coinNum / that.wei).toFixed(4);
      item.ethCoinNum = coinNum;
    }
  }

  ionViewDidEnter(){
    this.cd.detectChanges();
  }

  selectWallet(index){
    AppConfig.setStorage('walletIndex',index);
    AppConfig.isSwitchWallet = true;
    this.navCtrl.pop();
  }

}
