import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TransfercoinPage } from "../transfercoin/transfercoin";
import { AppConfig } from "../../ts/app.config";
import { ChangeDetectorRef } from '@angular/core';
import { Clipboard } from '@ionic-native/clipboard';
import {RecivecoinPage} from "../recivecoin/recivecoin";
import {TxdetailPage} from "../txdetail/txdetail";

@Component({
  selector: 'page-coinshow',
  templateUrl: 'coinshow.html',
})
export class CoinshowPage {

  txTypeIndex:any = 0;
  txTypeArray:any = ['All','Out','Failed'];
  coinName:any;
  coinNum:any;
  walletAddress:any;
  walletIndex:any;
  walletName:any;
  walletIcon:any;
  coinAssetEs:any;
  wei:number = Math.pow(10,18);
  txInfo:any = [];
  lastTxHash:any;
  txError:any;
  lastConfirmNum:any = 0;
  copyBtnText:any = AppConfig.nknCrrrentTip.common.copyAddress;
  web3:any = AppConfig.web3;
  myContract:any = AppConfig.myContract;

  constructor(public navCtrl: NavController, public navParams: NavParams,public cd: ChangeDetectorRef,private clipboard: Clipboard) {
    this.coinName = navParams.get('coinName');
    this.coinNum = navParams.get('coinNum');
    this.walletAddress = navParams.get('walletAddress');
    this.coinAssetEs = navParams.get('assetEs');
    this.walletIndex = navParams.get('walletIndex');
    this.walletName = navParams.get('walletName');
    this.walletIcon = navParams.get('walletIcon');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CoinshowPage');
  }

  ionViewWillEnter(){
    let that = this;
    that.txInfoShow();

    if(AppConfig.txSend){
      that.lastTxHash = AppConfig.currentTx.txHash;
      that.receptConfirmNum();
    }

    AppConfig.getCurrentGasPrice();
  }

  ionViewDidEnter(){
    let that = this;

    let timer = setInterval(function () {
      if(AppConfig.txError){
        that.lastTxHash = '';
        that.txError = AppConfig.currentTx.txHash;
        clearInterval(timer);
      }
    },10000)

    that.confirmTxStatus();
  }

  ionViewWillLeave(){
    this.confirmTxStatus();
  }

  ionViewDidLeave(){
    AppConfig.txSend = AppConfig.txError = false;
    AppConfig.currentTx = '';
  }

  /*切换数据类型*/
  switchTxType(index){
    let that = this;
    that.txTypeIndex = index;
    switch (index) {
      case 0:
        $(".txItem").show();
        break;
      case 1:
        $(".txItem").hide();
        $(".txItem.out").show();
        break;
      case 2:
        $(".txItem").hide();
        $(".txItem.failed").show();
        break;
    }
  }

  /* 查询待确认交易状态 */
  confirmTxStatus(){
    let that = this;
    let walletAccounts:any = JSON.parse(AppConfig.getStorage('walletAccounts'));
    let curWallet = walletAccounts[that.walletIndex];
    let curWaitTx;

    if(that.coinName == 'ETH'){
      curWaitTx = curWallet.ethTxInfo;
    }else if(that.coinName == 'NKN'){
      curWaitTx = curWallet.nknTxInfo;
    }

    for(let i=0;i<curWaitTx.length;i++){
      let temp = curWaitTx[i];

      if(temp.isConfirmTx) continue;

      that.web3.eth.getTransactionReceipt(temp.txHash).then(res=>{
        if(!res.status){
          temp.status = false;
          temp.isConfirmTx = true;
        }
        if(that.coinName == 'ETH'){
          walletAccounts[that.walletIndex].ethTxInfo[i] = temp;
        }else if(that.coinName == 'NKN'){
          walletAccounts[that.walletIndex].nknTxInfo[i] = temp;
        }

        AppConfig.setStorage('walletAccounts',JSON.stringify(walletAccounts));
      })
    }

  }

