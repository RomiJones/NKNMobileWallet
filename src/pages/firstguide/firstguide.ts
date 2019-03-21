import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CreatewalletPage } from "../createwallet/createwallet";
import { ImportwalletPage } from "../importwallet/importwallet";

/**
 * Generated class for the FirstguidePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-firstguide',
  templateUrl: 'firstguide.html',
})
export class FirstguidePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    /*$("#firstText,#firstBtn").addClass("animated fadeInUp");*/
  }

  ionViewWillEnter(){
    $(".tabbar").hide();
  }

  ionViewWillLeave(){
    /*$("#firstText,#firstBtn").removeClass("animated fadeInUp");*/
  }

  toCreateWallet(){
    this.navCtrl.push(CreatewalletPage);
  }

  toImportWallet(){
    this.navCtrl.push(ImportwalletPage);
  }
}
