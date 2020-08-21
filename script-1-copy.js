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
  elements += `</div>`;
  return elements;
}

function buildNavbarBtn() {
  return `
          <div class="btn btn-navbar">
          <span class="material-icons-outlined md-24 menu active">menu</span><span class="material-icons-outlined close md-24">close</span>
          </div>
          `;
}

function buildLoginButton() {
  return `<div class="btn btn-login material-icons md-24">login</div>`;
}

function buildLogo(brand, icon) {
  return `<a class="logo" href="#">
            <span class="material-icons-outlined md-24">${icon}</span><span class="brand">${brand}</span>
          </a>`;
}

function buildTopBar(data) {
  let elements = '';
  elements += `
              <div class="container">
                ${buildNavbarBtn()}
                ${buildLogo("Ele<strong>Brary</strong>", "local_library")}
                ${buildLoginButton()}
                ${buildNavbar(data)}
              </div>
              `;
  $("div.topbar").html(elements);
  setDefaultPage("library-catalog");
  addNavsOnClick();
  addNavBtnOnClick();
}

function addNavBtnOnClick() {
  $(".btn-navbar").on("click", function() {
    document.querySelector(".navbar").classList.toggle("active");
    this.querySelector("span.menu").classList.toggle("active");
    this.querySelector("span.close").classList.toggle("active");
  })
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
  let elements = '';
  elements = `
              <div class="container">
                ${headerText}
              </div>
            `;
  $(".header").html(elements);
}

function buildSidebar(data) {
  const categories = data.categories;
  const instagram = data.instagram;
  const bloggers = data.bloggers;
  let elements = '';
  elements += `
              <div class="container">
                ${buildSearchBar(false)}
                ${buildCategories(categories, false)}
                ${buildInstagram(instagram)}
                ${buildTopBloggers(bloggers)}
              </div>
              `
  $("div.sidebar").html(elements);
  addSearchBtnOnClick(data);
  addSearchInputOnKeyup(data);
}

function buildSearchBar(isVoid=true) {
  let elements = '';
  elements += `
              <div class="search-bar">
                <div class="container">
                <input type="text" placeholder="Search by book title, author name">
                <div class="btn btn-search material-icons-outlined md-24">search</div>
                </div>
              </div>
              `;
  if (isVoid) {
    $(".header").after(elements);
  } else return elements;
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

function buildCategories(categories, isVoid=true) {
  let elements = '';
  let li = '';
  categories.forEach(category => {
    li += `<li><span>${category.category}</span><span class="counts">${category.counts}</span></li>`;
  });
  elements += `
              <div class="categories card">
                <div class="container">
                  <h3>Categories</h3>
                  <span class="btn scroll-back material-icons">keyboard_arrow_left</span>
                  <ul>
                    ${li}
                  </ul>
                  <span class="btn scroll-forward material-icons">keyboard_arrow_right</span>
                </div>
              </div>
              `
  if (isVoid) {
    $(".search-bar").after(elements);
    addScrollBtnOnClick();
    addCategoryOnClick();
  }
  return elements;
}

function addScrollBtnOnClick() {
  $(".categories .scroll-forward").on("click", function() {
    document.querySelector(".categories ul").scrollBy(200, 0);
  });
  $(".categories .scroll-back").on("click", function() {
    document.querySelector(".categories ul").scrollBy(-200, 0);
  });
}

function addCategoryOnClick() {
  $(".categories li").on("click", function() {
    $(".categories li.active").removeClass("active");
    this.classList.toggle("active");
  });
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
  let books = '';
  bookImgLinks.forEach(link => {
    books += `<img src="${link}">`
  });
  elements += `
              <div class="container">
                <h2>Search results: '${keyword}'</h2>
                <div class="book-container">
                  ${books}
                </div>
              </div>
              `
  $("div.collection").html(elements);
  console.log("2");
}

function buildStatistics(data) {
  const statistics = data.statistics;
  let elements = '';
  let miniCards = '';
  statistics.forEach(stat => {
    miniCards += `
                <div class="mini-card">
                  <div class="image material-icons-outlined">${stat.icon}</div>
                  <div class="info">
                    <div class="title">${stat.quantity}</div>
                    <div class="subtitle">${stat.category}</div>
                  </div>
                </div>
                `;
  });
  elements += `
              <div class="container">
                ${miniCards}
              </div>
              `
  $(".statistics").html(elements);
}

function buildSpaces() {
  let elements = `<div class="overlay">
                    <div class="container">
                      <h2>Our Study Spaces & Rooms</h2>
                      <p>Choose any of our comfortable study spaces and rooms.<br>We provide comfortable facilities for everyone</p>
                      <div>
                        <div class="btn">RESERVE A SPACE</div>
                        <div class="btn inverse">EXPLORE OUR SPACES</div>
                      </div>
                    </div>
                  </div>`;
  $(".spaces").html(elements);
}

function buildDonateBar() {
  let elements = `
                  <div class="container">
                    <h3>Support Our Library<br>Donate Today</h3>
                    <div class="btn-group">
                      <div class="btn">$3</div>
                      <div class="btn inverse">$5</div>
                      <div class="btn">$10</div>
                      <div class="btn">Other</div>
                    </div>
                  </div>
                  `;
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
  buildSearchBar();
  buildCategories(data.categories);
  buildSidebar(data);
  console.log("1");
  buildCollection("attack on titan", data);
  console.log("3");
  buildStatistics(data);
  buildSpaces();
  buildDonateBar();
  buildFooter();
}

main();
