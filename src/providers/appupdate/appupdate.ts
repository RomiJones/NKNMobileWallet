import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform,AlertController } from "ionic-angular";
import { File } from "@ionic-native/file";
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FileOpener } from "@ionic-native/file-opener";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { AppVersion } from "@ionic-native/app-version";
import { ToastController } from "ionic-angular";
import { AppConfig } from "../../ts/app.config";

/*
  Generated class for the AppupdateProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class AppupdateProvider {

  /* nkn app最新版本请求接口 */
  appVersionUrl:any = 'https://api.nkn.com/api2/wallet/getcoin?version=';

  /* 当前app版本 */
  curAppVersion:any;

  /* 服务器最新版本 */
  serviceAppVersion:any;

  /* app下载地址 */
  appDownloadUrl:any;

  constructor(public http: HttpClient, private platform: Platform, private alertCtrl: AlertController, private transfer: FileTransfer, private appVersion: AppVersion, private file: File, private fileOpener: FileOpener, private inAppBrowser: InAppBrowser,private toastCtrl: ToastController) {

  }

  /**
   * 检查app是否需要升级
   */
  detectionUpgrade() {
    let that = this;

    //当前app版本
    that.appVersion.getVersionNumber().then(function(res:any){
      that.curAppVersion = AppConfig.appVersion = res;
      that.isUpdate();
    });

  }

  /**
   * 下载安装app
   */
  downloadApp() {
    var that = this;
    if (that.isAndroid()) {
      that.file.createDir(that.file.externalRootDirectory,'nknDownload',true).then(function () {
        let alert = that.alertCtrl.create({
          title: '下载进度：0%',
          enableBackdropDismiss: false,
          buttons: ['后台下载']
        });

        const fileTransfer: FileTransferObject = that.transfer.create();
        let apkPath = that.file.externalRootDirectory + 'nknDownload/';
        const apk = apkPath + 'nkn-android-V' + that.serviceAppVersion + ".apk"; //apk保存的目录

        let androidAppUrl = that.appDownloadUrl;
        fileTransfer.download(androidAppUrl, apk).then(() => {

          that.fileOpener.open(apk,'application/vnd.android.package-archive').then(res=>{
            //成功打开apk文件
            console.log(res);
          }).catch(err=>{
            //打开apk文件失败
            that.showToast("安装失败");
          });

        }).catch(()=>{
          alert.dismiss();
          that.showToast("下载失败,请重启APP更新");
        });

        fileTransfer.onProgress((event: ProgressEvent) => {
          let num = Math.floor(event.loaded / event.total * 100);
          num && alert.present();
          if (num === 100) {
            alert.dismiss();
          } else {
            $(".alert-title").eq(0).text("下载进度："+ num + '%');
          }
        });

      }).catch(function () {
        that.showToast("请允许NKN访问您设备上文件，否则无法更新");
      })

    }
    if (that.isIos()) {
      let iosUrl = that.appDownloadUrl;
      this.openUrlByBrowser(iosUrl);
    }
  }

  /**
   * 通过浏览器打开url
   */
  openUrlByBrowser(url:string):void {
    this.inAppBrowser.create(url, '_system');
  }

  /**
   * 是否真机环境
   * @return {boolean}
   */
  isMobile(): boolean {
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  /**
   * 是否android真机环境
   * @return {boolean}
   */
  isAndroid(): boolean {
    return this.isMobile() && this.platform.is('android');
  }

  /**
   * 是否ios真机环境
   * @return {boolean}
   */
  isIos(): boolean {
    return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
  }

  /**
   * 获得app版本号,如0.01
   * @description  对应/config.xml中version的值
   * @returns {Promise<string>}
   */
  getVersionNumber(): Promise<string> {
    return new Promise((resolve) => {
      this.appVersion.getVersionNumber().then((value: string) => {
        resolve(value);
      }).catch(err => {
        console.log('getVersionNumber:' + err);
      });
    });
  }

  /* 显示测试信息 */
  showToast(res){
    let toast = this.toastCtrl.create({
      message: res,
      duration: 5000,
      position: 'top'
    });

    toast.present();
  }

  /* 请求服务器是否升级 */
  isUpdate(){
    let that = this;
    $.ajax({
      url: that.appVersionUrl + that.curAppVersion,
      type:'GET',
      success:function (res) {
        /**
         * nkn价格默认取全网平均值
         * list[0]对应全网数据，price 对应当前人民币价格，price_usd 对应当前美元价格
         * */
        AppConfig.nknPrice= Number(res.data.coinInfo.list[0].price).toFixed(4);
        AppConfig.setStorage('nknPrice',AppConfig.nknPrice);

        let isUpdate:boolean = res.data.update;
        if(isUpdate){
          that.appDownloadUrl = res.data.appInfo.url;
          that.serviceAppVersion = res.data.appInfo.version;

          let appUpAlert = that.alertCtrl.create({
            title: '升级',
            subTitle: '发现新版本,请立即升级',
            enableBackdropDismiss: false,
            buttons: [
              {
                text: '确定',
                handler: () => {
                  appUpAlert.dismiss();
                  that.downloadApp();
                }
              }
            ]
          })
          appUpAlert.present();
        }
      }

    })
  }
}