  /* 交易历史数据处理 */
  txInfoShow(){
    let that = this;
    let walletIndex = AppConfig.getStorage('walletIndex');
    let walletAccounts = JSON.parse(AppConfig.getStorage('walletAccounts'));
    let txInfo:any;
    if(that.coinName == 'ETH'){
      txInfo = walletAccounts[walletIndex].ethTxInfo;
    }else if(that.coinName = 'NKN'){
      txInfo = walletAccounts[walletIndex].nknTxInfo;
    }

    for(let item of txInfo){
      item.addressShorten = AppConfig.walletAddressShorten(item.to,10);
      item.txValue = (Number(item.value) / that.wei).toFixed(4);
    }

    that.txInfo = txInfo;
  }

  /* 待打包交易信息确认处理 */
  receptConfirmNum(){
    var that = this;
    var range,lastNum;
    var timer = setInterval(function () {
      lastNum = AppConfig.confirmationNumber;
      if(lastNum < 12){
        that.lastConfirmNum = lastNum;
        range = lastNum * 8.34;
        $(".curConfirmNum").css("width",range+'%');
      }else {
        that.lastConfirmNum = 12;
        $(".curConfirmNum").css("width",'100%');
        clearInterval(timer);
        AppConfig.txSend = false;
        setTimeout(function () {
          that.lastTxHash = '';
          that.lastConfirmNum = 0;
          if(that.coinName == 'ETH'){
            that.web3.eth.getBalance(that.walletAddress).then(function (res) {
              that.refreshEth(res);
            })
          }else if(that.coinName = 'NKN'){
            that.myContract.methods.balanceOf(that.walletAddress).call(null,function (error, result) {
              if(!error){
                that.coinNum = (result / that.wei).toFixed(4);
              }else{
                console.log(error);
              }
            })
          }
        },500)
      }
    },5000)
  }

  /* 手动刷新数据 */
  doRefresh(refresher){
    var that = this;
    if(that.coinName == 'ETH'){
      that.web3.eth.getBalance(that.walletAddress).then(function (res) {
        that.refreshEth(res);
        refresher.complete();
      },function (err) {
        refresher.complete();
        console.log(err);
      })
    }else if(that.coinName = 'NKN'){
      that.myContract.methods.balanceOf(that.walletAddress).call(null,function (error, result) {
        if(!error){
          that.resfreshNkn(result);
          refresher.complete();
        }else{
          console.log(error);
          refresher.complete();
        }
      })
    }

    that.cd.detectChanges();
  }

  /* 查询ETH成功页面数据处理 */
  refreshEth(data){
    var that = this;
    var lastEtherPrice = AppConfig.getStorage('etherPrice');
    that.coinNum = (data / that.wei).toFixed(4);
    that.coinAssetEs = (Number(that.coinNum) * Number(lastEtherPrice)).toFixed(2);

    that.cd.detectChanges();
  }

  /* 查询NKN成功页面数据处理 */
  resfreshNkn(data){
    var that = this;
    that.coinNum = (data / that.wei).toFixed(4);
    that.coinAssetEs = (Number(that.coinNum) * AppConfig.nknPrice).toFixed(2);
    that.cd.detectChanges();
  }


  /* 转账按钮事件 */
  toTransferCoin(){
    var that = this;
    that.navCtrl.push(TransfercoinPage, {
      coinName:  that.coinName,
      coinNum: that.coinNum,
      walletAddress: that.walletAddress
    });
  }

  /* 显示收款地址二维码 */
  showReceiveCode(){
    this.navCtrl.push(RecivecoinPage);
  }

  /* 隐藏钱包地址二维码 */
  hideQRcode(){
    $(".walletAddressQRcodeBox").hide();
    $(".tabbar").show();
    $(".walletQRcode>div").empty();
  }

  /* 复制钱包地址 */
  copyReciveAddress(){
    var that = this;
    that.clipboard.copy(that.walletAddress).then(
      function (data) {
        that.copyBtnText = AppConfig.nknCrrrentTip.common.copied;
        setTimeout(function () {
          that.copyBtnText = AppConfig.nknCrrrentTip.common.copyAddress;
        },2000)
      },
      function (error) {
        console.log(error);
      }
    )
  }

  /* 查询交易明细 */
  checkDetail(item){
    this.navCtrl.push(TxdetailPage,{
      tx:item
    })
  }

}
