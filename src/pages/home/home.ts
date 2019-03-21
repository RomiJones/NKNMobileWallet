import { Component } from '@angular/core';
import { NavController,Platform,Refresher,ToastController} from 'ionic-angular';
import { CoinshowPage } from "../coinshow/coinshow";
import { AppConfig } from "../../ts/app.config";
import { ChangeDetectorRef } from '@angular/core';
import { ViewChild } from "@angular/core";
import { AppupdateProvider } from "../../providers/appupdate/appupdate";
import { GlobalProvider } from "../../providers/global/global";
import { Decimal } from "decimal.js";
import { RecivecoinPage } from "../recivecoin/recivecoin";
import { ScanqrcodePage } from "../scanqrcode/scanqrcode";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  isSelectWallet:boolean = false;
  walletAccounts:any;
  wei:number = Math.pow(10,18);
  curWalletAccount:any;
  walletName:any;
  walletAddress:any;
  walletIndex:any;
  walletIcon:any;
  lastEtherPrice:any;
  etherLastPriceUrl:any = AppConfig.ethPriceApi;
  copyBtnText:any;
  etherNum:any = '0.0000';
  nknNum:any = '0.0000';
  nknEs:any = '0.00';
  etherEs:any = '0.00';
  userTotalAssetEs:any = '0.00';

  web3:any;
  myContract:any;

  constructor(public navCtrl: NavController,public cd: ChangeDetectorRef,public platform: Platform,public appUp:AppupdateProvider,public toastCtrl: ToastController,public global:GlobalProvider) {
    AppConfig.initBasicInfo();
    AppConfig.getLastEthPrice();
  }

  @ViewChild(Refresher) refresher: Refresher;

  ionViewDidLoad(){
    this.web3 = AppConfig.web3;
    this.myContract = AppConfig.myContract;
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
    let that = this;
    that.updateAllWalletAsset();
  }

  /*初始化钱包*/
  initWallet(){
    let that = this;
    that.walletAccounts = JSON.parse(AppConfig.getStorage('walletAccounts'));
    that.walletIndex = AppConfig.getStorage("walletIndex");
    that.lastEtherPrice = AppConfig.ethUsdPrice;
    that.getWalletInfo(that.walletIndex);
  }

  /*获取当前索引钱包信息*/
  getWalletInfo(index){
    let that = this;
    AppConfig.setStorage("walletIndex",index);
    const curWallet = that.curWalletAccount = that.walletAccounts[index];
    that.walletName = curWallet.walletName;
    that.walletAddress= curWallet.walletAddress;
    that.walletIcon = curWallet.imgUrl;

    if(that.isSelectWallet){
      that.isSelectWallet = false;
      that.refresher._beginRefresh();
    }else{
      that.getLastAsset();
    }
  }

  /* 查询ETH价格 */
  getLastEtherPrice(){
    var that = this;
    var priceUrl = that.etherLastPriceUrl;
    $.ajax({
      type:"GET",
      url:priceUrl,
      success:function (res) {
        AppConfig.ethUsdPrice = that.lastEtherPrice = res.result.ethusd;
        AppConfig.setStorage("etherPrice",that.lastEtherPrice);

        that.getLastEthAsset();
      },
      error:function (err) {
        that.ajaxFailToRefreshEthNum();
        console.log("ajax请求ETH失败："+err);
      },
      complete:function(){
        that.refresher.complete();
      }
    })
  }

  /* 用户下拉刷新事件 */
  doRefresh(refresher) {
    var that = this;
    that.getLastAsset();

    //检测APP是否更新
    /*that.appUp.detectionUpgrade();*/
  }

  /*获取最新资产数据*/
  getLastAsset(){
    let that = this;
    that.getLastNknAsset();
    that.getLastEtherPrice();
  }

  /* 跳转NKN资产*/
  toCoinShowPageNKN(){
    this.navCtrl.push(CoinshowPage,{
      coinName: 'NKN',
      coinNum: this.nknNum,
      walletAddress: this.walletAddress,
      assetEs: this.nknEs,
      walletIndex: this.walletIndex,
      walletName:this.walletName,
      walletIcon:this.walletIcon
    });
  }

  /*跳转ETH资产*/
  toCoinShowPageETH(){
    this.navCtrl.push(CoinshowPage,{
      coinName: 'ETH',
      coinNum: this.etherNum,
      walletAddress: this.walletAddress,
      assetEs: this.etherEs,
      walletIndex: this.walletIndex,
      walletName:this.walletName,
      walletIcon:this.walletIcon
    });
  }

  /* 显示钱包地址二维码 */
  showQRcode(){
    var that = this;
    that.navCtrl.push(RecivecoinPage,{
      coinName: 'ETH',
      walletAddress :that.walletAddress
    })
  }

  /* 查询ETH成功页面数据处理 */
  ajaxSuccessEthNum(value){
    let that = this;
    that.calcCurWalletEthAsset(value);
    that.curWalletAccount.asset[0].coinNum = value;
    that.totalAssetEs();
  }

  /* 查询ETH失败页面数据处理 */
  ajaxFailToRefreshEthNum(){
    let that = this;
    let ethNum = that.curWalletAccount.asset[0].coinNum;
    that.calcCurWalletEthAsset(ethNum);
    that.totalAssetEs();
  }

  /*计算ETH资产*/
  calcCurWalletEthAsset(num){
    let that = this;
    const x = new Decimal(num);
    that.etherNum = x.div(that.wei).toFixed(4);
    that.etherEs = new Decimal(that.etherNum).mul(that.lastEtherPrice).toFixed(2);
  }

  /* 当前钱包总资产计算 */
  totalAssetEs(){
    let x = new Decimal(this.etherEs);
    let y = new Decimal(this.nknEs);
    this.userTotalAssetEs = x.plus(y).toFixed(2);
    this.cd.detectChanges();
  }

  /* 获取当前钱包NKN资产 */
  getLastNknAsset(){
    let that = this;
    let myContract = that.myContract;

    myContract.methods.balanceOf(that.walletAddress).call(null,function (error, result) {
      if(!error){
        that.nknNum = new Decimal(result).div(that.wei).toFixed(4);
      }else{
        const nknNum = that.curWalletAccount.asset[1].coinNum;
        that.nknNum = new Decimal(nknNum).div(that.wei).toFixed(4);
        console.log(error);
      }
      that.nknEs = new Decimal(that.nknNum).mul(AppConfig.nknPrice).toFixed(2);
      that.totalAssetEs();
    })
  }

  /* 获取当前钱包ETH资产 */
  getLastEthAsset(){
    let that = this;
    let web3 = that.web3;

    web3.eth.getBalance(that.walletAddress).then(function (value) {
      that.ajaxSuccessEthNum(value);
    },function (err) {
      that.ajaxFailToRefreshEthNum();
      console.log(err);
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
    const etherEs = new Decimal(wallet.ethCoinNum).mul(that.lastEtherPrice).toFixed(2);
    const nknEs = new Decimal(wallet.nknCoinNum).mul(AppConfig.nknPrice).toFixed(2);
    const total = new Decimal(etherEs).plus(nknEs).toFixed(2);
    wallet.assetEsTotal = total;
  }

  /* 复制钱包地址 */
  copyWalletAddress(){
    let that = this;
    that.global.copyText(that.walletAddress);
  }

  /* 显示列表 */
  showWalletList(){
    let that = this;
    that.isSelectWallet = true;
    $(".tabbar").hide();
    that.updateAllWalletAsset();
  }

  /* 切换钱包 */
  selectWallet(index){
    this.getWalletInfo(index);
    $(".tabbar").show();
  }

  /* 启动扫一扫功能 */
  scanQRcode(){
    this.navCtrl.push(ScanqrcodePage,{},{
      animate:false
    });
  }
}
