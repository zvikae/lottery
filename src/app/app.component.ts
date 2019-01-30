import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'lotto';
  csvContent: string;
  numbersDict: Object;
  winNumbers: [];

  constructor() {}

  ngOnInit() {
    this.numbersDict = {};
    this.buildNumbersDictionary();
    this.winNumbers = [];
  }

  buildNumbersDictionary () {
    let index = 1;
    while (index <= 37) {
      this.numbersDict[index.toString()] = 0;
      index++;
    }
  }

  onFileLoad(fileLoadedEvent) {
    const textFromFileLoaded = fileLoadedEvent.target.result;
    this.csvContent = textFromFileLoaded;
    // alert(this.csvContent);
  }

  onFileSelect(input: HTMLInputElement) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const fileToRead = e.target.result;
      const fileRows = fileToRead.split('\r\n');
      for (let index = 1; index < 10; index++) {
        const cells = fileRows[index].split(',');
        this.formatLottoCells(cells);
      }
      // console.log('LOTTO: ', this.numbersDict);
      const bestNumbers = this.bestNumbers();
      this.winNumbers = this.randomBestNumbers(bestNumbers);
      console.log(this.winNumbers);
      input.value = '';
    };
    reader.readAsText(input.files[0]);
  }

  formatLottoCells(cells: Array<string>) {
    const cellsToParse = cells.slice(2, 8);
    for (let index = 0; index < cellsToParse.length; index++) {
      const lottoNumber = parseInt(cellsToParse[index], 10);
      this.numbersDict[lottoNumber]++;
    }
  }

  bestNumbers () {
    let items = Object.keys(this.numbersDict).map((key) => {
      return [key, this.numbersDict[key]];
    });
    items = items.filter(elem => {
      return elem[1] >= 3;
    });
    items = _.map(items, (obj) => {
      return obj[0];
    });
    return items;
  }

  sortDictionary () {
    const items = Object.keys(this.numbersDict).map((key) => {
      return [key, this.numbersDict[key]];
    });
    items.sort((a, b) => {
      return b[1] - a[1];
    });
    // console.log(items.slice(0, 5));
  }

  randomBestNumbers (bestNumbers: []) {
    const randNumbers = [];
    let index = 0;
    while (index < 6) {
      const rand = Math.floor(Math.random() * (bestNumbers.length));
      randNumbers.push(bestNumbers[rand]);
      bestNumbers.splice(rand, 1);
      index++;
    }
    return randNumbers;
  }
}
