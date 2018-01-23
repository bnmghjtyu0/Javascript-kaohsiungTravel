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
  funcB();
};
// DOM
var domList = document.querySelector(".areaHitoList");
var domSelect = document.querySelector(".selectTravel");
var viewBlock = document.querySelector(".viewBlock");
var title = document.querySelector(".areaTitle");
// 監聽
domSelect.addEventListener("change", selectChangeFun, false);
domList.addEventListener("click", listFun, false);

// 設定初始值
function funcB() {
  var arraySet = funcSet("內門區");
  postData(arraySet);
}

// 選擇select觸發
function selectChangeFun(e) {
  var string = e.target.value;
  var arraySet = funcSet(string);
  postData(arraySet);
  title.textContent = string;
}
// 點擊按鈕觸發
function listFun(e) {
  e.preventDefault();
  var string = e.target.textContent;
  var arraySet = funcSet(string);
  postData(arraySet);
  title.textContent = string;
}

// 將符合選擇地區的資訊 post 出來
function postData(location) {
  var string = "";
  for (let i = 0; i < location.length; i++) {
    string +=
      `<div class="col-xs-12 col-sm-6">
            <div class="thumbnail">
                <div class="pic">
                    <h4 class="picTitle">${location[i].Name}</h4>
                    <span class="picLocation">` +
      location[i].Zone +
      `</span>
                </div>
                <div class="caption">
                    <ul class="areaList">
                        <li class="areaTime">${location[i].Opentime}</li>
                        <li class="areaLocation">${location[i].Add}</li>
                        <li class="areaPhone">${location[i].Tel}</li>
                    </ul>
                    <div class="tag">
                        <i class="fa fa-tag" aria-hidden="true"></i>
                        <span class="areaTag">${location[i].Ticketinfo}</span>
                    </div>
                </div>
            </div>
        </div>
            `;
  }
  viewBlock.innerHTML = string;
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
