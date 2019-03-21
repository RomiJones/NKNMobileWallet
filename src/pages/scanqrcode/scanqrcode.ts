import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { ToastController } from "ionic-angular";
import { ModalController } from 'ionic-angular';
import { ChangeDetectorRef } from '@angular/core';
import { AppConfig } from "../../ts/app.config";

/**
 * Generated class for the ScanqrcodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-scanqrcode',
  templateUrl: 'scanqrcode.html',
})
export class ScanqrcodePage {

  light: boolean = false;
  frontCamera: boolean = false;
  coinName:any;
  coinNum:any;
  walletAddress:any;
  askForScanTip:any = AppConfig.nknCrrrentTip.scanQRcode.askForScan;

  constructor(public navCtrl: NavController, public navParams: NavParams,private qrScanner: QRScanner,private toastCtrl: ToastController,public modalCtrl: ModalController,public cd: ChangeDetectorRef) {
    this.coinName = navParams.get('coinName');
    this.coinNum = navParams.get('coinNum');
    this.walletAddress = navParams.get("walletAddress");
  }

  ngOnInit(){

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanqrcodePage');
  }

  ionViewWillEnter(){
    var that = this;
    $(".tabbar").hide();

    that.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          window.document.querySelector('body').classList.add('transparent-body');

          // start scanning
          let scanSub = that.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);

            AppConfig.QRcode = text;

            that.qrScanner.hide(); // hide camera preview
            that.qrScanner.destroy();
            scanSub.unsubscribe(); // stop scanning
            that.navCtrl.pop({animate:false});
          });

          // show camera preview
          that.qrScanner.show();

        } else if(status.denied){
          that.presentToast(that.askForScanTip);
          that.navCtrl.pop({animate:false});
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
          that.navCtrl.pop({animate:false});
        }
      })
      .catch((e: any) => function(){
        that.presentToast(e);
        that.navCtrl.pop({animate:false});
      });
  }

  ionViewDidEneter(){
    window.document.querySelector('body').classList.add('transparent-body');
  }

  ionViewWillLeave(){
    $(".tabbar").show();
    window.document.querySelector('body').classList.remove('transparent-body');
  }

  ionViewDidLeave(){
    var that = this;
    that.qrScanner.hide(); // hide camera preview
    that.qrScanner.destroy();
  }

  toggleLight(){
    if (this.light) {
      this.qrScanner.disableLight();
    } else {
      this.qrScanner.enableLight();
    }
    this.light = !this.light;
    this.cd.detectChanges();
  }

  toggleCamera() {
    if (this.frontCamera) {
      this.qrScanner.useBackCamera();
    } else {
      this.qrScanner.useFrontCamera();
    }
    this.frontCamera = !this.frontCamera;
    this.cd.detectChanges();
  }

  presentToast(res) {
    let toast = this.toastCtrl.create({
      message: res,
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }

  navBack(){
    this.navCtrl.pop({animate:false});
  }

}
