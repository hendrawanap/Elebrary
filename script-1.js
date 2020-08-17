function getData(url, key) {
  return $.getJSON(url, data => data);
}

async function buildNavbar() {
  const data = await getData("json/data-1.json");
  const navlist = data.navlist;
  let elements = '';
  elements += `<div class="navbar">`;
  navlist.forEach(nav => {
    let lowerCase = nav.toLowerCase();
    elements += `<a id="link-${lowerCase}" href="#">${nav}</a>`;
  });
  elements += buildLoginButton();
  elements += `</div>`;
  return elements;
}

function buildLoginButton() {
  return `<div class="btn btn-login">Login</div>`;
}

function buildLogo(brand, icon) {
  return `<a class="logo" href="#">
            <span class="material-icons-outlined">${icon}</span><span class="brand">${brand}</span>
          </a>`;
}

async function buildTopBar() {
  let elements = '';
  elements += buildLogo("Ele<strong>Brary</strong>", "local_library");
  elements += await buildNavbar();
  $("div.topbar").html(elements);
}

buildTopBar();