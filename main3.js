//Books API — https://developer.nytimes.com/docs/books-product/1/routes/lists.json/get

let articleObjs = [];
let counter = 0;
// let trends;
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
let trends = [];
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

function preload() {
  for (let i = 0; i < csvs.length; i++) {
    table = loadTable("trends/" + csvs[i], "csv", "header");
    tables.push(table);
  }
}

function setup() {
  csvToDict();
  createCanvas(800, 4000);
  for (let i = 0; i < trends.length; i++) {
    trends[i].render();
  }
  console.log(trends);
  //   pullTrends();
  getBooks();
}

function csvToDict() {
  for (let h = 0; h < tables.length; h++) {
    table = tables[h];
    let cols = table.findRow().table.columns;
    let dict = new Map(); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
    let key = new Map();
    for (let i = 0; i < cols.length; i++) {
      let t = table.getColumn(cols[i]);
      key.set(cols[i], "");
      for (let j = 0; j < t.length; j++) {
        dict.set(cols[i] + j, t[j]);
      }
    }
    trends.push(new Trend(years[h], key, dict));
  }
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
    this.keys = k;
    this.vals = d;
    this.dates = "";
    // this.x = random(width);
    // this.y = random(height);
  }
  render() {
    // text(this.id, 20, 20);
    $(".trendList").append("<h1>" + this.id + "</1>");
    for (let key of this.keys.keys()) {
      $(".trendList").append("<h2>" + key + "</h2>");

      getVals(this.vals, key);
      let temp = getVals(this.vals, key);

      for (let i = 0; i < temp.length; i++) {
        let keyWord = temp[i];
        $(".trendList").append("<p>" + keyWord + "</p>");
        // console.log(keyWord);

        articleSearch(keyWord), 2000;
        // articleSearch(keyWord);
      }
    }
  }
}

// let url =
//   "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=50IV9hFSR6GnG0NFbsvUYiCsep70Fu0n";

//copy JSON data into object
// $.getJSON("trends2.json", function (json) {
//   console.log("hello");
//   trends = json.trends;
//   let movies = trends[2006].Movies;
//   console.log(movies);
//   for (movie in movies) {
//     let movieTitle = movies[movie].title;
//     articleSearch(movieTitle);
//   }

//   //   pullTrends();
//   // articleSearch();
//   //   getBooks();
// });

// function preload() {
//   let howmany = 7; // total article num = howmany * 10;
//   let q = "trump";
//   let apikey = "4b788b42-9cb3-4832-9669-7e143cba184f";

//   for (let i = 0; i < howmany; i++) {
//     let url =
//       "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" +
//       q +
//       "&page=" +
//       i +
//       "&api-key=" +
//       apikey;
//     loadJSON(url, gotData);
//   }
// }

function articleSearch(movieTitle) {
  //q will be each trend
  let q = movieTitle.split(" ").join("%20");
  let startDate = "20150101";
  let endDate = "20151231";
  let pages = 1;
  let articleList = [];

  for (let i = 1; i < pages + 1; i++) {
    let searchedArticles =
      "https://api.nytimes.com/svc/search/v2/articlesearch.json?" +
      "begin_date=" +
      startDate +
      "&end_date=" +
      endDate +
      "&page=" +
      i +
      "&q=" +
      q +
      "&api-key=" +
      apikey;
    // const SmartQueue = require("searchedArticles");
    // const queue = new SmartQueue(config);
    // const sendMessage = (params) =>
    //   queue.request(
    //     (retry) =>
    //       axios(params)
    //         .then((response) => response.data)
    //         .catch((error) => {
    //           if (error.response.status === 429) {
    //             return retry(error.response.data.parameters.retry_after);
    //           }
    //           throw error;
    //         }),
    //     user_id,
    //     rule
    //   );
    // https://hackernoon.com/limiting-your-api-requests-the-right-way-9608b661a0ce
    $.getJSON(searchedArticles, () => afterPull(searchedArticles));
  }
}

function afterPull(data) {
  console.log(data);

  // if data is error
  // return; // do nothing

  // articleList.push(...data.response.docs);

  //figure out time stamp between two dates
  //   let months = [];
  //   for (i in articleList) {
  //     let str = articleList[i].pub_date,
  //       delimiter = "-",
  //       start = 2,
  //       tokens2 = str.split(delimiter).slice(1, start),
  //       result2 = tokens2.join(); // this

  //     //convert to num
  //     let integer = parseInt(result2, 10);
  //     months.push(integer);
  //   }
  //   let lastestMonth = Math.max(...months);
  //   let earliestMonth = Math.min(...months);
  //   //duration of this trend
  //   let totalDuration = lastestMonth - earliestMonth;
  //   console.log("hello");
  //MAP TIME BACK TO THE RELATED GOOGLE TREND
}

//pull books based on set date
const getBooks = () => {
  let publishedDate = "2015-06-02";
  let bookCategories = [
    "combined-print-and-e-book-fiction",
    "combined-print-and-e-book-nonfiction",
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

    let bookNum = 10;
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
};
