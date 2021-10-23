const activeUrl = document.getElementById("url");
const likeButton = document.getElementById("action");
const list = document.getElementById("list");
const noWebsite = document.getElementById("noWebsite");

let value = {
  id: "",
  currentUrl: "",
  faviconUrl: "",
};

// liked webiste array
let likedUrl = [];

//get the current open tab
async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

//current open tab
getCurrentTab().then((tab) => {
  value = {
    ...value,
    id: tab.id,
    currentUrl: tab.url,
    faviconUrl: tab.favIconUrl,
  };

  activeUrl.innerHTML = value.currentUrl;
  activeUrl.setAttribute("href", `${value.currentUrl}`);
  document.getElementById("image").src = value.faviconUrl;
});

function init() {
  var listItem = document.createElement("li");
  var box = document.createElement("div");
  var boxLeftImg = document.createElement("img");
  var boxUrl = document.createElement("a");
  var boxRight = document.createElement("div");
  var boxRightImg = document.createElement("img");

  listItem.setAttribute("class", "likeUrl");
  box.setAttribute("class", "urlContainer");
  boxLeftImg.setAttribute("id", "image");
  boxUrl.setAttribute("id", "likedUrl");
  boxUrl.setAttribute("target", "_blank");
  boxRight.setAttribute("id", "remove");
  boxRightImg.setAttribute("id", "image");

  boxRightImg.src = "../../icons/Delete.png";
  boxRight.appendChild(boxRightImg);
}

function addBox() {
  box.append(boxLeftImg, boxUrl, boxRight);
  listItem.appendChild(box);

  list.appendChild(listItem);
}

//update the likedUrl
function update(array) {
  likedUrl.push(...array);
  chrome.storage.sync.set({
    liked: likedUrl,
  });
}

//list out stored liked website
function listStoredWebsite() {
  //get the liked array
  chrome.storage.sync.get({ liked: [] }, function (data) {
    const len = data.liked.length;
    const val = data.liked;
    if (len === 0) {
      noWebsite.style.display = "block";
    } else {
      for (let i = 0; i < len; i++) {
        var listItem = document.createElement("li");
        var box = document.createElement("div");
        var boxLeftImg = document.createElement("img");
        var boxUrl = document.createElement("a");
        var boxRight = document.createElement("div");
        var boxRightImg = document.createElement("img");

        listItem.setAttribute("class", "likeUrl");
        box.setAttribute("class", "urlContainer");
        boxLeftImg.setAttribute("id", "image");
        boxUrl.setAttribute("id", "likedUrl");
        boxUrl.setAttribute("target", "_blank");
        boxRight.setAttribute("id", "remove");
        boxRightImg.setAttribute("id", "image");

        boxRightImg.src = "../../icons/Delete.png";
        boxRight.appendChild(boxRightImg);

        boxLeftImg.src = val[i].faviconUrl;
        boxUrl.innerHTML = val[i].currentUrl;

        boxUrl.setAttribute("href", `${val[i].currentUrl}`);

        box.append(boxLeftImg, boxUrl, boxRight);
        listItem.appendChild(box);

        list.appendChild(listItem);
      }
    }
  });
}

listStoredWebsite();

//like button event handler
likeButton.addEventListener("click", () => {
  noWebsite.style.display = "none";
  let val = [];

  var listItem = document.createElement("li");
  var box = document.createElement("div");
  var boxLeftImg = document.createElement("img");
  var boxUrl = document.createElement("a");
  var boxRight = document.createElement("div");
  var boxRightImg = document.createElement("img");

  listItem.setAttribute("class", "likeUrl");
  box.setAttribute("class", "urlContainer");
  boxLeftImg.setAttribute("id", "image");
  boxUrl.setAttribute("id", "likedUrl");
  boxUrl.setAttribute("target", "_blank");
  boxRight.setAttribute("id", "remove");
  boxRightImg.setAttribute("id", "image");

  boxRightImg.src = "../../icons/Delete.png";
  boxRight.appendChild(boxRightImg);

  boxLeftImg.src = value.faviconUrl;
  boxUrl.innerHTML = value.currentUrl;
  boxUrl.setAttribute("href", `${value.currentUrl}`);

  box.append(boxLeftImg, boxUrl, boxRight);
  listItem.appendChild(box);

  list.appendChild(listItem);

  chrome.storage.sync.get({ liked: [] }, function (data) {
    val.push(...data.liked);
    val.push(value);
    update(val);
  });
});

//li as target in ul
function getEventTarget(e) {
  e = e || window.event;
  return e.target || e.srcElement;
}

//current selected li
list.onclick = function (event) {
  let target = getEventTarget(event);
  let li = target.closest("li");
  let nodes = Array.from(li.closest("ul").children);
  let index = nodes.indexOf(li);

  selectedLi = index;
  chrome.storage.sync.get({ liked: [] }, function (data) {
    data.liked.splice(index, 1);
    update(data.liked);
  });
  nodes[index].remove();
};
