function getData(url) {
  return $.getJSON(url, data => data);
}

async function buildNavbar() {
  const data = await getData("json/data-1.json");
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

async function buildTopBar() {
  let elements = '';
  elements += buildLogo("Ele<strong>Brary</strong>", "local_library");
  elements += await buildNavbar();
  $("div.topbar").html(elements);
  setDefaultPage("library-catalog");
  addNavsOnClik();
}

function addNavsOnClik() {
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

async function buildSidebar() {
  const data = await getData("json/data-1.json");
  const categories = data.categories;
  const instagram = data.instagram;
  const bloggers = data.bloggers;
  let elements = '';
  elements += buildSearchBar();
  elements += buildCategories(categories);
  elements += buildInstagram(instagram);
  elements += buildTopBloggers(bloggers);
  $("div.sidebar").html(elements);
  addSearchBtnOnClick();
  addSearchInputOnKeyup();

}

function buildSearchBar() {
  return `<div class="search-bar">
            <input type="text" placeholder="Search by book title, author name">
            <div class="btn btn-search material-icons-outlined md-36">search</div>
          </div>`;
}

function addSearchBtnOnClick() {
  $(".btn-search").on("click", function(e) {
    const keyword = $(".search-bar input").val();
    if (keyword != '') {
      buildCollection(keyword);
    }
    $(".search-bar input").val("");
  });
}

function addSearchInputOnKeyup() {
  $(".search-bar input").on("keyup", function(e) {
    const keyword = $(".search-bar input").val();
    if (keyword != '' && e.which == 13) {
      buildCollection(keyword);
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

async function buildCollection(keyword) {
  const data = await getData("json/data-1.json");
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

async function buildStatistics() {
  const data = await getData("json/data-1.json");
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
  let elements = '';
  elements += `<div class="overlay">
                <h2 class="container">Our Study Spaces & Rooms</h2>
                <p class="container">Choose any of our comfortable study spaces and rooms.<br>We provide comfortable facilities for everyone</p>
                <div class="container">
                  <div class="btn">RESERVE A SPACE</div>
                  <div class="btn inverse">EXPLORE OUR SPACES</div>
                </div>
              </div>`;
  $(".spaces").html(elements);
}

buildTopBar();
buildSidebar();
buildCollection("harry potter");
buildStatistics();
buildSpaces();