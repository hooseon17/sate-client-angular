import { Component } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {MatSlider} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  lat: any = 45.5036174;
  lng: any = -73.5798482;

  autoTicks = false;
  disabled = false;
  invert = false;
  max = 5000;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  radius = 500;
  vertical = false;

  descendingRating = true;
  ascendingDistance = true;
  descendingOpen = true;

  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
  }
  set tickInterval(v) {
    this._tickInterval = Number(v);
  }
  private _tickInterval = 1;

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
    this.getLocation();
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));
  }

  showPosition(position) {
    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;
  }

  launchMapUrl(parameter) {
    window.open('https://www.google.com/maps/search/?api=1&query=' + parameter.split(' ').join('+'));
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

  sortRestaurants(option) {
    if (option == "rating") {
      if (this.descendingRating) {
        this.list.sort(function(a, b){
          if(a.rating > b.rating) return -1;
          if(a.rating < b.rating) return 1;
          return 0;
        });
        this.descendingRating = false;
      }
      else {
        this.list.sort(function(a, b){
          if(a.rating < b.rating) return -1;
          if(a.rating > b.rating) return 1;
          return 0;
        });
        this.descendingRating = true;
      }
    }
    else if (option == "distance") {
      if (this.ascendingDistance) {
        this.list.sort(function(a, b){
          if(a.distance < b.distance) return -1;
          if(a.distance > b.distance) return 1;
          return 0;
        });
        this.ascendingDistance = false;
      }
      else {
        this.list.sort(function(a, b){
          if(a.distance > b.distance) return -1;
          if(a.distance < b.distance) return 1;
          return 0;
        });
        this.ascendingDistance = true;
      }
    }
    else if (option == "open") {
      if (this.descendingOpen) {
        this.list.sort(function(a, b){
          if(a.open > b.open) return -1;
          if(a.open < b.open) return 1;
          return 0;
        });
        this.descendingOpen = false;
        
      }
      else {
        this.list.sort(function(a, b){
          if(a.open < b.open) return -1;
          if(a.open > b.open) return 1;
          return 0;
        });
        this.descendingOpen = true;
      }
    }
  }

  searchFood() {
    this.restaurant.foodWords = [];
    let foodWords = this.food.split(",");
    foodWords.forEach(food => {
      this.restaurant.foodWords.push(food);
    })
    this.restaurant.radius = this.radius;
    this.restaurant.location.lat = this.lat;
    this.restaurant.location.lng = this.lng;

    this.http.post('http://sate.us-west-2.elasticbeanstalk.com/api/food/insert/', this.restaurant).map(res => res.json()).subscribe(data => {
      if (data.length == 0) alert("No restaurants found! Try increasing the radius.");
      else {
        this.list = data;
        this.listAvailable = true;
        console.log(data);
      }
    }, err => {
      this.listAvailable = false;
      console.log(err);
    });
  }




}
