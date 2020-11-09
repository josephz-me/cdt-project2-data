//Books API — https://developer.nytimes.com/docs/books-product/1/routes/lists.json/get
// https://developers.google.com/books/docs/v1/reference/?apix=true#volume
// https://developers.google.com/books/docs/v1/using#PerformingSearch

// https://www.googleapis.com/books/v1/volumes?q=Ruthless%20American%20Marriage

//jQuery toggleClass() Method
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
let nonFicPerYear = {};
let FicPerYear = {};

function preload() {
  //load trend-keywords
  keywordTable = loadTable("trends/trend-keywords.csv", "csv");

  //load actual trends
  for (let i = 0; i < csvs.length; i++) {
    table = loadTable("trends/" + csvs[i], "csv", "header");
    tables.push(table);
  }
  // convert books into data
  $.getJSON("books/books.json", (data) => {
    // booksInYears.;

    //NONFICTION
    for (year in years) {
      // booksInYears.push(data)
      nonFicPerYear[years[year]] = data.nonfiction[years[year]].length;
      FicPerYear[years[year]] = data.fiction[years[year]].length;
    }
  });

  $.getJSON("books/book-description.json", (data) => {
    booksWithDescriptions = data;

    for (let i = 0; i < booksWithDescriptions.length; i++) {
      let bookTitle = booksWithDescriptions[i].title.replace(",", "");
      let bookType = booksWithDescriptions[i].type;
      let bookYear = booksWithDescriptions[i].year;
      getRandomInt(1, 5, 2, bookYear);
      createTiles(bookTitle, bookType, bookYear);
    }

    for (year in years) {
      let firstYearElement = document.querySelector(
        `[data-bookyear='${years[year]}']`
      );
      firstYearElement.id = `${years[year]}`;
    }
  });
}

const getRandomInt = (min, max, target) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  let randomNum = Math.floor(Math.random() * (max - min) + min);
  if (randomNum === target) {
    var card = document.createElement("div");
    $(card).addClass("card-blank");
    // $(card).attr("data-bookYear", bookYear);
    $(".grid").append(card);
  }
};

let previousExpandedCard;
const createTiles = (bookNames, bookType, bookYear) => {
  let card = document.createElement("div");
  var content = document.createElement("p");
  $(card).addClass("card all " + bookType);
  $(card).attr("data-bookYear", bookYear);
  $(content).addClass("bookTitle");
  $(content).text(bookNames);
  card.appendChild(content);
  $(".grid").append(card);

  card.onclick = function (e) {
    //remove previous card
    if (previousExpandedCard) {
      $(previousExpandedCard).remove();
    }

    //find bookData
    let divElement = e.path[1];
    let bkTitle = divElement.textContent;
    let bkYear = $(divElement).data("bookyear");

    let bkPos = searchForBookYear(bkYear);
    let searchNum = FicPerYear[bkYear] + nonFicPerYear[bkYear];
    let arrayPos = findBook(bkPos, searchNum, bkTitle);
    let bkDescription = booksWithDescriptions[arrayPos].description;
    let bkAuthor = booksWithDescriptions[arrayPos].author;

    // let bkCategory =
    $(divElement).hasClass("nonfiction")
      ? (bkType = "nonfiction")
      : (bkType = "fiction");

    let xPos = e.path[1].getBoundingClientRect().x;
    let yPos = e.path[1].getBoundingClientRect().y;

    let expandedCard = document.createElement("div");
    $(expandedCard).addClass("expanded-card");
    $(expandedCard).css({ top: `${yPos}px`, left: `${xPos}px` });

    //title
    var expandedTitle = document.createElement("h1");
    $(expandedTitle).addClass("expanded-bookTitle inner");
    $(expandedTitle).text(bkTitle);

    //author
    var expandedAuthor = document.createElement("h2");
    $(expandedAuthor).addClass("expanded-bookAuthor inner");
    $(expandedAuthor).text(bkAuthor);

    //description
    var expandedDescription = document.createElement("p");
    $(expandedDescription).addClass("expanded-bookDescription inner");
    $(expandedDescription).text(bkDescription);

    expandedCard.appendChild(expandedTitle);
    expandedCard.appendChild(expandedAuthor);
    expandedCard.appendChild(expandedDescription);

    //add card to screen
    previousExpandedCard = expandedCard;
    // console.log(previousExpandedCard);
    document.body.appendChild(expandedCard);
  };
};

