import { Component, OnInit } from '@angular/core';
import { NgxCarouselModule } from 'ngx-carousel';
@Component({
  selector: 'app-admissions',
  templateUrl: './admissions.component.html',
  styleUrls: ['./admissions.component.css']
})
export class AdmissionsComponent implements OnInit {

  public items: Object[] = [];
  public carouselConfig:
      NgxCarouselModule;
    constructor()
    {
      this.items = [

        {

          title: '../../../assets/images/Admission/admission4.jpg',

          color: 'green'

        },

        {

          title: '../../../assets/images/Admission/admission3.jpg',

          color: 'blue'

        },

        {

          title: '../../../assets/images/Admission/admission1.jpg',

          color: 'blue'

        },
        {

          title: '../../../assets/images/Admission/admission2.jpg',

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
