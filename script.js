let db = openDatabase("labwork5", "1.0", "Labwork 5 DB", 200000);

db.transaction(function (t) {
    t.executeSql("CREATE TABLE IF NOT EXISTS automobile (automobile_id INTEGER PRIMARY KEY AUTOINCREMENT, automobile_series TEXT NOT NULL UNIQUE, type TEXT NOT NULL, address TEXT NOT NULL, release_date TEXT NOT NULL, phone TEXT, mark TEXT)");
    //t.executeSql("DROP TABLE automobile");
});

class Automobile {

    constructor(automobile_series, type, address, release_date) {
        this._automobile_series = automobile_series;
        this._type = type;
        this._address = address;
        this._release_date = release_date;
    }


    get get_automobile_series() {
        return this._automobile_series;
    }

    get get_type() {
        return this._type;
    }

    get get_address() {
        return this._address;
    }

    get get_release_date() {
        return this._release_date;
    }

/*    set_phone(value) {
        this._phone = value;
    }

    get get_phone() {
        return this._phone;
    }

    set_mark(value) {
        this._mark = value;
    }

    get get_mark() {
        return this._mark;
    }*/
}

function add_automobile() {
    let automobile_series = document.getElementById("series").value;
    let type = document.getElementById("typ").value;
    let address = document.getElementById("address").value;
    let release_date = document.getElementById("releaseDate").value;
    // alert(company_name + " " + country + " " + email + " " + products_number);
    let automobile = new Automobile(automobile_series, type, address, release_date);
    if (document.getElementById("addInfoKey")){
        let add_info = document.getElementById("addInfoKey").value;
        if (add_info === "phone") {
            Automobile.prototype._phone;
            automobile._phone = document.getElementById("addInfoValue").value;
           /* automobile.set_phone(document.getElementById("addInfoValue").value);*/
        } else if (add_info === "mark") {
            Automobile.prototype._mark;
            automobile._mark = document.getElementById("addInfoValue").value;
            /*automobile.set_mark(document.getElementById("addInfoValue").value);*/
        }
    }

    insert(automobile);
    load_table();
    return false;
}

function insert(automobile) {
    if ('_phone' in automobile) {
        /*alert("Автомобиль с телефоном компании!");*/
        db.transaction(function (t) {
            t.executeSql("INSERT INTO automobile (automobile_series, type, address, release_date, phone) VALUES (?, ?, ?, ?, ?)",
                [automobile.get_automobile_series, automobile.get_type, automobile.get_address, automobile.get_release_date, automobile._phone],
                success, error);
        });
    } else
    if ('_mark' in automobile) {
        /*alert("Автомобиль с маркой!");*/
        db.transaction(function (t) {
            t.executeSql("INSERT INTO automobile (automobile_series, type, address, release_date, mark) VALUES (?, ?, ?, ?, ?)",
                [automobile.get_automobile_series, automobile.get_type, automobile.get_address, automobile.get_release_date, automobile._mark],
                success, error);
        });
    }else{

        /*alert("Автомобиль без свойства!");*/
        db.transaction(function (t) {
            t.executeSql("INSERT INTO automobile (automobile_series, type, address, release_date) VALUES (?, ?, ?, ?)",
                [automobile.get_automobile_series, automobile.get_type, automobile.get_address, automobile.get_release_date],
                success, error);
        });
    }

}

function success() {
    alert("Информация успешно добавлена!");
    document.getElementById("series").value = "";
    document.getElementById("address").value = "";
    if (document.getElementById("addInfoKey") != null && document.getElementById("addInfoValue") != null) {
        remove_fields();
    }
}

function error(transaction, error) {
    alert("Произошла ошибка!" + error.message);
}

function load_table() {
    if (db) {
        db.transaction(function (t) {
            t.executeSql("SELECT automobile_id, automobile_series, type, address, release_date, phone, mark FROM automobile",
                [], update_table);
        })
    }
}

