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
  2019,
  2018,
  2017,
  2016,
  2015,
  2014,
  2013,
  2012,
  2011,
  2009,
  2008,
  2007,
  2006,
];

let trends = {};
let trendsLength;
let csvs = [
  "2019.csv",
  "2018.csv",
  "2017.csv",
  "2016.csv",
  "2015.csv",
  "2014.csv",
  "2013.csv",
  "2012.csv",
  "2011.csv",
  "2009.csv",
  "2008.csv",
  "2007.csv",
  "2006.csv",
];

let keywordTable;
let books;
let booksWithDescriptions;
let nonFicPerYear = {};
let FicPerYear = {};

let twinTextWords = {};

function preload() {
  //load trend-keywords
  keywordTable = loadTable("trends/trend-keywords.csv", "csv");

  //load actual trends
  for (let i = 0; i < csvs.length; i++) {
    table = loadTable("trends/" + csvs[i], "csv", "header");
    tables.push(table);
  }
}

// convert books into data
$.getJSON("books/books.json", (data) => {
  //NONFICTION
  for (year in years) {
    // booksInYears.push(data)
    nonFicPerYear[years[year]] = data.nonfiction[years[year]].length;
    FicPerYear[years[year]] = data.fiction[years[year]].length;
  }
});

$.getJSON("books/twinTextBooks.json", (books) => {
  for (book in books) {
    let bookTitle = books[book].title;
    let classifiers = books[book].classifiers;
    twinTextWords[bookTitle] = classifiers;
  }
  $.getJSON("books/book-description.json", (data) => {
    booksWithDescriptions = data;
    matchTrendtoBooks();

    for (let i = booksWithDescriptions.length - 1; i >= 0; i--) {
      // for (let i = 0; i < booksWithDescriptions.length; i++) {
      if (booksWithDescriptions[i]) {
        let bookTitle = booksWithDescriptions[i].title;
        let bookType = booksWithDescriptions[i].type;
        let bookYear = booksWithDescriptions[i].year;
        getRandomInt(1, 5, 2, bookYear);
        createTiles(bookTitle, bookType, bookYear);
      }
    }

    for (year in years) {
      let firstYearElement = document.querySelector(
        `[data-bookyear='${years[year]}']`
      );
      firstYearElement.id = `${years[year]}`;
    }
    hideLoading();
  });
});

const hideLoading = () => {
  $(".loadingScreen").addClass("hideLoading");

  setTimeout(() => {
    $(".loadingScreen").remove();
  }, 3000);
};

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

let previousExpandedTitle;
let previousElement;
let previousDataBookName;

