import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController} from 'ionic-angular';
import { WalletlistPage } from "../walletlist/walletlist";
import { AboutusPage } from "../aboutus/aboutus";
import { AppConfig } from "../../ts/app.config";
import { GlobalProvider } from "../../providers/global/global";
import { KeystorePage } from "../keystore/keystore";
import { LanguagePage } from "../language/language";
import { FirstguidePage } from "../firstguide/firstguide";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  walletIcon:any;
  walletName:any;
  walletAccounts:any;
  walletIndex:any;
  web3:any;

  aboutUs:any = AboutusPage;
  language:any = LanguagePage;
  walletList:any = WalletlistPage;


  constructor(public navCtrl: NavController,private alertCtrl: AlertController,public loadingCtrl:LoadingController,public global:GlobalProvider) {

  }

  ionViewWillEnter(){
    let that = this;
    that.initWallet();
  }

  ionViewDidEnter(){

  }

  ionViewWillLeave(){

  }

  ionViewDidLeave(){

  }

  /*初始化钱包*/
  initWallet(){
    let that = this;
    that.web3 = AppConfig.web3;
    const walletAccounts = that.walletAccounts = JSON.parse(AppConfig.getStorage('walletAccounts'));
    const walletIndex = that.walletIndex = AppConfig.getStorage("walletIndex");
    const wallet = walletAccounts[walletIndex];
    that.walletIcon = wallet.imgUrl;
    that.walletName = wallet.walletName;
  }

  /*修改钱包名称*/
  changeName() {
    let that = this;
    let alert = that.alertCtrl.create({
      title: 'Change wallet name',
      enableBackdropDismiss:false,
      inputs: [
        {
          name: 'name',
          placeholder: '',
          type: 'text',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {

          }
        },
        {
          text: 'Confirm',
          handler: data => {
            that.setNewName(data.name);
          }
        }
      ]
    });
    alert.present();
  }

  setNewName(name){
    let that = this;
    const wallet = that.walletAccounts[that.walletIndex];
    that.walletName = wallet.walletName = name;
    that.walletAccounts[that.walletIndex] = wallet;
    AppConfig.setStorage('walletAccounts',JSON.stringify(that.walletAccounts));
  }

  /*--导出keystore--*/
  inputPw(type){
    let that = this;
    let alert = that.alertCtrl.create({
      title: 'Please input your password',
      enableBackdropDismiss:false,
      inputs: [
        {
          name: 'password',
          placeholder: '',
          type: 'password',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {

          }
        },
        {
          text: 'Confirm',
          handler: data => {
            if(!data.password.length){
              that.global.alertError(AppConfig.nknCrrrentTip.walletSetting.pwRequired,"");
              return false;
            }

            that.exportKeystore(data.password,type);
          }
        }
      ]
    });
    alert.present();
  }

  /*导出keystore*/
  exportKeystore(password,type){
    let that = this;
    let message:any;
    type == 'export'? message = AppConfig.nknCrrrentTip.walletSetting.walletExporting : message = AppConfig.nknCrrrentTip.walletSetting.walletDeleting;
    const wallet = that.walletAccounts[that.walletIndex];
    var keyArray = new Array(wallet.keyStore);
    let loading:any = that.loadingCtrl.create({
      spinner:'ios',
      content: message
    });
    loading.present();
    setTimeout(function () {
      that.decrypt(keyArray, password, type);
      loading.dismiss();
    },200)

  }

  /*校验密码*/
  decrypt(keystoreArray, password,status){
    var that = this;
    const wallet = that.walletAccounts[that.walletIndex];

    try {
      that.web3.eth.accounts.wallet.decrypt(keystoreArray,password);
      if(status=='export'){
        that.navCtrl.push(KeystorePage,{
          keystore: JSON.stringify(wallet.keyStore)
        });
      }else if(status == 'delete'){
        that.isOnlyOneWallet();
      }
    }
    catch (error){
      that.global.alertError(AppConfig.nknCrrrentTip.common.pwWrong,"");
      return false;
    }
  }

  deleteWallet(){
    let that = this;
    let alert = that.alertCtrl.create({
      title: 'Delete current account',
      message:'Please make sure your private key is properly backed up. If you delete this wallet,  it will be lost forever. Are you sure?',
      enableBackdropDismiss:false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {

          }
        },
        {
          text: 'Delete',
          cssClass:'deleteWallet',
          handler: data => {
            that.inputPw('delete')
          }
        }
      ]
    });
    alert.present();
  }

  /* 重置钱包索引 */
  resetWalletIndex(){
    var that = this;
    that.walletAccounts.splice(that.walletIndex,1);
    AppConfig.setStorage('walletAccounts',JSON.stringify(that.walletAccounts));

    let index:any = AppConfig.getStorage('walletIndex');
    //如果当前删除钱包与首页默认钱包索引一致，重置为0
    if(index == that.walletIndex){
      AppConfig.setStorage('walletIndex','0');
    }
    that.initWallet();
  }

  /* 删除钱包时判断是否为唯一钱包 */
  isOnlyOneWallet(){
    var that = this;

    if(that.walletIndex == '0'){
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