function update_table(transaction, result) {
    let table = document.getElementById("automobileTable");
    let select = document.getElementById("automobileID");
    let properties = document.getElementById("automobileProperties");
    properties.innerHTML = "<th>ID</th>\n" +
        "<th>Серия</th>\n" +
        "<th>Назначение</th>\n" +
        "<th>Адрес</th>\n" +
        "<th>Дата выпуска</th>";
    let phone = false;
    let mark = false;
    let number = table.rows.length;
    for (let i = 1; i < number; i++) {
        select.remove(0);
        table.deleteRow(1);
    }
    let rows = result.rows;
    for (let i = 0; i < rows.length; i++) {
        let row = rows.item(i);
        if (row.phone != null && !phone) {
            phone = true;
        }
        if (row.mark != null && !mark) {
            mark = true;
        }
    }
    if (phone) {
        properties.insertAdjacentHTML("beforeend", "<th>Телефон</th>");
    }
    if (mark) {
        properties.insertAdjacentHTML("beforeend", "<th>Марка</th>");
    }
    for (let i = 0; i < rows.length; i++) {
        let row = rows.item(i);
        let tr = table.insertRow(-1);
        let automobile_id = tr.insertCell(0);
        automobile_id.innerText = row.automobile_id;
        let automobile_series = tr.insertCell(1);
        automobile_series.innerText = row.automobile_series;
        let type = tr.insertCell(2);
        type.innerText = row.type;
        let address = tr.insertCell(3);
        address.innerText = row.address;
        let release_date = tr.insertCell(4);
        release_date.innerText = row.release_date;
        if (phone) {
            let phone_value = tr.insertCell(5);
            phone_value.innerText = row.phone;
        }
        if (mark) {
            let index = phone ? 6 : 5;
            let mark_value = tr.insertCell(index);
            mark_value.innerText = row.mark;
        }
        let option = document.createElement("option");
        option.value = row.automobile_id;
        option.innerText = row.automobile_id;
        select.appendChild(option);
    }
}

function delete_automobile() {
    let automobile_id = parseInt(document.getElementById("automobileID").value, 10);
    if (db) {
        db.transaction(function (t) {
            t.executeSql("DELETE FROM automobile WHERE automobile_id = ?",
                [automobile_id], update_table);
        })
    }
}

function get_type() {
    if (db) {
        db.transaction(function (t) {
            t.executeSql("SELECT type, address FROM automobile WHERE type='Седан'",
                [], alert_address);
        })
    }
}

function alert_address(transaction, result) {
    let rows = result.rows;
    let message = "Список адрессов, которые производят седаны!\n";
    for (let i = 0; i < rows.length; i++) {
        let row = rows.item(i);
        message += row.address;
        message += " -> ";
        message += row.type;
        message += "\n";
    }
    alert(message);
}

function add_fields() {
    let div = document.getElementById("mainInfo");
    div.insertAdjacentHTML("beforeend", "<select id=\"addInfoKey\" name=\"addInfoKey\"><option value=\"phone\">Телефон</option><option value=\"mark\">Марка</option></select>");
    div.insertAdjacentHTML("beforeend", "<input type=\"text\" placeholder=\"Значение\" id=\"addInfoValue\" name=\"addInfoValue\" autocomplete=\"off\" required>");
    div.insertAdjacentHTML("beforeend", "<button class=\"red\" type=\"button\" id=\"removeAddInfo\" onclick=\"remove_fields()\">Удалить поле</button>");
    let button = document.getElementById("addInfo");
    div.removeChild(button);
}

function remove_fields() {
    let div = document.getElementById("mainInfo");
    div.insertAdjacentHTML("beforeend", "<button class=\"blue\" type=\"button\" id=\"addInfo\" onclick=\"add_fields()\">Доп. информация</button>");
    let key = document.getElementById("addInfoKey");
    let value = document.getElementById("addInfoValue");
    let removeButton = document.getElementById("removeAddInfo");
    div.removeChild(key);
    div.removeChild(value);
    div.removeChild(removeButton);
}