import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppConfig } from "../../ts/app.config";
import { ImportwalletPage } from "../importwallet/importwallet";
import { CreatewalletPage } from "../createwallet/createwallet";
import { WalletsettingPage } from "../walletsetting/walletsetting";
import { ChangeDetectorRef } from '@angular/core';
import { Decimal } from "decimal.js";

/**
 * Generated class for the WalletlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-walletlist',
  templateUrl: 'walletlist.html'
})
export class WalletlistPage {

  web3:any;
  myContract:any;
  walletAccounts:any;
  lastEtherPrice:any;

  WallatListArray:any;
  wei:number = Math.pow(10,18);

  constructor(public navCtrl: NavController, public navParams: NavParams,public cd: ChangeDetectorRef) {

  }

  ionViewDidLoad() {
    this.web3 = AppConfig.web3;
    this.myContract = AppConfig.myContract;
    this.lastEtherPrice = AppConfig.ethUsdPrice;
  }

  ionViewWillEnter(){
    var that = this;
    that.updateAllWalletAsset();

    /*that.WallatListArray = JSON.parse(AppConfig.getStorage('walletAccounts'));

    for (let item of that.WallatListArray ){
      let curAdd = item.walletAddress;
      var coinNum = item.asset[0].coinNum;
      item.walletAddressShorten = AppConfig.walletAddressShorten(curAdd,10);
      coinNum = ( coinNum / that.wei).toFixed(4);
      item.ethCoinNum = coinNum;
    }*/
  }

  ionViewDidEnter(){
    this.cd.detectChanges();
  }

  selectWallet(index){
    let that = this;
    AppConfig.setStorage("walletIndex",index);
    that.navCtrl.pop();
  }

  toImportWallet(){
    this.navCtrl.push(ImportwalletPage);
  }

  toCreateWallet(){
    this.navCtrl.push(CreatewalletPage);
  }

  toWalletSetting(wallet,index){
    this.navCtrl.push(WalletsettingPage,{
      wallet:wallet,
      index:index
    })
  }

  /* 更新所有钱包资产情况 */
  updateAllWalletAsset(){
    let that = this;
    let web3 = that.web3;
    let myContract = that.myContract;
    let walletAccounts = JSON.parse(AppConfig.getStorage('walletAccounts'));

    for(let item of walletAccounts){
      let curAdd = item.walletAddress;
      item.walletAddressShorten = AppConfig.walletAddressShorten(curAdd,10);

      web3.eth.getBalance(item.walletAddress).then(
        function (value) {
          item.asset[0].coinNum = value;
          item.ethCoinNum = new Decimal(value).div(that.wei);
          AppConfig.setStorage('walletAccounts',JSON.stringify(walletAccounts));
        },
        function (error) {
          console.log("web3查询ETH失败："+error);
        }
      );

      //查询钱包NKN余额
      myContract.methods.balanceOf(item.walletAddress).call(null,function (error, result) {
        if(!error){
          item.asset[1].coinNum = result;
          item.nknCoinNum = new Decimal(result).div(that.wei);
          that.esWalletTotal(item);
          that.walletAccounts = walletAccounts;
          that.cd.detectChanges();
          AppConfig.setStorage('walletAccounts',JSON.stringify(walletAccounts));
        }else{
          console.log("nkn查询失败"+error);
        }
      })
    }
  }

  /*估算钱包资产总额*/
  esWalletTotal(wallet){
    let that = this;
    if(!wallet.ethCoinNum) wallet.ethCoinNum=0;
    if(!wallet.nknCoinNum) wallet.nknCoinNum=0;
    const etherEs = new Decimal(wallet.ethCoinNum).mul(that.lastEtherPrice).toFixed(2);
    const nknEs = new Decimal(wallet.nknCoinNum).mul(AppConfig.nknPrice).toFixed(2);
    const total = new Decimal(etherEs).plus(nknEs).toFixed(2);
    wallet.assetEsTotal = total;
  }

}