const findBook = (bkPos, searchNum, bkTitle) => {
  //search up
  let found = false;
  for (i = bkPos; i < searchNum + bkPos; i++) {
    if (booksWithDescriptions[i].title.includes(bkTitle)) {
      return i;
    }
  }

  for (i = bkPos; i < searchNum + bkPos; i--) {
    if (booksWithDescriptions[i].title.includes(bkTitle)) {
      console.log("found!", i);
      return i;
    }
  }
};
const searchForBookYear = (bkYear) => {
  let firstIndex = 0,
    lastIndex = booksWithDescriptions.length - 1,
    middleIndex = Math.floor((lastIndex + firstIndex) / 2);

  //get book year
  while (
    booksWithDescriptions[middleIndex].year != bkYear &&
    firstIndex < lastIndex
  ) {
    if (bkYear < booksWithDescriptions[middleIndex].year) {
      lastIndex = middleIndex - 1;
    } else if (bkYear > booksWithDescriptions[middleIndex].year) {
      firstIndex = middleIndex + 1;
    }
    middleIndex = Math.floor((lastIndex + firstIndex) / 2);
  }

  return booksWithDescriptions[middleIndex].year != bkYear ? -1 : middleIndex;
};

const wait = (amount = 0) =>
  new Promise((resolve) => setTimeout(resolve, amount));

let trendToKeywords = {};

function setup() {
  //trender trends in left column
  for (let r = 0; r < keywordTable.getRowCount(); r++) {
    let key = keywordTable.getString(r, 0);
    let value = keywordTable.getString(r, 1);
    trendToKeywords[key] = value;
  }
  console.log(trendToKeywords);
  csvToDict();

  //in each year
  for (year in trends) {
    trends[year].render();
  }
  $(".trendList").append("<br><br/>");
  $(".trendList").append("<br><br/>");
  $(".trendList").append("<br><br/>");
  $(".trendList").append("<br><br/>");
}

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
          let bookInfo = {
            author: authorContent,
            year: year,
            genre: "fiction",
            title: titleContent,
            description: descriptionContent,
            thumbnail: thumbnailContent,
          };
          bookData.push(bookInfo);
        }
      );
      await wait(800);
    }
  }
  let CSVBookData = Papa.unparse(bookData);
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

document.addEventListener("DOMContentLoaded", function (event) {
  $(".trendList").scroll(function () {
    filterBooks();
  });

  $(".bookList").scroll(function () {
    $(".expanded-card").fadeOut(100, () => {
      $(".expanded-card").remove();
    });
  });
});

$(window).resize(() => {
  $(".expanded-card").remove();
});

const scrollToPos = () => {
  let desiredElement = $("#2006");
  $(".bookList").animate(
    {
      scrollTop:
        $(".bookList").scrollTop() + desiredElement.position().top + -50,
    },
    1000
  );
};

let yearDisplayed = 2006;
let previousDisplayed = [];
let count;
const filterBooks = () => {
  let years = document.getElementsByClassName("year");
  let yearPos;

  for (year in years) {
    let yearString = years[year].textContent;
    let desiredYearElement = document.querySelector(
      `h1[data-year="${yearString}"]`
    );

    if (desiredYearElement) {
      yearPos = desiredYearElement.getBoundingClientRect().top;
      if (yearPos < 120 && yearPos > 90 && yearPos) {
        yearDisplayed = yearString;
      }
    }
  }

  if (previousDisplayed[previousDisplayed.length - 1] !== yearDisplayed) {
    previousDisplayed.push(yearDisplayed);
    let desiredElement = $(`#${yearDisplayed}`);

    $(".bookList").animate(
      {
        scrollTop:
          $(".bookList").scrollTop() + desiredElement.position().top + -50,
      },
      1000
    );
  }
};

function csvToDict() {
  for (let h = 0; h < tables.length; h++) {
    table = tables[h];
    let cols = table.findRow().table.columns;
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
    trends[years[h]] = new TrendYear(years[h], dict);
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
  constructor(y, d) {
    this.id = y;
    this.vals = d;
  }
  render() {
    $(".trendList").append("<br><br/>");
    let year = this.id;
    $(".trendList").append(
      "<h1 class='year' data-year=" + year + ">" + year + "</h1>"
    );
    for (let key of this.vals) {
      $(".trendList").append("<h3>" + key[0] + "</h3>");
      for (let value in key[1]) {
        //actual bookname
        $(".trendList").append("<p> __ " + key[1][value].name + "</p>");
      }
    }
  }
}

//FILTER BOOK
//https://www.w3schools.com/howto/howto_js_filter_elements.asp

function filterSelection(c) {
  var x, i;
  x = document.getElementsByClassName(c);
  if (c == "all") c = "";
  // Add the "hide" class (display:block) to the filtered elements, and remove the "hide" class from the elements that are not selected
  for (i = 0; i < x.length; i++) {
    showCard(x[i], "hide");
    if (x[i].className.indexOf(c) > -1) hideCard(x[i], "hide");
  }
}

// hide filtered elements
function hideCard(element, name) {
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
function showCard(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");

  // gets hide class
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
}

// Add active class to the current control button (highlight it)
var btnContainer = document.getElementsByClassName("right")[0];
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function () {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}
