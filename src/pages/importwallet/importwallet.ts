import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppConfig } from "../../ts/app.config";
import { AlertController } from 'ionic-angular';
import { LoadingController } from "ionic-angular";
import { TabsPage } from "../tabs/tabs";
import { ScanqrcodePage } from "../scanqrcode/scanqrcode";

/**
 * Generated class for the ImportwalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-importwallet',
  templateUrl: 'importwallet.html',
})
export class ImportwalletPage {

  isHidePW1:boolean = true;
  isHidePW2:boolean = true;
  isAgreeClause:any;
  web3:any = AppConfig.web3;
  walletKeystore:any;
  walletPassword:any;
  walletPasswordAgain:any;
  newWalletObj:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController,public loadingCtrl: LoadingController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImportwalletPage');
  }

  ionViewWillEnter(){
    /*AppConfig.resetNewWalletObj();*/
  }

  ionViewDidEnter(){
    let that = this;
    that.newWalletObj = $.extend(true,{},AppConfig.newWalletObj);
    that.walletKeystore = AppConfig.QRcode;

    let keystore = document.getElementById("keystore");
    that.textareaHeightAuto(keystore,10,300);
  }

  ionViewWillLeave(){
    /*AppConfig.resetNewWalletObj();*/
    AppConfig.QRcode = '';
  }

  /*导入keystore钱包*/
  startImportWallet(){
    var that = this;

    let loading:any = that.loadingCtrl.create({
      spinner:'ios',
      content: AppConfig.nknCrrrentTip.importWallet.importing
    });

    try {
      var keystore = JSON.parse(that.walletKeystore);
      if(!that.isJson(keystore)){
        that.showAlert(AppConfig.nknCrrrentTip.importWallet.keystoreInvalid,"");
        return;
      }

      if(!that.walletPassword){
        that.showAlert(AppConfig.nknCrrrentTip.importWallet.requireRight,"");
        return;
      }

      loading.present();
      setTimeout(function () {
        var keystoreArray = new Array(keystore);
        var keystorePw = that.walletPassword;

        try{
          var newWallet = that.web3.eth.accounts.wallet.decrypt(keystoreArray,keystorePw);

          let newWalletObj:any = that.newWalletObj;
          newWalletObj.walletAddress = newWallet[0].address;
          newWalletObj.keyStore = keystore;

          var type = typeof newWalletObj;
          if( newWalletObj!='' && type!='undefined'){

            that.web3.eth.getBalance(newWalletObj.walletAddress).then(
              function (value) {
                newWalletObj.asset[0].coinNum = value;
                let walletAccounts:any = JSON.parse(AppConfig.getStorage('walletAccounts'));
                if(!walletAccounts){
                  AppConfig.isSwitchWallet = true;
                  walletAccounts = AppConfig.walletAccount;
                  AppConfig.setStorage("isFirstEnter",'no');
                  AppConfig.setStorage("walletIndex",'0');
                  that.navCtrl.setRoot(TabsPage);
                }else {
                  that.navCtrl.pop();
                }
                walletAccounts.push(newWalletObj);
                AppConfig.setStorage('walletAccounts',JSON.stringify(walletAccounts));
                loading.dismiss();
                that.web3.eth.accounts.wallet.clear();
              },
              function (error) {
                loading.dismiss();
                that.showAlert(error,"");
              }
            );
          }

        }
        catch (error){
          that.showAlert(AppConfig.nknCrrrentTip.common.pwWrong,"");
          loading.dismiss();
        }
      },200)
    }
    catch (error){
      that.showAlert(AppConfig.nknCrrrentTip.importWallet.keystoreInvalid,"")
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
      }]
    });
    alert.present();
  }

  /* 判断keystore格式合法性 */
  isJson(obj){
    var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
    return isjson;
  }

  /* 启动扫一扫功能 */
  scanQRcode(){
    this.navCtrl.push(ScanqrcodePage,{},{
      animate:false
    });
  }

  /*文本框自适应高度*/
  textareaHeightAuto(elem, extra, maxHeight){

    /**
     * 文本框根据输入内容自适应高度
     * @param                {HTMLElement}        输入框元素
     * @param                {Number}                设置光标与输入框保持的距离(默认0)
     * @param                {Number}                设置最大高度(可选)
     */
    extra = extra || 0;
    var isFirefox =  'mozInnerScreenX' in window,
      isOpera = false,
      addEvent = function(type, callback) {
        elem.addEventListener ?
          elem.addEventListener(type, callback, false) :
          elem.attachEvent('on' + type, callback);
      },
      getStyle = elem.currentStyle ? function(name) {
        var val = elem.currentStyle[name];
        if (name === 'height' && val.search(/px/i) !== 1) {
          var rect = elem.getBoundingClientRect();
          return rect.bottom - rect.top -
            parseFloat(getStyle('paddingTop')) -
            parseFloat(getStyle('paddingBottom')) + 'px';
        };
        return val;
      } : function(name) {
        return getComputedStyle(elem, null)[name];
      },
      minHeight = parseFloat(getStyle('height'));
    elem.style.resize = 'none';
    var change = function() {
      var scrollTop, height,
        padding = 0,
        style = elem.style;
      if (elem._length === elem.value.length) return;
      elem._length = elem.value.length;
      if (!isFirefox && !isOpera) {
        padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
      };
      scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
      elem.style.height = minHeight + 'px';
      if (elem.scrollHeight > minHeight) {
        if (maxHeight && elem.scrollHeight > maxHeight) {
          height = maxHeight - padding;
          style.overflowY = 'auto';
        } else {
          height = elem.scrollHeight - padding;
          style.overflowY = 'hidden';
        };
        style.height = height + extra + 'px';
        scrollTop += parseInt(style.height) - elem.currHeight;
        document.body.scrollTop = scrollTop;
        document.documentElement.scrollTop = scrollTop;
        elem.currHeight = parseInt(style.height);
      };
    };
    addEvent('propertychange', change);
    addEvent('input', change);
    addEvent('focus', change);
    change();
  }

}
