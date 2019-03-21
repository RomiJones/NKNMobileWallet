import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TxdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-txdetail',
  templateUrl: 'txdetail.html',
})
export class TxdetailPage {

  tx:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.tx = this.navParams.get('tx');
    console.log(this.tx);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TxdetailPage');
  }

}
