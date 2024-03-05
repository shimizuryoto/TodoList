const form = document.getElementById("form");
const input = document.getElementById("input");//ホームに入力されたinputタグのデータを入れる
const ul = document.getElementById("ul");
const ulAll = document.getElementById("ulAll");
let Alllist = JSON.parse(localStorage.getItem("Alllist"));

const currentDate = new Date();
const thisyear = currentDate.getFullYear(); // 年を取得
const thismonth = String(currentDate.getMonth() + 1).padStart(2, '0'); // 月を取得（0埋め）
const today = String(currentDate.getDate()).padStart(2, '0'); // 日を取得（0埋め）


// ページが読み込まれたときに日付を挿入する
window.addEventListener('load', function() {
    const dateElement = document.getElementById('date');
    const currentDate1 = `${thisyear}/${thismonth}/${today}`;
    dateElement.textContent = ` ${currentDate1}`;
});

//フォーム入力
form.addEventListener("submit", function(event){//enterで反応
    //event.preventDefault();//リロード阻止
    add();
});

//配列にあるやつをリロードしても入れる機能
if (Alllist){
    Alllist.forEach(item => {
        display(item);
    });
};



function add() {
    // ローカルストレージから既存のデータを取得
    let existingData = localStorage.getItem("Alllist");

    // 既存のデータがある場合はパースして配列に変換し、ない場合は空の配列を生成
    let allData = existingData ? JSON.parse(existingData) : [];

    let data = {//オブジェクト
        text: input.value,
        completed: false,
        month:currentDate.getMonth() + 1,
        day:currentDate.getDate(),
        status:0,
        id: "todoId"
    };
    allData.push(data);
    localStorage.setItem("Alllist", JSON.stringify(allData));
    input.value = "";
}

function display(item) {
    //todoの更新
    check(item);

    //li準備
    const li = document.createElement("li");//li要素の定義
    li.innerText = item.text;//テキストを入れてる
    li.classList.add("list-group-item");//liにlist-group-itemというクラス名を追加
    li.id = item.id

    //横線ひくか否か
    if (item && item.completed){
        li.classList.add("text-decoration-line-through");
    }
    //左クリック横線
    li.addEventListener("click", function(event){
        li.classList.toggle("text-decoration-line-through");
        addsaveData(item);
    });
    
    //右クリック削除
    li.addEventListener("contextmenu", function(event){
        event.preventDefault();
        li.remove();
        addsaveData(item);
        removeData(li.innerText);
    });

    ulAll.appendChild(li);//liを追加している
    if (li.id === "todoId"){
        ul.appendChild(li);//liを追加している
    } 
    input.value = "";
    addsaveData(item);
}

function removeData(text) {
    Alllist = Alllist.filter(item => item.text !== text);
    localStorage.setItem("Alllist", JSON.stringify(Alllist));
}

function check(item) {//ここでstatusを変えてる．

    let updateNeeded = false;
    const year = currentDate.getFullYear(); // 年を取得
    const todayMonth = currentDate.getMonth() + 1;
    const todayDay = currentDate.getDate();
    const specialmonthes = [4, 6, 9, 11];
    let dec = 0;
    let adjust = 0;

    if (specialmonthes.includes(item.month)) {
        adjust = 1;
    } else if (item.month === 2) {
        if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)){//うるう年判定
            adjust = 2;
        } else{
            adjust = 3;
        }
    } else if(item.month === 12) {   // 12月
        dec = 12;
    }   

    // その他は31日/月
    if (item.status === 0 && item.day !== todayDay) {
        updateNeeded = true;
    } else if (item.status === 1 && (item.day === (todayDay - 3) || (item.day >= (29-adjust) && item.day === (todayDay - 3 + 31-adjust)))) {
        updateNeeded = true;
    } else if (item.status === 2 && (item.day === (todayDay - 7) || (item.day >= (25-adjust) && item.day === (todayDay - 7 + 31-adjust)))) {
        updateNeeded = true;
    } else if (item.status === 3 && (item.day === (todayDay - 14) || (item.day >= (18-adjust) && item.day === (todayDay - 14 + 31-adjust)))) {
        updateNeeded = true;
    } else if (item.status === 4 && item.month === (todayMonth - 1 + dec)) {
        updateNeeded = true;
    }

    if (updateNeeded) {
        item.month = currentDate.getMonth() + 1;
        item.day = currentDate.getDate();
        item.status++;
    }

    if (item.month === currentDate.getMonth() + 1 && item.day === currentDate.getDate()) {
        item.id = "todoId";
    } else {
        item.id = "AllId";
    }
}

function addsaveData(item) {
    let existingData = JSON.parse(localStorage.getItem("Alllist")) || []; // 既存のデータを取得

    // 重複をチェック
    let isDuplicate = existingData.some(list => {
        return list.text === item.text && list.month === item.month && list.day === item.day && list.status === item.status;
    });

    if (!isDuplicate) {
        existingData = existingData.filter(list => list.text !== item.text); // 更新前のリストを削除
        existingData.push(item);
        localStorage.setItem("Alllist", JSON.stringify(existingData)); // 保存
    }
}

