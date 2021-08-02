let _data;
import { zones } from "./constant.mjs";
const response = fetch("./khh0720.csv").then((response2) => response2.text()).then((v) => Papa.parse(v)).catch((err) => console.log(err));
var onAreaHitoList = document.querySelector(".areaHitoList");
var onSelect = document.querySelector(".selectTravel");
var viewBlock = document.querySelector(".viewBlock");
var viewTable = document.querySelector(".viewTable");
var title = document.querySelector(".areaTitle");
var onGrid = document.querySelector("#typeGrid");
var onTable = document.querySelector("#typeTable");
let currentArea = "\u5168\u90E8\u5730\u5340";
let gridType = "table";
(async () => {
  const mockData = await response.then((v) => parseCSVtoJSON(v.data));
  _data = [...mockData];
  var arraySet = filterAreas(currentArea);
  title.textContent = currentArea;
  renderOptions(_data);
  renderTable(arraySet, "matchData");
  renderGrid(arraySet, currentArea);
  handleChangeType(gridType);
})();
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
function handleTravelSelectChange(e) {
  var selectedArea = e.target.value;
  var arraySet = filterAreas(selectedArea);
  renderGrid(arraySet, selectedArea);
  renderTable(arraySet, "matchData");
  title.textContent = selectedArea;
}
function handleAutoHitoList(e) {
  e.preventDefault();
  if (e.target.nodeName !== "A") {
    return false;
  }
  var area = e.target.textContent;
  var arraySet = filterAreas(area);
  renderGrid(arraySet, area);
  renderTable(arraySet, "matchData");
  title.textContent = area;
}
function filterAreas(area) {
  var result = [];
  var data = [..._data];
  if (area === "\u5168\u90E8\u5730\u5340") {
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
function parseCSVtoJSON(arr) {
  const [headings, ...data] = arr;
  return data.reduce((acc, data2, i) => {
    const obj = {};
    for (const [index, heading] of headings.entries()) {
      obj[heading] = data2[index];
    }
    return [...acc, obj];
  }, []);
}
function renderGrid(location, area) {
  let currentArea2 = "";
  var thumbnail = "";
  for (let i = 0; i < location.length; i++) {
    thumbnail += `<div class="card thumbnail mb-3">
                    <a href="${location[i].Picture1}" data-fancybox="images" data-caption="${location[i].Name}" class="pic" style="background:url(${location[i].Picture1})">
                      <h4 class="picTitle">${location[i].Name}</h4>
                     <!-- <span class="picLocation">${currentArea2}</span> -->
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
function renderTable(location, tbody) {
  var tr, td;
  tbody = document.getElementById(tbody);
  tbody.innerHTML = "";
  for (var i = 0; i < location.length; i++) {
    tr = tbody.insertRow(tbody.rows.length);
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
function renderOptions(_data2) {
  let arrayA = [..._data2];
  let select = "";
  let list = "";
  for (var i = 0; zones.length > i; i++) {
    list += `<li><a href="#">${_data2[i].Add}</a></li>`;
    select += `<option>${zones[i]}</option>`;
    onSelect.innerHTML = select;
  }
  return arrayA;
}