const createTiles = (bookNames, bookType, bookYear) => {
  let card = document.createElement("div");
  var content = document.createElement("div");
  $(content).addClass("content");
  var title = document.createElement("p");
  let keywords = document.createElement("p");
  $(title).addClass("bookTitle");
  $(title).text(bookNames);
  content.append(title);
  $(keywords).addClass("keywords");
  // $(title).text(bookNames);
  let desiredWords = twinTextWords[bookNames].split(",", 5).join(", ");

  keywords.append(desiredWords);
  content.append(keywords);

  $(card).addClass("card all " + bookType);
  $(card).attr("data-bookYear", bookYear);
  $(card).attr("data-bookName", bookNames);

  //everything should go content
  card.appendChild(content);
  $(".grid").append(card);

  // $(card).hover(
  //   function (e) {
  //     let bookYear = $(e.currentTarget).data("bookyear");
  //     let bookName = $(e.currentTarget).data("bookname");

  //     let bookType;
  //     $(card).hasClass("nonfiction")
  //       ? (bookType = "nonfiction")
  //       : (bookType = "fiction");

  //     let hoverCard = document.createElement("div");
  //     let hoverCategory = document.createElement("p");
  //     let hoverClassifiers = document.createElement("p");
  //     var currentMousePos = { x: -1, y: -1 };
  //     $(hoverCard).addClass(`hoverCard ${bookType}`);
  //     $(hoverCategory).addClass(`hoverCategory`);
  //     $(hoverClassifiers).addClass(`hoverClassifiers`);
  //     $(hoverCategory).text("Keywords");
  //     $(hoverClassifiers).text(
  //       twinTextWords[bookName].split(",", 5).join(", ")
  //     );
  //     hoverCard.appendChild(hoverCategory);
  //     hoverCard.appendChild(hoverClassifiers);

  //     if ($(card).hasClass("hide") || $(card).hasClass("navFilterHide")) {
  //       $(hoverCard).addClass("hoverHide");
  //     } else {
  //       $(hoverCard).removeClass("hoverHide");
  //     }

  //     $(hoverCard).addClass(`hoverCard ${bookType}`);

  //     $("body").append(hoverCard);

  //     $(document).mousemove(function (event) {
  //       currentMousePos.x = event.pageX;
  //       currentMousePos.y = event.pageY;
  //       $(".hoverCard").css({
  //         top: `${currentMousePos.y + 30}px`,
  //         left: `${currentMousePos.x + 30}px`,
  //       });
  //     });
  //   },
  //   function () {
  //     $(".hoverCard").remove();
  //   }
  // );
  card.onclick = function (e) {
    let currentElement = e.composedPath()[0]; //clicked card
    let bkTitle = $(currentElement).data("bookname");
    let bkYear = $(currentElement).data("bookyear");

    //IF NO PREVIOUS CARD EXISTS (first click)
    if (!previousExpandedTitle) {
      let bkPos = searchForBookYear(bkYear);
      let searchNum = FicPerYear[bkYear] + nonFicPerYear[bkYear];
      let arrayPos = findBook(bkPos, searchNum, bkTitle);

      let bkDescription =
        booksWithDescriptions[arrayPos].description.replace(
          /^(.{300}[^\s]*).*/,
          "$1"
        ) + "...";

      let bkAuthor = booksWithDescriptions[arrayPos].author;
      //add category class
      $(currentElement).hasClass("nonfiction")
        ? (bkType = "nonfiction")
        : (bkType = "fiction");

      //all the expanded card content
      $(currentElement).addClass("expand");
      let expandedCard = document.createElement("div");
      $(expandedCard).addClass("expanded-card");
      $(expandedCard).attr("data-bookname", bkTitle);
      var expandedYear = document.createElement("p");
      $(expandedYear).addClass("expanded-bookYear inner");
      $(expandedYear).text(`${bkYear} • ${capitalizeFirstLetter(bkType)}`);
      var expandedTitle = document.createElement("h1");
      $(expandedTitle).addClass("expanded-bookTitle inner");
      $(expandedTitle).text(bkTitle);
      var expandedAuthor = document.createElement("h2");
      $(expandedAuthor).addClass("expanded-bookAuthor inner");
      $(expandedAuthor).text(bkAuthor);
      var expandedDescription = document.createElement("p");
      $(expandedDescription).addClass("expanded-bookDescription inner");
      $(expandedDescription).text(bkDescription);

      expandedCard.appendChild(expandedYear);
      expandedCard.appendChild(expandedTitle);
      expandedCard.appendChild(expandedAuthor);
      expandedCard.appendChild(expandedDescription);

      let apiLink = `https://www.googleapis.com/books/v1/volumes?q='+${bkTitle}+${bkAuthor}`;
      $.getJSON(apiLink, (data) => {
        url = data.items[0].volumeInfo.infoLink;
        if (url) {
          $(expandedCard).append(
            `<a target='blank' href=${url} class='expanded-bookURL inner'>Read More</a>`
          );
        }
      });

      //add card to screen
      previousExpandedTitle = bkTitle; //previous expandedCard
      previousElement = currentElement;
      $(currentElement).append(expandedCard);
    }

    // //IF PREVIOUS CARD DOES EXIST
    else if (previousExpandedTitle) {
      //IF ANOTHER CARD IS CLICKED
      let URL = $(".expanded-bookURL")[0];
      //if books match
      if (typeof bkTitle !== "undefined") {
        if (previousExpandedTitle === bkTitle) {
          $(previousElement).toggleClass("expand");
          let previousTitleElement = $(previousElement).find(".bookTitle");
          $(previousTitleElement).removeClass("hidden");
          $(".expanded-card").toggle();
        } else if (previousExpandedTitle !== bkTitle) {
          if (e.composedPath()[0] === URL) {
            return;
          } else {
            // THE SHITTY HEAVY COMPUTATION
            let bkPos = searchForBookYear(bkYear);
            let searchNum = FicPerYear[bkYear] + nonFicPerYear[bkYear];
            let arrayPos = findBook(bkPos, searchNum, bkTitle);
            let bkDescription =
              booksWithDescriptions[arrayPos].description.replace(
                /^(.{300}[^\s]*).*/,
                "$1"
              ) + "...";
            let bkAuthor = booksWithDescriptions[arrayPos].author;
            let bkTitleElement = $(currentElement).find(".bookTitle");

            $(".hidden").toggleClass("hidden");

            $(bkTitleElement).addClass("hidden");
            $(previousElement).removeClass("expand");
            $(".expanded-card").remove(); //remove previous card
            //add category class
            $(currentElement).hasClass("nonfiction")
              ? (bkType = "nonfiction")
              : (bkType = "fiction");
            //create expanded card
            $(currentElement).addClass("expand");
            let expandedCard = document.createElement("div");
            $(expandedCard).addClass("expanded-card");
            $(expandedCard).attr("data-bookname", bkTitle);
            //Create all elements
            var expandedYear = document.createElement("p");
            $(expandedYear).addClass("expanded-bookYear inner");

            $(expandedYear).text(
              `${bkYear} • ${capitalizeFirstLetter(bkType)}`
            );
            var expandedTitle = document.createElement("h1");
            $(expandedTitle).addClass("expanded-bookTitle inner");
            $(expandedTitle).text(bkTitle);
            var expandedAuthor = document.createElement("h2");
            $(expandedAuthor).addClass("expanded-bookAuthor inner");
            $(expandedAuthor).text(bkAuthor);
            var expandedDescription = document.createElement("p");
            $(expandedDescription).addClass("expanded-bookDescription inner");
            $(expandedDescription).text(bkDescription);

            expandedCard.appendChild(expandedYear);
            expandedCard.appendChild(expandedTitle);
            expandedCard.appendChild(expandedAuthor);
            expandedCard.appendChild(expandedDescription);

            let apiLink = `https://www.googleapis.com/books/v1/volumes?q='+${bkTitle}+${bkAuthor}`;
            $.getJSON(apiLink, (data) => {
              url = data.items[0].volumeInfo.infoLink;
              if (url) {
                $(expandedCard).append(
                  `<a target='blank' href=${url} class='expanded-bookURL inner'>Read More</a>`
                );
              }
            });
            //add card to screen
            previousExpandedTitle = bkTitle; //previous expandedCard
            previousElement = currentElement;
            $(currentElement).append(expandedCard);
          }
        }
      }
    }
  };
};

