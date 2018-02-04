import { Component } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  list: any;
  listAvailable = false;
  food: string;
  restaurant = {
  
    "foodWords": [],
    "location": {
      "lat":"45.5036174", 
      "lng":"-73.5798482"
    },
    "radius": 1000
  
  }

  constructor(private http: Http) {
    
  }

  getData() {
    this.http.get('http://sate.us-west-2.elasticbeanstalk.com/api/food/insertWord/').map(res => res.json()).subscribe((data) => {
      console.log(data);
      this.list = data;
      this.listAvailable = true;
    }, err => {
      console.log(err);
      this.listAvailable = false;
    })
  }

  searchFood() {
    this.restaurant.foodWords = [];
    let foodWords = this.food.split(",");
    foodWords.forEach(food => {
      this.restaurant.foodWords.push(food);
    })
    this.http.post('http://sate.us-west-2.elasticbeanstalk.com/api/food/insert/', this.restaurant).map(res => res.json()).subscribe(data => {
      this.list = data;
      this.listAvailable = true;
      console.log(data);
    }, err => {
      this.listAvailable = false;
      console.log(err);
    });
  }




}
