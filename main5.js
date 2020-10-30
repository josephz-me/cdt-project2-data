//Books API — https://developer.nytimes.com/docs/books-product/1/routes/lists.json/get
// https://developers.google.com/books/docs/v1/reference/?apix=true#volume
// https://developers.google.com/books/docs/v1/using#PerformingSearch
// https://www.googleapis.com/books/v1/volumes?q=Ruthless%20American%20Marriage

let articleObjs = [];
let articleList = [];
let counter = 0;
let apikey = "dPxVkGTEZ2h4KpgLTnwr6TziqqeoQspR";

let table;
let tables = [];
let years = [
  2006,
  2007,
  2008,
  2009,
  2011,
  2012,
  2013,
  2014,
  2015,
  2016,
  2017,
  2018,
  2019,
];

let trends = {};
let trendsLength;
let csvs = [
  "2006.csv",
  "2007.csv",
  "2008.csv",
  "2009.csv",
  "2011.csv",
  "2012.csv",
  "2013.csv",
  "2014.csv",
  "2015.csv",
  "2016.csv",
  "2017.csv",
  "2018.csv",
  "2019.csv",
];

let keywordTable;
let books;

function preload() {
  //load trend-keywords
  keywordTable = loadTable("trends/trend-keywords.csv", "csv");

  //load actual trends
  for (let i = 0; i < csvs.length; i++) {
    table = loadTable("trends/" + csvs[i], "csv", "header");
    tables.push(table);
  }
  //load books
  $.getJSON("books.json", (data) => {
    books = data;
    console.log;
  });
}

let trendToKeywords = {};
function setup() {
  createCanvas(800, 4000);

  for (let r = 0; r < keywordTable.getRowCount(); r++) {
    let key = keywordTable.getString(r, 0);
    let value = keywordTable.getString(r, 1);
    trendToKeywords[key] = value;
  }
  csvToDict();
  for (year in trends) {
    trends[year].render();
  }
}

function csvToDict() {
  for (let h = 0; h < tables.length; h++) {
    table = tables[h];
    let cols = table.findRow().table.columns;
    // console.log(cols);
    let dict = new Map(); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
    let key = new Map();
    for (let i = 0; i < cols.length; i++) {
      let trendNameArr = table.getColumn(cols[i]);
      let trendArr = [];
      for (let j = 0; j < trendNameArr.length; j++) {
        trendName = trendNameArr[j];
        let trendObj = { name: trendName, val: "null" };
        if (trendName in trendToKeywords) {
          trendObj.val = trendToKeywords[trendName];
        }
        trendArr.push(trendObj);
      }
      dict.set(cols[i], trendArr);
    }
    trends[years[h]] = new TrendYear(years[h], key, dict);
  }
}

function getVals(d, s) {
  let temp = [];
  for (let [key, value] of d) {
    if (key.includes(s)) temp.push(value);
  }
  return temp;
}

class TrendYear {
  constructor(y, k, d) {
    this.id = y;
    this.vals = d;
  }
  render() {
    let year = this.id;
    $(".trendList").append("<h1>" + year + "</1>");
    for (let key of this.vals) {
      $(".trendList").append("<h3>" + key[0] + "</h3>");
      for (let value in key[1]) {
        $(".trendList").append("<p>" + key[1][value].name + "</p>");
      }
    }
    //get books
    // getBooks(year);
  }
  //   articleSearch(movieTitle, year) {
  //     //q will be each trend
  //     let q = movieTitle.split(" ").join("%20");
  //     let startDate = year + "0101";
  //     let endDate = year + "1231";
  //     let pages = 1;

  //     for (let i = 1; i < pages + 1; i++) {
  //       let searchedArticles =
  //         "https://api.nytimes.com/svc/search/v2/articlesearch.json?" +
  //         "begin_date=" +
  //         startDate +
  //         "&end_date=" +
  //         endDate +
  //         "&page=" +
  //         i +
  //         "&q=" +
  //         q +
  //         "&api-key=" +
  //         apikey;

  //       // https://hackernoon.com/limiting-your-api-requests-the-right-way-9608b661a0ce
  //https://en.wikipedia.org/wiki/The_New_York_Times_Fiction_Best_Sellers_of_2019
  //       $.getJSON(searchedArticles, (data) => this.afterPull(data));
  //     }
  //   }
  //   afterPull(data) {
  //     articleList.push(...data.response.docs);
  //     //figure out time stamp between two dates
  //     let months = [];
  //     for (let i in articleList) {
  //       let str = articleList[i].pub_date,
  //         delimiter = "-",
  //         start = 2,
  //         tokens2 = str.split(delimiter).slice(1, start),
  //         result2 = tokens2.join(); // this

  //       //convert to num
  //       let integer = parseInt(result2, 10);
  //       months.push(integer);
  //     }
  //     let lastestMonth = Math.max(...months);
  //     let earliestMonth = Math.min(...months);

  //     //duration of this trend
  //     let totalDuration = lastestMonth - earliestMonth;
  //     if (isFinite(totalDuration)) {
  //       // console.log(this.id);
  //       this.dates = earliestMonth;
  //       console.log(trends);
  //       //MAP TIME BACK TO THE RELATED GOOGLE TRENDs
  //     }
  //   }
}
