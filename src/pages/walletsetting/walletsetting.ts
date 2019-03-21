import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppConfig } from "../../ts/app.config";
import { AlertController } from 'ionic-angular';
import { LoadingController } from "ionic-angular";
import { ExportkeystorePage } from "../exportkeystore/exportkeystore";
import { FirstguidePage } from "../firstguide/firstguide";

/**
 * Generated class for the WalletsettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-walletsetting',
  templateUrl: 'walletsetting.html',
})
export class WalletsettingPage {

  web3:any = AppConfig.web3;
  curWallet:any;
  curWalletIndex:any;
  newWalletName:any;
  ethCoinNum:any;
  walletAccounts:any = JSON.parse(AppConfig.getStorage('walletAccounts'));
  ethUnit:number = Math.pow(10,18);

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController,public loadingCtrl: LoadingController) {
    this.curWallet = navParams.get('wallet');
    this.curWalletIndex = navParams.get('index');
    this.ethCoinNum = parseInt(this.curWallet.asset[0].coinNum)/ this.ethUnit;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletsettingPage');
  }

  ionViewWillEnter(){
    var that = this;
    that.newWalletName = that.curWallet.walletName;
  }

  ionViewDidEnter(){

  }

  /*保存钱包*/
  saveWallet(){
    var that = this;
    var nameLen = this.newWalletName.length;
    if(nameLen == 0 || nameLen>12){
      that.showAlert(AppConfig.nknCrrrentTip.walletSetting.requireNameTip,"")
    }else{
      this.navCtrl.pop();
      that.curWallet.walletName = that.newWalletName;
      that.walletAccounts[that.curWalletIndex] = that.curWallet;
      AppConfig.setStorage('walletAccounts',JSON.stringify(that.walletAccounts));
    }
  }

  /*删除钱包*/
  deleteWallet(){
    var that = this;
    var keyArray = new Array(that.curWallet.keyStore);
    let loading:any = that.loadingCtrl.create({
      spinner:'ios',
      content: AppConfig.nknCrrrentTip.walletSetting.walletDeleting
    });

    const prompt = this.alertCtrl.create({
      title: AppConfig.nknCrrrentTip.walletSetting.inputPw,
      message: AppConfig.nknCrrrentTip.walletSetting.inputPwSubTitle,
      inputs: [
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: AppConfig.nknCrrrentTip.common.cancle,
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '确认',
          handler: data => {
            if(!data.password.length){
              that.showAlert(AppConfig.nknCrrrentTip.walletSetting.pwRequired,"")
            }else {
              loading.present();
              setTimeout(function () {
                that.decrypt(keyArray,data.password,'delete');
                loading.dismiss();
              },200)
            }
          }
        }
      ],
      enableBackdropDismiss:false
    });
    prompt.present();
  }

  /*导出keystore*/
  exportKeystore(){
    var that = this;
    var keyArray = new Array(that.curWallet.keyStore);
    let loading:any = that.loadingCtrl.create({
      spinner:'ios',
      content: AppConfig.nknCrrrentTip.walletSetting.walletExporting
    });
    let alert = that.alertCtrl.create({
      title: AppConfig.nknCrrrentTip.walletSetting.inputPw,
      inputs: [
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: AppConfig.nknCrrrentTip.common.cancle,
          handler: data => {

          }
        },
        {
          text: AppConfig.nknCrrrentTip.common.confirm,
          handler: data => {
            if(!data.password.length){
              that.showAlert(AppConfig.nknCrrrentTip.walletSetting.pwRequired,"");
              loading.dismiss();
            }else {
              loading.present();
              setTimeout(function () {
                that.decrypt(keyArray,data.password,'export');
                loading.dismiss();
              },200)
            }
          }
        }
      ],
      enableBackdropDismiss:false
    });
    alert.present();
  }

  /*校验密码*/
  decrypt(keystoreArray, password,status){
    var that = this;

    try {
      that.web3.eth.accounts.wallet.decrypt(keystoreArray,password);
      if(status=='export'){
        that.navCtrl.push(ExportkeystorePage,{
          keystore:that.curWallet.keyStore
        });
      }else if(status == 'delete'){
        that.isOnlyOneWallet();
      }
    }
    catch (error){
      this.showAlert(AppConfig.nknCrrrentTip.common.pwWrong,"");
      return false;
    }
  }

  showAlert(title,res) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: res,
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

  /* 重置钱包索引 */
  resetWalletIndex(){
    var that = this;
    that.walletAccounts.splice(that.curWalletIndex,1);
    AppConfig.setStorage('walletAccounts',JSON.stringify(that.walletAccounts));

    let index:any = AppConfig.getStorage('walletIndex');
    //如果当前删除钱包与首页默认钱包索引一致，重置为0
    if(index == that.curWalletIndex){
      AppConfig.setStorage('walletIndex','0');
    }
    that.navCtrl.pop();
  }

  /* 删除钱包时判断是否为唯一钱包 */
  isOnlyOneWallet(){
    var that = this;

    if(that.curWalletIndex == '0'){
      let walletLen = JSON.parse(AppConfig.getStorage('walletAccounts')).length;
      if(walletLen>1){
        that.resetWalletIndex();
      }else {
        AppConfig.setStorage('walletAccounts',null);
        AppConfig.setStorage("isFirstEnter",'yes');
        that.navCtrl.setRoot(FirstguidePage);
      }
    }else {
      that.resetWalletIndex();
    }
  }

}
