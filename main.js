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
  let q = "trump";
  let startDate = "20060101";
  let endDate = "20061231";
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
      console.log(articleList);
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

    // if(integer > lastestArticle)
  }
  let lastestArticle = Math.max(...months);
  let earliestArticle = Math.min(...months);
  //duration of this trend
  let totalDuration = lastestArticle - earliestArticle;
  console.log("done", totalDuration);
};

//currently pulls books
const getBooks = () => {
  let bestSellers =
    "https://api.nytimes.com/svc/books/v3/lists.json?list=combined-print-and-e-book-fiction&api-key=" +
    apikey;
  // loadJSON(bestSellers, getBooks);
  $.getJSON(bestSellers, function (data) {
    console.log(data);
  });
};

// —----------------------
// function setup() {
//   noCanvas();
//   // loadJSON(url, gotData);
// }

// //different categories on best sellers list: https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=dPxVkGTEZ2h4KpgLTnwr6TziqqeoQspR
// function preload() {
//   let q = "trump";
//   let apikey = "dPxVkGTEZ2h4KpgLTnwr6TziqqeoQspR";
//   let howmany = 1; // total article num = howmany * 10;
//   for (let i = 0; i < howmany; i++) {
//     // let url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + q + "&page=" + i + "&api-key=" + apikey;
//     let articleSearch =
//       "https://api.nytimes.com/svc/search/v2/articlesearch.json?" +
//       "&page=" +
//       i +
//       "&api-key=" +
//       apikey;
//     // let bestSellers = 'https://api.nytimes.com/svc/books/v3/lists.json?list=combined-print-and-e-book-fiction&bestsellers-date=2020-01-01' + "&api-key=" + apikey;
//   }
//   let bestSellers =
//     "https://api.nytimes.com/svc/books/v3/lists.json?list=combined-print-and-e-book-fiction&api-key=" +
//     apikey;
//   // loadJSON(bestSellers, getBooks);
// }

// const getBooks = (data) => {
//   var books = data.results;
//   for (var i = 0; i < books.length; i++) {
//     let bookTitle = books[i].book_details[0].title;
//     let bookDescription = books[i].book_details[0].description;
//     let bookReviews = books[i].reviews;
//     // console.log(bookTitle);
//     // console.log(bookDescription);
//     console.log(bookReviews);
//   }
// };
