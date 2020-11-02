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
let booksWithDescriptions;

function preload() {
  //load trend-keywords
  keywordTable = loadTable("trends/trend-keywords.csv", "csv");

  //load actual trends
  for (let i = 0; i < csvs.length; i++) {
    table = loadTable("trends/" + csvs[i], "csv", "header");
    tables.push(table);
  }
  // convert books into data
  // $.getJSON("books/books.json", (data) => {
  //   // books = data;
  //   // downloadBookData();
  //   for (let i = 0; i < 300; i++) {
  //     getRandomInt(1, 3, 2);
  //     createTiles("hello");
  //   }
  // });

  $.getJSON("books/book-description.json", (data) => {
    // booksWithDescriptions = data;
    // console.log(booksWithDescriptions[0].title);
    for (let i = 0; i < 300; i++) {
      getRandomInt(1, 3, 2);
      createTiles("hello");
    }
  });
}

const getRandomInt = (min, max, target) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  let randomNum = Math.floor(Math.random() * (max - min) + min);
  if (randomNum === target) {
    var card = document.createElement("div");
    $(card).addClass("card-blank grid-item");
    $(".grid").append(card);
  }
};

const createTiles = (bookNames) => {
  var card = document.createElement("div");
  var content = document.createElement("p");
  $(card).addClass("card grid-item");
  $(content).addClass("bookTitle");
  $(content).text(bookNames);
  card.appendChild(content);
  $(".grid").append(card);
};

//convert bookData into CSV
let bookData = [];
const downloadBookData = async () => {
  // UNCOMMENT IF NEEDING TO UPDATE BOOK DATA
  for (csv in csvs) {
    let year = csvs[csv].substr(0, csvs[csv].indexOf("."));
    // for (let i = 0; i < 2; i++) {
    for (let i = 0; i < books.nonfiction[year].length; i++) {
      let bookName = books.nonfiction[year][i];
      await $.getJSON(
        "https://www.googleapis.com/books/v1/volumes?q=" + bookName,
        (data) => {
          let thumbnailContent = data.items[0].volumeInfo.imageLinks.thumbnail;
          let titleContent = data.items[0].volumeInfo.title;
          let descriptionContent = data.items[0].volumeInfo.description;
          let authorContent = data.items[0].volumeInfo.authors[0];
          let bookInfo = {
            author: authorContent,
            year: year,
            genre: "nonfiction",
            title: titleContent,
            description: descriptionContent,
            thumbnail: thumbnailContent,
          };
          bookData.push(bookInfo);
          // console.log(bookData);
        }
      );
      await wait(800);
    }
    for (let i = 0; i < books.fiction[year].length; i++) {
      let bookName = books.fiction[year][i];
      await $.getJSON(
        "https://www.googleapis.com/books/v1/volumes?q=" + bookName,
        (data) => {
          let thumbnailContent = data.items[0].volumeInfo.imageLinks.thumbnail;
          let titleContent = data.items[0].volumeInfo.title;
          let descriptionContent = data.items[0].volumeInfo.description;
          let authorContent = data.items[0].volumeInfo.authors[0];
          // console.log(data.items[0].volumeInfo);
          let bookInfo = {
            author: authorContent,
            year: year,
            genre: "fiction",
            title: titleContent,
            description: descriptionContent,
            thumbnail: thumbnailContent,
          };
          bookData.push(bookInfo);
          // console.log(bookData);
        }
      );
      await wait(800);
    }
  }
  let CSVBookData = Papa.unparse(bookData);
  // console.log(Papa.unparse(bookData));
  var exportedFilename = "OrganizedBookData.csv";
  var blob = new Blob([CSVBookData], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, exportedFilename);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
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

  //trender trends in left column
  for (let r = 0; r < keywordTable.getRowCount(); r++) {
    let key = keywordTable.getString(r, 0);
    let value = keywordTable.getString(r, 1).split(",");
    trendToKeywords[key] = value;
  }
  csvToDict();

  //in each year
  for (year in trends) {
    trends[year].render();
    // console.log(trends[year]);
  }
  $(".trendList").append("<br><br/>");
  $(".trendList").append("<br><br/>");
  // console.log(trendToKeywords);
  // console.log(trends);
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

//FILTER BOOK
filterSelection("all");
function filterSelection(c) {
  var x, i;
  x = document.getElementsByClassName("filterDiv");
  if (c == "all") c = "";
  // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
  for (i = 0; i < x.length; i++) {
    RemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) AddClass(x[i], "show");
  }
}

// Show filtered elements
function AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {
      element.className += " " + arr2[i];
    }
  }
}

// Hide elements that are not selected
function RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
}

// Add active class to the current control button (highlight it)
var btnContainer = document.getElementById("myBtnContainer");
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function () {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}
