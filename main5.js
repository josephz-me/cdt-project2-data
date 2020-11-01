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
    downloadBookData();
    for (let i = 0; i < 100; i++) {
      let card = document.createElement("div");
      // card.addClass("card");
      var node = document.createTextNode("This is new.");
      // para.appendChild(node);

      // $(".grid").append(
      //   "<img class='grid-item' src='https://books.google.com/books/content?id=fc8PDgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'/>"
      // );
      createTiles();
    }
    // $(".grid").append("<br><br/>");
    // $(".grid").append("<br><br/>");
    // $(".grid").append("<br><br/>");
    // $(".grid").append("<br><br/>");

    //gets each individual book
    // console.log(books.nonfiction[2006][0]);
  });
}

const createTiles = () => {
  var card = document.createElement("div");
  var content = document.createElement("p");
  $(card).addClass("card grid-item");
  $(content).addClass("bookTitle");
  $(content).text("hello");
  card.appendChild(content);
  $(".grid").append(card);
};

let bookData = [];
const downloadBookData = async () => {
  // UNCOMMENT IF NEEDING TO UPDATE BOOK DATA
  // for (csv in csvs) {
  //   let year = csvs[csv].substr(0, csvs[csv].indexOf("."));
  //   // for (let i = 0; i < 2; i++) {
  //   for (let i = 0; i < books.nonfiction[year].length; i++) {
  //     let bookName = books.nonfiction[year][i];
  //     await $.getJSON(
  //       "https://www.googleapis.com/books/v1/volumes?q=" + bookName,
  //       (data) => {
  //         let thumbnailContent = data.items[0].volumeInfo.imageLinks.thumbnail;
  //         let titleContent = data.items[0].volumeInfo.title;
  //         let descriptionContent = data.items[0].volumeInfo.description;
  //         let authorContent = data.items[0].volumeInfo.authors[0];
  //         let bookInfo = {
  //           author: authorContent,
  //           year: year,
  //           genre: "nonfiction",
  //           title: titleContent,
  //           description: descriptionContent,
  //           thumbnail: thumbnailContent,
  //         };
  //         bookData.push(bookInfo);
  //         console.log(bookData);
  //       }
  //     );
  //     await wait(1500);
  //   }
  //   for (let i = 0; i < books.fiction[year].length; i++) {
  //     let bookName = books.fiction[year][i];
  //     await $.getJSON(
  //       "https://www.googleapis.com/books/v1/volumes?q=" + bookName,
  //       (data) => {
  //         let thumbnailContent = data.items[0].volumeInfo.imageLinks.thumbnail;
  //         let titleContent = data.items[0].volumeInfo.title;
  //         let descriptionContent = data.items[0].volumeInfo.description;
  //         let authorContent = data.items[0].volumeInfo.authors[0];
  //         // console.log(data.items[0].volumeInfo);
  //         let bookInfo = {
  //           author: authorContent,
  //           year: year,
  //           genre: "fiction",
  //           title: titleContent,
  //           description: descriptionContent,
  //           thumbnail: thumbnailContent,
  //         };
  //         bookData.push(bookInfo);
  //         console.log(bookData);
  //       }
  //     );
  //     await wait(800);
  //   }
  // }
  // let CSVBookData = Papa.unparse(bookData);
  // console.log(Papa.unparse(bookData));
  // var exportedFilename = "OrganizedBookData.csv";
  // var blob = new Blob([CSVBookData], { type: "text/csv;charset=utf-8;" });
  // if (navigator.msSaveBlob) {
  //   // IE 10+
  //   navigator.msSaveBlob(blob, exportedFilename);
  // } else {
  //   var link = document.createElement("a");
  //   if (link.download !== undefined) {
  //     // feature detection
  //     // Browsers that support HTML5 download attribute
  //     var url = URL.createObjectURL(blob);
  //     link.setAttribute("href", url);
  //     link.setAttribute("download", exportedFilename);
  //     link.style.visibility = "hidden";
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }
  // }
};

const wait = (amount = 0) =>
  new Promise((resolve) => setTimeout(resolve, amount));

let trendToKeywords = {};
function setup() {
  var $grid = $(".grid").imagesLoaded(function () {
    // init Masonry after all images have loaded
    $grid.masonry({
      // options...
      itemSelector: ".grid-item",
      columnWidth: 170,
      // fitWidth: true,
    });
  });

  // createCanvas(800, 4000);

  //trender trends in left column
  for (let r = 0; r < keywordTable.getRowCount(); r++) {
    let key = keywordTable.getString(r, 0);
    let value = keywordTable.getString(r, 1);
    trendToKeywords[key] = value;
  }
  csvToDict();
  for (year in trends) {
    trends[year].render();
  }
  $(".trendList").append("<br><br/>");
  $(".trendList").append("<br><br/>");
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
    $(".trendList").append("<br><br/>");
    let year = this.id;
    $(".trendList").append("<h1>" + year + "</1>");
    for (let key of this.vals) {
      $(".trendList").append("<h3>" + key[0] + "</h3>");
      for (let value in key[1]) {
        $(".trendList").append("<p> __ " + key[1][value].name + "</p>");
      }
    }
  }
}

// var settings = {
//   async: true,
//   crossDomain: true,
//   url:
//     "https://twinword-text-classification.p.rapidapi.com/classify/?text=Hello my name is brown.",
//   // "https://twinword-text-classification.p.rapidapi.com/classify/?text=Protect%20your%20back%20with%20these%20ergonomic%20office%20chairs.%20These%20adjustable%20chairs%20are%20cushioned%20and%20molded%20to%20ensure%20comfort%20over%20long%20hours.%20Some%20options%20feature%20breathable%20backs%20that%20let%20air%20flow%20through%20to%20keep%20you%20cool%20and%20add%20to%20your%20comfort%20level%20on%20hot%20days.",
//   method: "GET",
//   headers: {
//     "x-rapidapi-host": "twinword-text-classification.p.rapidapi.com",
//     "x-rapidapi-key": "478cb95cdbmsh9a77a762c498ce5p1d12a5jsn63fa6aa77acc",
//   },
// };

// $.ajax(settings).done(function (response) {
//   console.log(response);
// });
