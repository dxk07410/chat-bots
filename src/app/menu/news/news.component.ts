import { Component, OnInit } from '@angular/core';
import { NgxCarouselModule } from 'ngx-carousel';
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  public items: Object[] = [];
  public carouselConfig:
  NgxCarouselModule;
  constructor() {
    this.items = [

      {

        title: '../../../assets/images/slider/news4.jpg',

        color: 'green'

      },

      {

        title: '../../../assets/images/slider/news2.jpg',

        color: 'blue'

      },

      {

        title: '../../../assets/images/slider/news3.jpg',

        color: 'blue'

      }

    ]


    this.carouselConfig = {

      grid: {
        xs:
        1, sm:
        1, md:
        3, lg:
        1, all:
        0
      },

      slide: 1,

      speed: 400,

      interval:
      6000,

      point: {

        visible:
        true

      },

      loop: true,

      touch: true

    };

  }
  ngOnInit() {
  }
}
