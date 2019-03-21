import { Component } from '@angular/core';
import { Clipboard } from '@ionic-native/clipboard';
import { AppConfig } from "../../ts/app.config";

/**
 * Generated class for the WalletqrcodeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'walletqrcode',
  templateUrl: 'walletqrcode.html',
})
export class WalletqrcodeComponent {
  copyBtnText:any = '复制收款地址';
  walletName:any;
  walletAddress:any;

  constructor(private clipboard: Clipboard) {
    console.log('Hello WalletqrcodeComponent Component');

    let walletAccounts = JSON.parse(AppConfig.getStorage('walletAccounts'));
    let walletIndex = AppConfig.getStorage("walletIndex");
    this.walletName = walletAccounts[walletIndex].walletName;
    this.walletAddress = walletAccounts[walletIndex].walletAddress;
  }

  /* 隐藏钱包地址二维码 */
  hideQRcode(){
    $(".walletAddressQRcodeBox").fadeOut("fast");
    $(".tabbar").show();
    $(".walletQRcode>div").empty();
  }

  /* 复制钱包地址 */
  copyReciveAddress(){
    var that = this;
    that.clipboard.copy(that.walletAddress).then(
      function (data) {
        that.copyBtnText = '已复制';
        setTimeout(function () {
          that.copyBtnText = '复制收款地址';
        },2000)
      },
      function (error) {
        console.log(error);
      }
    )
  }

}
