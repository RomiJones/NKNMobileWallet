import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the NewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {

  newList:any = [
    {
      imgUrl:"assets/nkn/news/graphic1@2x.png",
      title:'NKN Bi-weekly Report: January 15–28, 2019',
      date:"2019-01-29"
    },
    {
      imgUrl:"assets/nkn/news/graphic2@2x.png",
      title:'Releasing Meerkat, NKN’s Final Testnet',
      date:"2019-01-18"
    },
    {
      imgUrl:"assets/nkn/news/graphic3@2x.png",
      title:'Guide: NKN’s official token swap web tool',
      date:"2019-01-04"
    },
    {
      imgUrl:"assets/nkn/news/graphic4@2x.png",
      title:'Founder and CEO Stephen Wolfram Joins NKN As Technical Advisor',
      date:"2018-12-18"
    },
    {
      imgUrl:"assets/nkn/news/graphic5@2x.png",
      title:'NKN Finalist for Nokia Open Innovation Challenge 2018',
      date:"2018-12-12"
    },
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsPage');
  }

  toNewDetail(item){

  }

}
