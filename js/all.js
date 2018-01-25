var _data;
// 下載資料
var xhr = new XMLHttpRequest();
xhr.open(
  "get",
  "https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97",
  true
);
xhr.send(null);
xhr.onload = function() {
  _data = JSON.parse(xhr.responseText);
  funcA(_data);
  funcList();
};
// DOM
var domList = document.querySelector(".areaHitoList");
var domSelect = document.querySelector(".selectTravel");
var viewBlock = document.querySelector(".viewBlock");
var viewTable = document.querySelector(".viewTable");
var title = document.querySelector(".areaTitle");
var pipePic = document.querySelector("#pipePic");
var pipeTable = document.querySelector("#pipeTable");

// 監聽
domSelect.addEventListener("change", selectChangeFun, false);
domList.addEventListener("click", listFun, false);

pipeTable.addEventListener("click", function(e) {
  e.preventDefault();
  funcTable();
  viewBlock.style.display = "none";
  viewTable.style.display = "block";
});
pipePic.addEventListener("click", function(e) {
  e.preventDefault();
  funcList();
  viewBlock.style.display = "block";
  viewTable.style.display = "none";
});

// 設定初始值
viewTable.style.display = "none";
function funcList() {
  var arraySet = funcSet("三民區");
  postData(arraySet);
}
function funcTable() {
  var arraySet = funcSet("三民區");
  drawTable(arraySet, "matchData");
}

// 選擇select觸發
function selectChangeFun(e) {
  var string = e.target.value;
  var arraySet = funcSet(string);
  postData(arraySet);
  drawTable(arraySet, "matchData");
  title.textContent = string;
}
// 點擊按鈕觸發
function listFun(e) {
  e.preventDefault();
  if (e.target.nodeName !== "A") {
    return false;
  }
  var string = e.target.textContent;
  var arraySet = funcSet(string);
  postData(arraySet);
  drawTable(arraySet, "matchData");
  title.textContent = string;
}

// 將符合選擇地區的資訊 post 出來 - 圖文
function postData(location) {
  var thumbnail = "";
  location.map(function(value) {
   

    var arr = [];
    arr.push(value);

    if (value.Website == "") {
      value.Website = "#";
    }
    
    for (let i = 0; i < arr.length; i++) {
      thumbnail += `<div class="card thumbnail mb-3">
                <a href="${arr[i].Picture1}" data-fancybox="images" data-caption="${arr[i].Name}" class="pic" style="background:url(${arr[i].Picture1})">
                    <h4 class="picTitle">${arr[i].Name}</h4>
                    <span class="picLocation">${arr[i].Zone}</span>
                </a>
                <div class="caption">
                    <ul class="areaList">
                        <li class="areaTime">${arr[i].Opentime}</li>
                        <li class="areaLocation">${arr[i].Add}</li>
                        <li class="areaPhone">${arr[i].Tel}</li>
                    </ul>
                    <div class="tag">
                    <a href="${arr[i].Website}" target="_blank">相關連結</a>
                    </div>
                </div>
        </div>`;
    }
  });
  viewBlock.innerHTML = thumbnail;
}

// 表格
function drawTable(location, tbody) {
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
    td.innerHTML = `<a href="${
      location[i].Picture1
    }"data-fancybox="images" data-caption="${location[i].Name}">
    <img src="${location[i].Picture1}" style="width:120px;">
  </a>`;
    td = tr.insertCell(tr.cells.length);
    td.innerHTML = location[i].Opentime;
  }
}

// 從 alldata 裡面去找尋地區跟 string 相同的資料並回傳
function funcSet(string) {
  var arraySet = [];
  var data = _data.result.records;
  for (var i = 0; data.length > i; i++) {
    if (string == data[i].Zone) {
      arraySet.push(data[i]);
    }
  }
  return arraySet;
}

// 過濾掉重複的地區，放進select與按鈕
function funcA() {
  arrayA = _data.result.records;
  // 先將Zone印出
  arrayZone = [];
  for (var i = 0; arrayA.length > i; i++) {
    arrayZone.push(arrayA[i].Zone);
  }
  // 過濾Zone重複的值
  var zone = [];
  arrayZone.forEach(function(value) {
    if (zone.indexOf(value) == -1) {
      zone.push(value);
    }
  });
  // 將過濾的 zone 回傳到DOM ============================================================================
  select = "";
  list = "";

  for (var i = 0; zone.length > i; i++) {
    list += `<li><a href="#">${_data.result.records[i].Zone}</a></li>`;
    select += `<option>${zone[i]}</option>`;
    domSelect.innerHTML = select;
  }
  return arrayA;
}