const findBook = (bkPos, searchNum, bkTitle) => {
  //search up
  let found = false;
  for (i = bkPos; i < bkPos + searchNum; i++) {
    if (typeof booksWithDescriptions[i] !== "undefined") {
      if (booksWithDescriptions[i].title.includes(bkTitle)) {
        return i;
      }
    }
  }

  for (i = bkPos; i > bkPos - searchNum; i--) {
    if (typeof booksWithDescriptions[i] !== "undefined") {
      if (booksWithDescriptions[i].title.includes(bkTitle)) {
        return i;
      }
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
  for (let r = 0; r < keywordTable.getRowCount(); r++) {
    let key = keywordTable.getString(r, 0);
    let value = keywordTable.getString(r, 1).split(",");
    trendToKeywords[key] = value;
  }
  csvToDict();

  $(".trendList").append("<br><br/>");
  for (let i = Object.keys(trends).length - 1; i >= 0; i--) {
    trends[Object.keys(trends)[i]].render();
  }
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
});

const scrollToYear = (e) => {
  let allBooks = $(".card");
  allBooks.removeClass("hide");
  $(".clickedTrend").removeClass("clickedTrend");
  let year = $(e).data("year");
  let desiredElement = $(`#${year}`);
  // let allBooks = $(".card");
  // allBooks.removeClass("hide");
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
      if (yearPos < 120 + 60 && yearPos > 90 + 60 && yearPos) {
        yearDisplayed = yearString;
      }
    }
  }

  if (previousDisplayed[previousDisplayed.length - 1] !== yearDisplayed) {
    previousDisplayed.push(yearDisplayed);
    let desiredElement = $(`#${yearDisplayed}`);
    let allBooks = $(".card");
    allBooks.removeClass("hide");
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
    let year = this.id;
    $(".trendList").append(
      "<h1 class='year' onclick=scrollToYear(this) data-year=" +
        year +
        ">" +
        year +
        "</h1>"
    );
    for (let key of this.vals) {
      let trendContainer = document.createElement("div");
      $(trendContainer).addClass(`trendContainer`);
      $(trendContainer).append(
        "<h3 class='trendItem trendCategory'>" + key[0] + "</h3>"
      );
      for (let value in key[1]) {
        //actual bookname
        // $(".trendList").append("<p> __ " + key[1][value].name + "</p>");
        let trendName = key[1][value].name;
        let trendElement = document.createElement("p");

        $(trendElement).addClass(`trendItem trend`);
        $(trendElement).attr("data-trendname", trendName);
        $(trendElement).attr("data-trendyear", year);
        $(trendElement).text(`${trendName}`);
        trendElement.addEventListener("click", showBooks);
        $(trendContainer).append(trendElement);
      }
      $(".trendList").append(trendContainer);
    }
    // $(".trendItem").wrapAll("<div class='trendGroup'></div>");
  }
}

