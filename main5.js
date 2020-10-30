//Books API — https://developer.nytimes.com/docs/books-product/1/routes/lists.json/get

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

let books;

function preload() {
  //trends
  for (let i = 0; i < csvs.length; i++) {
    table = loadTable("trends/" + csvs[i], "csv", "header");
    tables.push(table);
  }

  $.getJSON("books.json", (data) => {
    books = data;
    console.log(books);
  });

  //load books
  //   for (let topic in bookTopics.length) {
  //     bookTable = loadTable("trends/" + bookTopics[topic], "csv", "header");
  //   }
}

function setup() {
  csvToDict();
  createCanvas(800, 4000);
  for (year in trends) {
    trends[year].render();
  }
  console.log(trends);
}

function csvToDict() {
  for (let h = 0; h < tables.length; h++) {
    table = tables[h];
    let cols = table.findRow().table.columns;
    // console.log(cols);
    let dict = new Map(); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
    let key = new Map();
    for (let i = 0; i < cols.length; i++) {
      let t = table.getColumn(cols[i]);
      // key.set(cols[i], "");
      // for (let j = 0; j < t.length; j++) {
      dict.set(cols[i], t);

      // }
    }
    trends[years[h]] = new Trend(years[h], key, dict);
    // trends.push(new Trend(years[h], key, dict));
    // trends[yearLookingFor]
    // trends.yearLookingFor
    // array[index] -> array is [1,2,3,4], array[0] = 1
    // dictionary is { 0: 500 }, d[0] = 500
    // lets say i want to access a specific year
    // loop through all of trends until trends.year == yearLookingFor
  }
  trendsLength = Object.keys(trends).length;
}

function getVals(d, s) {
  let temp = [];
  for (let [key, value] of d) {
    if (key.includes(s)) temp.push(value);
  }
  return temp;
}

class Trend {
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
        $(".trendList").append("<p>" + key[1][value] + "</p>");
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

//pull books based on set date
const getBooks = (year) => {
  for (let month = 1; month < 13; month++) {
    for (let day = 1; day < 30; day += 8) {
      if (month == 2 && day > 29) {
        day = 28;
      }
      let publishedDate =
        year + "-" + ("0" + month).slice(-2) + "-" + ("0" + day).slice(-2);

      let bookCategories = [
        "combined-print-and-e-book-fiction",
        // "combined-print-and-e-book-nonfiction",
      ];
      let bookList = [];
      // let bestSellers =
      //   "https://api.nytimes.com/svc/books/v3/lists.json?list=combined-print-and-e-book-fiction" +
      //   "&published-date=" +
      //   publishedDate +
      //   "&api-key=" +
      //   apikey;

      for (let i = 0; i < bookCategories.length; i++) {
        let bestSellers =
          "https://api.nytimes.com/svc/books/v3/lists.json?list=" +
          bookCategories[i] +
          "&published-date=" +
          publishedDate +
          "&api-key=" +
          apikey;

        let bookNum = 1;
        $.getJSON(bestSellers, function (data) {
          for (let k = 0; k < bookNum; k++) {
            let bookTitle = data.results[k].book_details[0].title;
            bookList.push(bookTitle);
            $(".bookList").append(
              "<p>" +
                bookTitle +
                "(" +
                data.results[i].published_date +
                ") " +
                "</p>"
            );
          }
        });
      }
    }
  }
};
