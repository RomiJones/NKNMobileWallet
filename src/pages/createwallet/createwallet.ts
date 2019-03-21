import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppConfig } from "../../ts/app.config";
import { LoadingController } from "ionic-angular";
import { TabsPage } from "../tabs/tabs";
import { GlobalProvider } from "../../providers/global/global";

/**
 * Generated class for the CreatewalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-createwallet',
  templateUrl: 'createwallet.html',
})
export class CreatewalletPage {

  isCheckSuccess:boolean = false;
  pwRule1:boolean = true;
  pwRule2:boolean = true;
  pwRule3:boolean = true;
  isHidePW1:boolean = true;
  isHidePW2:boolean = true;
  isCreateSuccess:boolean = false;
  newKeystore:any;
  walletName:any;
  walletPassword:any;
  walletPasswordAgain:any;
  walletPwTipInfo:any = '';
  passwordAtuoTip:any = AppConfig.nknCrrrentTip.createWallet.pwLengthTip;
  passwordValidateTip:any = {
    tip1: this.passwordAtuoTip,
    tip2:"Please input confirm password",
    tip3:"Entering passwords twice is different"
  };
  passrule:any;
  strength:any = 'null';
  web3:any = AppConfig.web3;
  newWalletObj:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController,public global:GlobalProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreatewalletPage');
  }

  ionViewWillEnter(){
    /*AppConfig.resetNewWalletObj();*/
  }

  ionViewDidEnter(){
    var that = this;
    that.newWalletObj = $.extend(true,{},AppConfig.newWalletObj);
  }

  ionViewWillLeave(){
    /*AppConfig.resetNewWalletObj();*/
  }

  startCreateWallet(){
    var that = this;

    that.checkPasswordTwice();

    if(!that.isCheckSuccess) return;

    if(!that.isCreateSuccess){
      that.createNewWallet();
      return;
    }

    const isFirstEnter = AppConfig.getStorage("isFirstEnter");
    if(isFirstEnter != 'no' && that.isCreateSuccess){
      that.navCtrl.setRoot(TabsPage);
      AppConfig.setStorage("isFirstEnter",'no');
    }else{
      that.navCtrl.pop();
    }

  }

  checkPassword(){
    let that = this;
    let pw = that.walletPassword;
    if(pw.length <8){
      that.pwRule1 = false;
      return;
    }

    that.pwRule1 = true;
  }

  checkPasswordConfirm(){
    let that = this;
    let pw = that.walletPasswordAgain;
    if(!pw){
      that.pwRule2 = false;
      return;
    }

    that.pwRule2 = true;
  }

  /*密码强度校验*/
  checkPasswordTwice(){
    let that = this;
    const pw1 = that.walletPassword;
    const pw2 = that.walletPasswordAgain;

    if(!pw1){
      that.pwRule1 = false;
      return;
    }

    if(!pw2){
      that.pwRule2 = false;
      return;
    }

    if( pw1 != pw2){
      that.pwRule3 = false;
      return;
    }

    that.isCheckSuccess = true;
    that.pwRule1 = that.pwRule2 = that.pwRule3 = true;
  }


  /* 创建钱包 */
  createNewWallet(){
    var that = this;
    var web3 = that.web3;

    let loading:any = that.loadingCtrl.create({
      spinner:'ios',
      content: AppConfig.nknCrrrentTip.createWallet.creating
    });
    loading.present();

    setTimeout(function () {
      const newWallet = web3.eth.accounts.wallet.create(1);

      let newWalletKeystoreArray = web3.eth.accounts.wallet.encrypt(that.walletPassword);

      let newWalletObj:any = that.newWalletObj;
      newWalletObj.walletAddress = newWallet[0].address;
      newWalletObj.keyStore = newWalletKeystoreArray[0];
      newWalletObj.passwordTipInfo = that.walletPwTipInfo;
      newWalletObj.walletName = that.walletName;

      let type:any = typeof newWalletObj;

      if( newWalletObj!='' && type!='undefined'){
        that.newKeystore = JSON.stringify(newWalletObj.keyStore);
        that.isCreateSuccess = true;

        let walletAccounts:any = JSON.parse(AppConfig.getStorage('walletAccounts'));
        let isArray = walletAccounts instanceof Array;
        if(!walletAccounts && !isArray){
          walletAccounts = AppConfig.walletAccount;
          AppConfig.setStorage("walletIndex",'0');
        }
        walletAccounts.push(newWalletObj);
        AppConfig.setStorage('walletAccounts',JSON.stringify(walletAccounts));
        loading.dismiss();
      }

    },200)

  }

  /* 回退按钮事件 */
  navBack(){
    const isFirstEnter = AppConfig.getStorage("isFirstEnter");
    if(isFirstEnter != 'no' && this.isCreateSuccess){
      this.navCtrl.setRoot(TabsPage);
      AppConfig.setStorage("isFirstEnter",'no');
    }else{
      this.navCtrl.pop();
    }
  }

  /* 复制钱包地址 */
  copyWalletAddress(){
    let that = this;
    that.global.copyText(that.newKeystore);
  }

}
