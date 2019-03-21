import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppConfig } from "../../ts/app.config";

/**
 * Generated class for the TxrecordlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-txrecordlist',
  templateUrl: 'txrecordlist.html',
})
export class TxrecordlistPage {

  curWalletAccount:any;
  walletName:any;
  txHistory:any;
  wei:number = Math.pow(10,18);

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TxrecordlistPage');
  }

  ionViewWillEnter(){
    let that = this;
    let walletAccounts = JSON.parse(AppConfig.getStorage('walletAccounts'));
    let walletIndex = AppConfig.getStorage("walletIndex");
    that.curWalletAccount = walletAccounts[walletIndex];
    that.walletName = that.curWalletAccount.walletName;
    let txHistory = that.curWalletAccount.totalTxHistory;

    if(!txHistory){
      that.txInfoShow();
    }else {
      that.txHistory = txHistory;
    }
  }

  ionViewDidEnter(){

  }

  ionViewDidLeave(){

  }

  /* 交易历史数据处理 */
  txInfoShow(){
    let that = this;
    let tempArray = that.curWalletAccount.ethTxInfo.concat(that.curWalletAccount.nknTxInfo);
    let txInfo:any = tempArray;

    for(let i=0;i<txInfo.length;i++){
      txInfo[i].address = AppConfig.walletAddressShorten(txInfo[i].to,10);
      txInfo[i].txValue = (Number(txInfo[i].value) / that.wei).toFixed(4);
    }

    that.txHistory = txInfo;
  }

}
