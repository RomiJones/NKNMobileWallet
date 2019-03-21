import { Component } from '@angular/core';
import { NavController, NavParams,AlertController } from 'ionic-angular';
import { GlobalProvider } from "../../providers/global/global";
import { AppConfig } from "../../ts/app.config";
import { Decimal } from "decimal.js";

/**
 * Generated class for the RecivecoinPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-recivecoin',
  templateUrl: 'recivecoin.html',
})
export class RecivecoinPage {

  ethNum:any;
  nknNum:any;
  coinName:any;
  walletAddress:any;
  reciveConfig:any = {
    address:"",
    type: "",
    amount: ""
  }
  isSelectType:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,public global:GlobalProvider,private alertCtrl: AlertController) {
    this.reciveConfig.type = this.coinName = navParams.get('coinName');
    this.reciveConfig.address = this.walletAddress = navParams.get('walletAddress');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecivecoinPage');
  }

  ionViewWillEnter(){
    let that = this;
    that.initWallet();
    that.initCode();
  }

  ionViewDidEnter(){

  }

  initCode(){
    let info = this.reciveConfig;
    $("#qrcode").empty().qrcode({
      render: "canvas",
      text: JSON.stringify(info)
    })
  }

  /*初始化钱包*/
  initWallet(){
    let that = this;
    const walletAccounts = JSON.parse(AppConfig.getStorage('walletAccounts'));
    const walletIndex = AppConfig.getStorage("walletIndex");
    const wallet = walletAccounts[walletIndex];
    const unit = Decimal.pow(10,18);
    that.ethNum = new Decimal(wallet.asset[0].coinNum).div(unit);
    that.nknNum = new Decimal(wallet.asset[1].coinNum).div(unit);
  }

  copyWalletAddress(){
    this.global.copyText(this.walletAddress);
  }

  selectType(type){
    let that = this;
    that.coinName = type;
    that.isSelectType = false;
  }

  inputAmount() {
    let that = this;
    let alert = that.alertCtrl.create({
      title: 'Input Amount',
      enableBackdropDismiss:false,
      inputs: [
        {
          name: 'amount',
          placeholder: 'Amount',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            that.isSelectType = false;
          }
        },
        {
          text: 'Confirm',
          handler: data => {
            that.isSelectType = false;
            that.reciveConfig.amount = data.amount;
            that.initCode();
          }
        }
      ]
    });
    alert.present();
  }

}
