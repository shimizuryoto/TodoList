const form = document.getElementById("form");
const input = document.getElementById("input");//ホームに入力されたinputタグのデータを入れる
const ul = document.getElementById("ul");
const ulAll = document.getElementById("ulAll");
let Alllist = JSON.parse(localStorage.getItem("Alllist"));//ローカルストレージを呼び出してる

//現在の時間の取得
const currentDate = new Date();
const thisYear = currentDate.getFullYear();
const thisMonth = currentDate.getMonth() + 1;
const toDay = currentDate.getDate();
const month = String(thisMonth).padStart(2, '0');
const day = String(toDay).padStart(2, '0');



// ページが読み込まれたときに日付を挿入する
window.addEventListener('load', function() {
    const dateElement = document.getElementById('date');
    const currentDateDisplay = `${thisYear}/${month}/${day}`;
    dateElement.textContent = ` ${currentDateDisplay}`;
});

//フォーム入力
form.addEventListener("submit", function(event){//enterで反応
    add();
});

//リロードしても入れる機能
if (Alllist){
    Alllist.forEach(item => {
        display(item);
    });
};



function add() {
    //空の場合は入れない
    if (input.value.length > 0){
    let data = {//オブジェクト
        text: input.value,
        completed: false,
        month:currentDate.getMonth() + 1,
        day:currentDate.getDate(),
        status:0,
        id: "todoId"
    };
    Alllist.push(data);
    localStorage.setItem("Alllist", JSON.stringify(Alllist));
    input.value = "";
    }
}

function display(item) {
    //todoの更新
    check(item);

    //li要素の定義
    const li = document.createElement("li");
    li.innerText = item.text;
    li.classList.add("list-group-item");
    li.id = item.id

    //左クリック横線
    if (item && item.completed){
        li.classList.add("text-decoration-line-through");
    }
    li.addEventListener("click", function(event){
        li.classList.toggle("text-decoration-line-through");
        saveData(item);
    });
    
    //右クリック削除
    li.addEventListener("contextmenu", function(event){
        event.preventDefault();
        li.remove();
        saveData(item);
        removeData(li.innerText);
    });

    //liを追加している
    ulAll.appendChild(li);
    if (li.id === "todoId"){
        ul.appendChild(li);
    } 
    input.value = "";
    saveData(item);
}

//ローカルストレージから削除してる
function removeData(text) {
    Alllist = Alllist.filter(item => item.text !== text);
    localStorage.setItem("Alllist", JSON.stringify(Alllist));
}

///statusを変える．
function check(item) {
    let updateNeeded = false;
    const specialmonthes = [4, 6, 9, 11];
    let dec = 0;
    let adjust = 0;

    if (specialmonthes.includes(item.month)) {
        adjust = 1;
    } else if (item.month === 2) {//2月
        if ((thisYear % 4 === 0 && thisYear % 100 !== 0) || (thisYear % 400 === 0)){//うるう年判定
            adjust = 2;
        } else{
            adjust = 3;
        }
    } else if(item.month === 12) {// 12月
        dec = 12;
    }   

    // その他は31日/月
    if (item.status === 0 && item.day !== toDay) {
        updateNeeded = true;
    } else if (item.status === 1 && (item.day === (toDay - 3) || (item.day >= (29-adjust) && item.day === (toDay - 3 + 31-adjust)))) {
        updateNeeded = true;
    } else if (item.status === 2 && (item.day === (toDay - 7) || (item.day >= (25-adjust) && item.day === (toDay - 7 + 31-adjust)))) {
        updateNeeded = true;
    } else if (item.status === 3 && (item.day === (toDay - 14) || (item.day >= (18-adjust) && item.day === (toDay - 14 + 31-adjust)))) {
        updateNeeded = true;
    } else if (item.status === 4 && item.month === (thisMonth - 1 + dec)) {
        updateNeeded = true;
    }

    //todoリスト入り
    if (updateNeeded) {
        item.month = thisMonth;
        item.day = toDay;
        item.status++;
    }

    if (item.month === thisMonth && item.day === toDay) {
        item.id = "todoId";
    } else {
        item.id = "AllId";
    }
}

//データをセーブ
function saveData(item) {
    // 重複をチェック
    let Duplicate = Alllist.some(list => {
        return list.text === item.text && list.month === item.month && list.day === item.day && list.status === item.status;
    });

    if (!Duplicate) {
        Alllist = Alllist.filter(list => list.text !== item.text); // 更新前のリストを削除
        Alllist.push(item);
        localStorage.setItem("Alllist", JSON.stringify(Alllist)); // 保存
    }
}

