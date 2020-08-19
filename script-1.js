function getData(url) {
  return $.getJSON(url, data => data);
}

function buildNavbar(data) {
  const navlist = data.navlist;
  let elements = '';
  elements += `<div class="navbar">`;
  navlist.forEach(nav => {
    let lowerCase = nav.nav.replace(/ /g, "-").toLowerCase();
    elements += `<a id="link-${lowerCase}" data-header="${nav.dataHeader}" href="#">${nav.nav}</a>`;
  });
  elements += buildLoginButton();
  elements += `</div>`;
  return elements;
}

function buildLoginButton() {
  return `<div class="btn btn-login">LOGIN</div>`;
}

function buildLogo(brand, icon) {
  return `<a class="logo" href="#">
            <span class="material-icons-outlined md-36">${icon}</span><span class="brand">${brand}</span>
          </a>`;
}

function buildTopBar(data) {
  let elements = '';
  elements += buildLogo("Ele<strong>Brary</strong>", "local_library");
  elements += buildNavbar(data);
  $("div.topbar").html(elements);
  setDefaultPage("library-catalog");
  addNavsOnClick();
}

function addNavsOnClick() {
  $(".navbar a").on("click", function() {
    $(".navbar a").removeClass("active");
    this.classList.toggle("active");
    buildHeader();
  })
}

function setDefaultPage(page) {
  $(`#link-${page}`).addClass("active");
  buildHeader();
}

function buildHeader() {
  const headerText = $(".navbar a.active").data("header");
  $(".header").html(headerText);
}

function buildSidebar(data) {
  const categories = data.categories;
  const instagram = data.instagram;
  const bloggers = data.bloggers;
  let elements = '';
  elements += buildSearchBar();
  elements += buildCategories(categories);
  elements += buildInstagram(instagram);
  elements += buildTopBloggers(bloggers);
  $("div.sidebar").html(elements);
  addSearchBtnOnClick(data);
  addSearchInputOnKeyup(data);
}

function buildSearchBar() {
  return `<div class="search-bar">
            <input type="text" placeholder="Search by book title, author name">
            <div class="btn btn-search material-icons-outlined md-36">search</div>
          </div>`;
}

function addSearchBtnOnClick(data) {
  $(".btn-search").on("click", function(e) {
    const keyword = $(".search-bar input").val();
    if (keyword != '') {
      buildCollection(keyword, data);
    }
    $(".search-bar input").val("");
  });
}

function addSearchInputOnKeyup(data) {
  $(".search-bar input").on("keyup", function(e) {
    const keyword = $(".search-bar input").val();
    if (keyword != '' && e.which == 13) {
      buildCollection(keyword, data);
      $(".search-bar input").val("");
    }
  });
}

function buildCategories(categories) {
  let elements = '';
  elements += `<div class="categories card"><h3>Categories</h3><ul>`;
  categories.forEach(category => {
    elements += `<li><span>${category.category}</span><span>${category.counts}</span></li>`;
  });
  elements += `</ul></div>`;
  return elements;
}

function buildInstagram(instagram) {
  let elements = '';
  elements += `<div class="instagram card"><h3>Instagram</h3>`;
  instagram.forEach(imgLink => {
    elements += `<img src="img/${imgLink}">`;
  });
  elements += `</div>`;
  return elements;
}

function buildTopBloggers(topBloggers) {
  let elements = '';
  elements += `<div class="top-bloggers card"><h3>Top Bloggers</h3>`;
  topBloggers.forEach(blogger => {
    elements += `<div class="mini-card">
                  <img class="image" src="img/${blogger.imageLink}">
                  <div class="info">
                    <div class="title">${blogger.name}</div>
                    <div class="subtitle">${blogger.publishedBooks} Published Books</div>
                  </div>
                </div>`
  });
  elements += `</div>`;
  return elements;
}

async function buildCollection(keyword, data) {
  const bookAPI = data.restAPI[0];
  const bookData = await getData(bookAPI.link + keyword + "&maxResults=18"+ bookAPI.key);
  const bookItems = bookData.items;
  let bookImgLinks = [];
  bookItems.forEach(book => {
    try {
      bookImgLinks.push(book.volumeInfo.imageLinks.thumbnail);
    } catch (e) {
      console.log(e.message);
    }
  });
  let elements = '';
  elements += `<h2>Search results: '${keyword}'</h2>`;
  elements += `<div class="img-container">`;
  bookImgLinks.forEach(link => {
    elements += `<img src="${link}">`
  });
  elements += `</div>`;
  $("div.collection").html(elements);
}

function buildStatistics(data) {
  const statistics = data.statistics;
  let elements = '';
  statistics.forEach(stat => {
    elements += `<div class="mini-card">
                  <div class="image"><span class="material-icons-outlined md-light md-36">${stat.icon}</span></div>
                  <div class="info">
                    <div class="title">${stat.quantity}</div>
                    <div class="subtitle">${stat.category}</div>
                  </div>
                </div>`
  });
  $(".statistics").html(elements);
}

function buildSpaces() {
  let elements = `<div class="overlay">
                    <h2 class="container">Our Study Spaces & Rooms</h2>
                    <p class="container">Choose any of our comfortable study spaces and rooms.<br>We provide comfortable facilities for everyone</p>
                    <div class="container">
                      <div class="btn">RESERVE A SPACE</div>
                      <div class="btn inverse">EXPLORE OUR SPACES</div>
                    </div>
                  </div>`;
  $(".spaces").html(elements);
}

function buildDonateBar() {
  let elements = `<h2>Support Our Library<br>Donate Today</h2>
                  <div class="btn-group">
                    <div class="btn">$3</div>
                    <div class="btn inverse">$5</div>
                    <div class="btn">$10</div>
                    <div class="btn">Other</div>
                  </div>`;
  $(".donate-bar").html(elements);
  addDonateBtnOnClick();
}

function addDonateBtnOnClick() {
  $(".donate-bar .btn").on("click", function() {
    $(".donate-bar .btn").removeClass("inverse");
    this.classList.toggle("inverse");
  });
}

function buildFooter() {
  let elements = '<div class="container">';
  elements += buildLogo("Ele<strong>Brary</strong>", "local_library");
  elements += ` <p>©Copyright 2020. Powered by WPDeveloper</p>
                <a href="#">Terms of Services</a>
                <div class="social-media">
                  <img class="btn" src="svg/facebook.svg">
                  <img class="btn" src="svg/twitter.svg">
                  <img class="btn" src="svg/linkedin.svg">
                  <img class="btn" src="svg/instagram.svg">
                </div>
              </div>`;
  $(".footer").html(elements);
}

async function main() {
  const data = await getData("json/data-1.json");
  buildTopBar(data);
  buildSidebar(data);
  buildCollection("attack on titan", data);
  buildStatistics(data);
  buildSpaces();
  buildDonateBar();
  buildFooter();
}

main();
