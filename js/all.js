let _data;
// API
// var xhr = new XMLHttpRequest();
// xhr.open(
//   "get",
//   "https://data.kcg.gov.tw/api/action/datastore_search?resource_id=7720efce-a21b-466d-98bd-bfd3b24d7274",
//   true
// );
// xhr.send(null);
// xhr.onload = function () {
//   _data = JSON.parseCSVtoJSON(xhr.responseText);
//   renderOptions();
//   renderList();
// };

// mock data
const response = fetch("./khh0720.csv")
  .then((response) => response.text())
  .then((v) => Papa.parse(v))
  .catch((err) => console.log(err));

// get elements
var onAreaHitoList = document.querySelector(".areaHitoList");
var onSelect = document.querySelector(".selectTravel");
var viewBlock = document.querySelector(".viewBlock");
var viewTable = document.querySelector(".viewTable");
var title = document.querySelector(".areaTitle");
var onGrid = document.querySelector("#typeGrid");
var onTable = document.querySelector("#typeTable");

// 設定初始值 initial state
let currentArea = "全部地區";
let gridType = "table";

// first load
(async () => {
  const mockData = await response.then((v) => parseCSVtoJSON(v.data));
  _data = [...mockData];
  var arraySet = filterAreas(currentArea);
  title.textContent = currentArea;
  renderOptions(_data);
  renderTable(arraySet, "matchData");
  renderList(arraySet, currentArea);
  handleChangeType(gridType);
})();

//事件
onSelect.addEventListener("change", handleTravelSelectChange, false);
onAreaHitoList.addEventListener("click", handleAutoHitoList, false);
onTable.addEventListener("click", () => handleChangeType("table"));
onGrid.addEventListener("click", () => handleChangeType("grid"));

function handleChangeType(type) {
  if (type === "grid") {
    gridType = "grid";
    viewBlock.style.display = "block";
    viewTable.style.display = "none";
  }
  if (type === "table") {
    gridType = "table";
    viewBlock.style.display = "none";
    viewTable.style.display = "block";
  }
}
// 選擇select觸發
function handleTravelSelectChange(e) {
  var selectedArea = e.target.value;
  var arraySet = filterAreas(selectedArea);
  renderList(arraySet, selectedArea);
  renderTable(arraySet, "matchData");
  title.textContent = selectedArea;
}
// 點擊按鈕觸發
function handleAutoHitoList(e) {
  e.preventDefault();
  if (e.target.nodeName !== "A") {
    return false;
  }
  var area = e.target.textContent;
  var arraySet = filterAreas(area);
  renderList(arraySet, area);
  renderTable(arraySet, "matchData");
  title.textContent = area;
}

// 從 alldata 裡面去找尋地區跟 string 相同的資料並回傳
function filterAreas(area) {
  var result = [];
  var data = [..._data];
  if (area === "全部地區") {
    return data;
  }
  for (var i = 0; i < data.length; i++) {
    let dataArea = data[i].Add;
    if (dataArea && dataArea.indexOf(area) > -1) {
      result.push(data[i]);
    }
  }
  return result;
}

// load csv
function parseCSVtoJSON(arr) {
  const [headings, ...data] = arr;
  return data.reduce((acc, data, i) => {
    const obj = {};
    for (const [index, heading] of headings.entries()) {
      obj[heading] = data[index];
    }
    return [...acc, obj];
  }, []);
}

// 清單
function renderList(location, area) {
  var thumbnail = "";
  for (let i = 0; i < location.length; i++) {
    thumbnail += `<div class="card thumbnail mb-3">
                    <a href="${location[i].Picture1}" data-fancybox="images" data-caption="${location[i].Name}" class="pic" style="background:url(${location[i].Picture1})">
                      <h4 class="picTitle">${location[i].Name}</h4>
                      <span class="picLocation">${area}</span>
                    </a>
                    <div class="caption">
                      <ul class="areaList">
                          <li class="areaTime">${location[i].Changetime}</li>
                          <li class="areaLocation">${location[i].Add}</li>
                          <li class="areaPhone">${location[i].Tel}</li>
                      </ul>
                      <div class="tag">
                      <!-- <a href="${location[i].Website}" target="_blank">${location[i].Website}</a> -->
                        
                      </div>
                    </div>
                  </div>`;
  }
  viewBlock.innerHTML = thumbnail;
}

// 表格
function renderTable(location, tbody) {
  var tr, td;
  tbody = document.getElementById(tbody);
  tbody.innerHTML = "";
  for (var i = 0; i < location.length; i++) {
    tr = tbody.insertRow(tbody.rows.length);
    td = tr.insertCell(tr.cells.length);
    td.innerHTML = location[i].Zone;
    td = tr.insertCell(tr.cells.length);
    td.innerHTML = location[i].Name;
    td = tr.insertCell(tr.cells.length);
    td.innerHTML = location[i].Add;
    td = tr.insertCell(tr.cells.length);
    td.innerHTML = `<a href="${location[i].Picture1}"data-fancybox="images" data-caption="${location[i].Name}">
  <img src="${location[i].Picture1}" style="width:120px;">
</a>`;
    td = tr.insertCell(tr.cells.length);
    td.innerHTML = location[i].Changetime;
  }
}

function renderOptions(_data) {
  arrayA = [..._data];
  // 先將Zone印出
  let zone = [
    "全部地區",
    "前金",
    "新興",
    "鹽埕",
    "左營",
    "楠梓",
    "鼓山",
    "旗津",
    "苓雅",
    "三民",
    "前鎮",
    "小港",
    "鳳山",
    "鳥松",
    "大社",
    "仁武",
    "大樹",
    "岡山",
    "燕巢",
    "梓官",
    "永安",
    "彌陀",
    "橋頭",
    "田寮",
    "茄萣",
    "阿蓮",
    "路竹",
    "湖內",
    "那瑪夏",
    "桃源",
    "茂林",
    "六龜",
    "美濃",
    "旗山",
    "甲仙",
    "內門",
    "杉林",
    "林園",
    "大寮",
  ];

  // 將過濾的 zone 回傳到DOM ============================================================================
  select = "";
  list = "";

  for (var i = 0; zone.length > i; i++) {
    list += `<li><a href="#">${_data[i].Add}</a></li>`;
    select += `<option>${zone[i]}</option>`;
    onSelect.innerHTML = select;
  }
  return arrayA;
}
