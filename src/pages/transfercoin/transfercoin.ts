import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { ChangeDetectorRef } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { AppConfig } from "../../ts/app.config";
import { ScanqrcodePage } from "../scanqrcode/scanqrcode";
import { Decimal } from "decimal.js";

/**
 * Generated class for the TransfercoinPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-transfercoin',
  templateUrl: 'transfercoin.html',
})
export class TransfercoinPage {

  isHidePW:boolean = true;
  coinName:any;
  coinNum:any;
  walletAddress:any;
  walletAddressShort:any;
  gasRangePrice:any;
  gasLimit:number;
  coastEtherEs:any;
  coastDollarEs:any;
  transferModal:any = 'hide';
  tranferState:any;
  keystorePw:any;
  reciverAdd:any;
  transferNum:any;
  remarks:any;
  wei:number = Math.pow(10,18);
  txInfo:any;
  keyStore:any;
  device:any = AppConfig.deviceSys;

  web3:any = AppConfig.web3;
  contractAddress:any = AppConfig.contractAddress;
  myContract:any = AppConfig.myContract;

  constructor(public navCtrl: NavController, public navParams: NavParams,public cd: ChangeDetectorRef,public alertCtrl: AlertController) {
    this.coinName = navParams.get('coinName');
    this.coinNum = navParams.get('coinNum');
    let walletAddress = this.walletAddress = navParams.get('walletAddress');
    this.walletAddressShort = AppConfig.walletAddressShorten(walletAddress,12);

    if(this.coinName == 'ETH'){
      this.gasLimit = AppConfig.ethGasValue;
    }else if(this.coinName = 'NKN'){
      this.gasLimit = AppConfig.nknGasValue;
    }

  }

  ionViewDidLoad() {
    let that = this;
    const unit = Decimal.pow(10,9);
    const curGasPrice = new Decimal(AppConfig.curGasPrice);
    that.gasRangePrice = curGasPrice.div(unit);
  }

  ionViewWillEnter(){
    this.gasLimitChange();
    AppConfig.resetTxObj();
  }

  ionViewDidEnter(){
    this.reciverAdd = AppConfig.QRcode;
  }

  ionViewWillLeave(){
    let that = this;

    if(that.txInfo){
      AppConfig.currentTx = that.txInfo;
      AppConfig.txSend = true;

      let walletIndex = AppConfig.getStorage('walletIndex');
      let walletAccounts = JSON.parse(AppConfig.getStorage('walletAccounts'));

      if(that.coinName == 'ETH'){
        walletAccounts[walletIndex].ethTxInfo.unshift(that.txInfo);
      }else if(that.coinName = 'NKN'){
        walletAccounts[walletIndex].nknTxInfo.unshift(that.txInfo);
      }
      AppConfig.setStorage('walletAccounts',JSON.stringify(walletAccounts));
    }
  }

  ionViewDidLeave(){
    AppConfig.QRcode = '';
  }

  /* 根据用户调整gasPrice实时预估消耗ETH */
  gasLimitChange(){
    let that = this;
    const unit = Decimal.pow(10,9);
    let rangePrice = new Decimal(that.gasRangePrice);
    that.coastEtherEs = rangePrice.mul(that.gasLimit).div(unit);
    that.coastDollarEs = new Decimal(that.coastEtherEs).mul(AppConfig.ethUsdPrice);
  }

  closeModal(){
    this.transferModal = 'hide';
  }

  next(){
    var that = this;
    var addReg = /(0x)[a-zA-Z0-9]{40}/;

    if(!addReg.test(that.reciverAdd)){
      that.showAlert(AppConfig.nknCrrrentTip.transferCoin.addressRightTip,"");
      return;
    }
    if(!that.transferNum){
      that.showAlert(AppConfig.nknCrrrentTip.transferCoin.invalidAmount,"");
      return;
    }

    if(Number(that.transferNum) > Number(that.coinNum)){
      that.showAlert(AppConfig.nknCrrrentTip.transferCoin.amountLack,"");
      return;
    }

    this.transferModal = 'show';
    this.tranferState = 'confirm';
  }

  toInputPw(){
    this.tranferState = 'inputPw';
  }

  backConfirm(){
    this.tranferState = 'confirm';
  }

  /* 确认转账事件 */
  confirmToTransfer(){
    $(".transferConfirmLoading").show(10);

    var that = this;

    setTimeout(function () {
      if(!that.reciverAdd){
        that.showAlert(AppConfig.nknCrrrentTip.transferCoin.pwRequired,"");
        return;
      }

      that.decyptKeystore();
    },200)

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

  /* 解密keystore */
  decyptKeystore(){
    var that = this;
    var walletAccounts = JSON.parse(AppConfig.getStorage("walletAccounts"));
    var walletIndex = AppConfig.getStorage('walletIndex');
    var keyStore = walletAccounts[walletIndex].keyStore;

    try{
      var web3 = that.web3;
      var account = web3.eth.accounts.decrypt(keyStore,that.keystorePw);
    }
    catch(err) {
      $(".transferConfirmLoading").hide();
      that.showAlert(AppConfig.nknCrrrentTip.transferCoin.txSendFailed,AppConfig.nknCrrrentTip.common.pwWrong);
      return false;
    }

    var tx,myContract,encodeABI;
    var txGasPrice = that.gasRangePrice * Math.pow(10,9);
    var transferNumWei = new Number(that.transferNum * that.wei).toLocaleString().replace(/,/g,"");

    if(that.coinName == 'ETH'){
      tx = {
        from:that.walletAddress,
        to: that.reciverAdd,
        gas: that.gasLimit,
        value: transferNumWei,
        gasPrice:txGasPrice
      }
    }else if(that.coinName == 'NKN'){
      myContract = that.myContract;
      encodeABI = myContract.methods.transfer(that.reciverAdd,transferNumWei).encodeABI();
      tx = {
        from:that.walletAddress,
        to: that.contractAddress,
        gas: that.gasLimit,
        gasPrice:txGasPrice,
        data:encodeABI
      }
    }

    web3.eth.accounts.signTransaction(tx,account.privateKey).then(
      function (data) {
        let txInfo:any = AppConfig.newTxObj;
        txInfo.from = that.walletAddress;
        txInfo.to = that.reciverAdd;
        txInfo.value = transferNumWei;

        try {
          var tran = web3.eth.sendSignedTransaction(data.rawTransaction);
        }
        catch (error){
          $(".transferConfirmLoading").hide();
          that.showAlert(AppConfig.nknCrrrentTip.transferCoin.txFailed,error);
          return;
        }

        tran.on('transactionHash', hash => {
          console.log('hash:', hash);
          txInfo.txHash = hash;
          var curTime = new Date();
          txInfo.timeStamp = curTime.getTime();
          txInfo.txDate = AppConfig.DateFormat(curTime,'yyyy-MM-dd hh:mm:ss');
          txInfo.coinName = that.coinName;
        });

        tran.on("receipt", receipt => {
          console.log("reciept:", receipt);
          $(".transferConfirmLoading").hide();
          that.transferModal = 'success';

          txInfo.blockNumber = receipt.blockNumber;
          txInfo.memo = that.remarks;
          txInfo.minerFee = that.coastEtherEs;
          that.txInfo = txInfo;
        });

        tran.on('confirmation', (confirmationNumber, receipt) => {
          console.log('confirmation: ' + confirmationNumber);
          if(confirmationNumber < 24){
            AppConfig.confirmationNumber = confirmationNumber;
          }else {
            AppConfig.confirmationNumber = 0;
          }
        })

        tran.on('error', err =>{
          console.log(err);
          $(".transferConfirmLoading").hide();
          if(!txInfo.txHash){
            let alert1 = that.alertCtrl.create({
              title: AppConfig.nknCrrrentTip.transferCoin.txError,
              subTitle: AppConfig.nknCrrrentTip.transferCoin.txJamTip,
              buttons: [{
                text: AppConfig.nknCrrrentTip.common.ok,
                handler: () => {
                  that.navCtrl.pop();
                }
              }]
            });
            alert1.present();
          }else {
            let alert2 = that.alertCtrl.create({
              title: AppConfig.nknCrrrentTip.transferCoin.txFailed,
              subTitle: err,
              buttons: [{
                text: AppConfig.nknCrrrentTip.common.ok,
                handler: () => {
                  AppConfig.txError = true;
                }
              }]
            });
            alert2.present();
          }
        });

      },
      function (reason) {
        console.log(reason);
        $(".transferConfirmLoading").hide();
        that.showAlert(AppConfig.nknCrrrentTip.transferCoin.txFailed,reason);
      }
    );
  }

  /* 启动扫一扫功能 */
  scanQRcode(){
    this.navCtrl.push(ScanqrcodePage);
  }

}
