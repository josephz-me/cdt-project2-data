//Books API — https://developer.nytimes.com/docs/books-product/1/routes/lists.json/get

let articleObjs = [];
let counter = 0;
let trends;
let apikey = "dPxVkGTEZ2h4KpgLTnwr6TziqqeoQspR";

let url =
  "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=50IV9hFSR6GnG0NFbsvUYiCsep70Fu0n";

//copy JSON data into object
$.getJSON("trends.json", function (json) {
  trends = json.trends;
  pullTrends();
  articleSearch();
  getBooks();
});

//pull list of trends from JSON list
const pullTrends = () => {
  for (var i = 0; i < trends.length; i++) {
    $(".trendList").append("<h1>" + trends[i].Year + "</h1>");
    for (key in trends[i]) {
      if (key !== "Year") {
        $(".trendList").append("<h2>" + key + "</h2>");
        for (value in trends[i][key]) {
          $(".trendList").append("<p>" + trends[i][key][value] + "</p>");
        }
      }
    }
  }
};

const articleSearch = async () => {
  //q will be each trend
  let q = "trump";
  let startDate = "20150101";
  let endDate = "20151231";
  let pages = 3;
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

    await $.getJSON(searchedArticles, function (data) {
      articleList.push(...data.response.docs);
      // console.log(articleList);
    });
  }

  //figure out time stamp between two dates
  let months = [];
  for (i in articleList) {
    let str = articleList[i].pub_date,
      delimiter = "-",
      start = 2,
      tokens2 = str.split(delimiter).slice(1, start),
      result2 = tokens2.join(); // this

    //convert to num
    let integer = parseInt(result2, 10);
    months.push(integer);
  }
  let lastestMonth = Math.max(...months);
  let earliestMonth = Math.min(...months);
  //duration of this trend
  let totalDuration = lastestMonth - earliestMonth;
  console.log(articleList);
  //MAP TIME BACK TO THE RELATED GOOGLE TREND
};

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
