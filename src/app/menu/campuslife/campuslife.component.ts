import { Component, OnInit } from '@angular/core';
import { NgxCarouselModule } from 'ngx-carousel';
@Component({
  selector: 'app-campuslife',
  templateUrl: './campuslife.component.html',
  styleUrls: ['./campuslife.component.css']
})
export class CampuslifeComponent implements OnInit {

  public items: Object[] = [];
  public carouselConfig:
    NgxCarouselModule;
  constructor()
  {
    this.items = [

      {

        title: '../../../assets/images/Campuslife/campuslife4.jpg',

        color: 'green'

      },

      {

        title: '../../../assets/images/Campuslife/campuslife5.jpg',

        color: 'blue'

      },

      {

        title: '../../../assets/images/Campuslife/campuslife2.jpg',

        color: 'blue'

      },

      {

        title: '../../../assets/images/Campuslife/campuslife3.jpg',

        color: 'blue'

      },
      {

        title: '../../../assets/images/Campuslife/campuslife1.jpg',

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
