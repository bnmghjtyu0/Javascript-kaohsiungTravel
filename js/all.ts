let _data;
import { zones } from "./constant.mjs";
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
//   renderGrid();
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
  renderTableRwd(arraySet, "matchData");
  renderGrid(arraySet, currentArea);
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
  renderGrid(arraySet, selectedArea);
  renderTableRwd(arraySet, "matchData");
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
  renderGrid(arraySet, area);
  renderTableRwd(arraySet, "matchData");
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
function renderGrid(location, area) {
  let currentArea = "";

  var thumbnail = "";
  for (let i = 0; i < location.length; i++) {
    // for (let j = 0; j < zones.length; j++) {
    //   console.log(zones[j]);
    //   if (location[i].Add.indexOf(zones[j]) > -1) {
    //     currentArea = zones[j];
    //   }
    // }

    thumbnail += `<div class="card thumbnail mb-3">
                    <a href="${location[i].Picture1}" data-fancybox="images" data-caption="${location[i].Name}" class="pic" style="background:url(${location[i].Picture1})">
                      <h4 class="picTitle">${location[i].Name}</h4>
                     <!-- <span class="picLocation">${currentArea}</span> -->
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
// function renderTable(location, tbody) {
//   var tr, td;
//   tbody = document.getElementById(tbody);
//   tbody.innerHTML = "";
//   for (var i = 0; i < location.length; i++) {
//     tr = tbody.insertRow(tbody.rows.length);
//     // td = tr.insertCell(tr.cells.length);
//     // td.innerHTML = location[i].Zone;
//     td = tr.insertCell(tr.cells.length);
//     td.innerHTML = location[i].Name;
//     td = tr.insertCell(tr.cells.length);
//     td.innerHTML = location[i].Add;
//     td = tr.insertCell(tr.cells.length);
//     td.innerHTML = `<a href="${location[i].Picture1}"data-fancybox="images" data-caption="${location[i].Name}">
//   <img src="${location[i].Picture1}" style="width:120px;">
// </a>`;
//     td = tr.insertCell(tr.cells.length);
//     td.innerHTML = location[i].Changetime;
//   }
// }
function renderTableRwd(location, tbody) {
  let div = document.getElementById(tbody);
  div.innerHTML = "";
  for (var i = 0; i < location.length; i++) {
    let tr = document.createElement("div");
    tr.classList.add("table-tr");
    for (let j = 0; j < 4; j++) {
      // if (i % 4 === 0) break;
      let td = document.createElement("div");
      td.classList.add("table-td");
      if (j === 0) {
        td.textContent = location[i].Name;
        td.setAttribute("data-label", "名稱");
      }
      if (j === 1) {
        td.textContent = location[i].Add;
        td.setAttribute("data-label", "地址");
      }
      if (j === 2) {
        td.innerHTML = `<a href="${location[i].Picture1}"data-fancybox="images" data-caption="${location[i].Name}">
           <img src="${location[i].Picture1}" style="width:120px;">
         </a>`;
        td.setAttribute("data-label", "圖片");
      }
      if (j === 3) {
        td.innerHTML = location[i].Changetime;
        td.setAttribute("data-label", "時間");
      }

      tr.appendChild(td);
    }

    //     td.innerHTML = location[i].Name;
    //     td.innerHTML = location[i].Add;
    //     td.innerHTML = `<a href="${location[i].Picture1}"data-fancybox="images" data-caption="${location[i].Name}">
    //   <img src="${location[i].Picture1}" style="width:120px;">
    // </a>`;
    //     td.innerHTML = location[i].Changetime;

    div.appendChild(tr);
  }
}

function renderOptions(_data) {
  let arrayA = [..._data];
  // 先將Zone印出

  // 將過濾的 zone 回傳到DOM ============================================================================
  let select = "";
  let list = "";

  for (var i = 0; zones.length > i; i++) {
    list += `<li><a href="#">${_data[i].Add}</a></li>`;
    select += `<option>${zones[i]}</option>`;
    onSelect.innerHTML = select;
  }
  return arrayA;
}
