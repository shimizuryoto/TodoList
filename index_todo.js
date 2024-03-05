const form = document.getElementById("form");
const input = document.getElementById("input");//ホームに入力されたinputタグのデータを入れる
const ul = document.getElementById("ul");

const todos = JSON.parse(localStorage.getItem("todos"));


if (todos){//配列にあるやつをリロードしても入れる機能
    todos.forEach(todo => {
        add(todo);
    })
}

form.addEventListener("submit", function(event){//enterで反応
    event.preventDefault();//リロード阻止
    add();
});

function add(todo) {
    let todoText = input.value;//todoにinputの値を入れる

    if (todo){
        todoText = todo.text;
    }
    if (todoText.length > 0){
        const li = document.createElement("li");//liタグを作ってる
        li.innerText = todoText;//リストにしてる
        li.classList.add("list-group-item");//liにlist-group-itemというクラス名を追加
        
        if (todo && todo.completed){
            li.classList.add("text-decoration-line-through");
        }

        li.addEventListener("contextmenu", function(event){
            event.preventDefault();
            li.remove();
            saveData();
        });
        li.addEventListener("click", function(event){
            li.classList.toggle("text-decoration-line-through");
            saveData();
        });
        ul.appendChild(li);//liを追加している
        input.value = "";
        saveData();
    }
}

function saveData(){
    const lists = document.querySelectorAll("li");
    let todos = [];

    lists.forEach(list => {//listsの要素を丸ごとループに入れる．listはなんでもいい
        let todo = {//オブジェクト
            text: list.innerText,
            completed: list.classList.contains("text-decoration-line-through")

        };
        todos.push(todo);
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}