//FILTER BOOK
//https://www.w3schools.com/howto/howto_js_filter_elements.asp

function filterSelection(c) {
  let bookType = $(c).data("type");
  // $(c).addClass("active");
  let allBooks = $(".card");

  for (let i = 0; i < allBooks.length; i++) {
    if (typeof allBooks[i] === "object") {
      if (!$(allBooks[i]).hasClass(bookType)) {
        $(allBooks[i]).toggleClass("navFilterHide");
      }
    }
  }

  let bookNum = $(`.${bookType}.card`).length;

  //MODAL CODE
  let modal = document.getElementById("myModal");
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  if ($(c).hasClass("active")) {
    $(modal).find("p").text(`${bookNum} ${bookType} books shown`);
  } else {
    $(modal).find("p").text(`${bookNum} ${bookType} books hidden`);
  }
  modal.style.display = "block";
  setTimeout(() => {
    $(modal).fadeOut(200);
  }, 3000);
}

//create script that creates Matches.json file

let matched = {};
const matchTrendtoBooks = () => {
  //go through every trend
  let trendsLength = Object.keys(trendToKeywords).length;
  for (let i = 0; i < trendsLength; i++) {
    let individualTrend = Object.keys(trendToKeywords)[i];
    matched[individualTrend] = [];
    let trendWords = trendToKeywords[individualTrend];
    //search for each word in trendWords in every single book description
    for (words in trendWords) {
      //word needing to be searched
      let searchedWord = trendWords[words];
      for (book in booksWithDescriptions) {
        // every individual book description
        let individualDescription = booksWithDescriptions[book].description;
        if (individualDescription.includes(searchedWord)) {
          matched[individualTrend].push(booksWithDescriptions[book].title);
        }
      }
    }
  }
};

let previousDiv;
const showBooks = (e) => {
  //start fresh
  $(".clickedTrend").removeClass("clickedTrend");
  // $(".navFilterHide").removeClass("navFilterHide");

  // add active state to just clicked element
  let selectedDiv = e.composedPath()[0];
  $(selectedDiv).addClass("clickedTrend");

  //show all hidden elements
  let allBooks = $(".card");
  allBooks.removeClass("hide");

  //get trendname of selectedDiv
  let trendName = $(selectedDiv).attr("data-trendname");

  let relatedBooks = matched[trendName];
  let trendYear = $(selectedDiv).data("trendyear");
  let desiredBookList = [];

  if (previousDiv === selectedDiv) {
    $(".hide").toggleClass("hide");
    $(selectedDiv).toggleClass("clickedTrend");
    previousDiv = "";
  } else {
    for (book in relatedBooks) {
      let desiredBook = $(
        `div[data-bookname="${relatedBooks[book]}"][data-bookyear="${trendYear}"]`
      )[0];

      if (typeof desiredBook !== "undefined") {
        desiredBookList.push(desiredBook);
      }
    }

    //go through very book
    for (let i = 0; i < allBooks.length; i++) {
      if (typeof allBooks[i] === "object") {
        // go through every positive book and chec if allBooks[i] matches
        let found = false;
        for (book in desiredBookList) {
          if (allBooks[i] === desiredBookList[book]) {
            found = true;
            break;
          }
        }
        if (!found) {
          $(allBooks[i]).addClass("hide");
        }
      }
    }
    let desiredElement = $(allBooks).not(".hide")[0];

    $(".bookList").animate(
      {
        scrollTop:
          $(".bookList").scrollTop() + $(desiredElement).position().top + -50,
      },
      1000
    );

    //MODAL CODE

    let modal = document.getElementById("myModal");
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
    if (desiredBookList.length > 1) {
      $(modal).find("p").text(`${desiredBookList.length} Related Books`);
    } else {
      $(modal).find("p").text(`${desiredBookList.length} Related Book`);
    }
    modal.style.display = "block";
    setTimeout(() => {
      $(modal).fadeOut(200);
    }, 3000);
    previousDiv = selectedDiv;
  }
};

const openAbout = () => {
  // Get the modal
  let modal = document.getElementById("aboutModal");

  // Get the <span> element that closes the modal
  // let span = document.getElementsByClassName("close")[0];
  // span.onclick = function () {
  //   modal.style.display = "none";
  // };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
  // $(modal).find("p").text(`${desiredBookList.length} Related Books`);
  modal.style.display = "block";
};

const toTop = () => {
  let desiredElement = $(`#2019`);
  $(".bookList").animate(
    {
      scrollTop:
        $(".bookList").scrollTop() + desiredElement.position().top + -50,
    },
    1000
  );
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
