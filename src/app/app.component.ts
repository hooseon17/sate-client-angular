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

  lat: any;
  lng: any;

  autoTicks = false;
  disabled = false;
  invert = false;
  max = 25;
  min = 0.5;
  showTicks = false;
  step = 0.5;
  thumbLabel = false;
  radius = 1;
  vertical = false;
  states = {
    START:"What do you feel like eating today?",
    CHECK:"Let me see what I can find.",
    FOUND:"Scroll down to see what I found for you, let me know if you would like anything else!",
    UNSURE:"I couldn't find any food related words in your sentence, could you please rewrite just the food words separated by commas? I'm still learning!",
    ERROR:"Something went wrong, try again in a little bit."
}

  placeholders = {
    START:"Try something like 'I would like to eat pizza but my buddy wants sushi'",
    UNSURE:"For example 'pizza, sushi, chicken'"
  }

  placeholder = this.placeholders.START;
  chatbot = this.states.START;


  descendingRating = true;
  ascendingDistance = true;
  descendingOpen = true;

  audio_stream: any;

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
      "lat":"", 
      "lng":""
    },
    "radius": 1
  
  }

  convo = {
  
    "conversation": "",
    "location": {
      "lat":"", 
      "lng":""
    },
    "radius": 1
  
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
    window.open('https://www.google.ca/maps/dir/' + this.lat + ',' + this.lng + '/' + parameter.split(' ').join('+'));
    //window.open('https://www.google.com/maps/search/?api=1&query=' + parameter.split(' ').join('+'));
  }

  searchGoogle(parameter) {
    window.open('https://www.google.com/search?&q=' + parameter.split(' ').join('+'));
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

  chat() {
    if (this.chatbot === this.states.START){
      this.placeholder = this.placeholders.START;
      this.conversate();
    } else if (this.chatbot === this.states.CHECK) {
      this.placeholder = this.placeholders.START;
      this.chatbot = this.states.FOUND;
    } else if (this.chatbot === this.states.FOUND) {
      this.placeholder = this.placeholders.START;
      this.conversate();
    } else if (this.chatbot === this.states.UNSURE) {
      this.placeholder = this.placeholders.START;
      this.searchFood();
    } else if (this.chatbot === this.states.ERROR) {
      this.placeholder = this.placeholders.START;
      this.chatbot = this.states.START;
      this.conversate();
    } else {
      this.placeholder = this.placeholders.START;
      alert('Something went seriously wrong')
    }
    this.food = "";
  }

  searchFood() {
    this.restaurant.foodWords = [];
    let foodWords = this.food.split(",");
    foodWords.forEach(food => {
      this.restaurant.foodWords.push(food.trim());
    })
    this.restaurant.radius = this.radius * 1000;
    this.restaurant.location.lat = this.lat;
    this.restaurant.location.lng = this.lng;

    this.http.post('http://sate.us-west-2.elasticbeanstalk.com/api/food/insert/', this.restaurant).map(res => res.json()).subscribe(data => {
      if (data.length == 0) this.chatbot = this.states.ERROR;
      else {
        this.chatbot = this.states.FOUND
        this.list = data;
        this.listAvailable = true;
        console.log(data);
      }
    }, err => {
      this.listAvailable = false;
      console.log(err);
    });
  }

  conversate() {
    this.convo.conversation = this.food;
    this.convo.radius = this.radius * 1000;
    this.convo.location.lat = this.lat;
    this.convo.location.lng = this.lng;

    this.http.post('http://sate.us-west-2.elasticbeanstalk.com/api/food/textConversation/', this.convo).map(res => res.json()).subscribe(data => {
      if (data.length == 0) {
        this.chatbot = this.states.UNSURE;
        this.placeholder = this.placeholders.UNSURE;
      }
      else {
        this.chatbot = this.states.FOUND
        this.list = data;
        this.listAvailable = true;
        console.log(data);
      }
    }, err => {
      this.listAvailable = false;
      console.log(err);
    });
  }

  startRecording() {
    navigator.getUserMedia({audio: true}, function (stream) {
      this.audio_stream = stream;
    }, function (e) {

    })
  }




}
