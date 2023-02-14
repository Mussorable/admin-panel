import FetchWrapper from "./fetch_wrapper.js";
import Menu from "./menu.js";

document.querySelectorAll(".navi-button").forEach(button => {
    button.addEventListener("click", event => {
        const div = document.createElement("div");
        div.classList.add("global-container");
        div.setAttribute("id", "main-screen");
        const h1 = document.createElement("h1");
        h1.textContent = button.textContent;

        document.querySelector("#main-screen")?.remove();
        document.querySelector("main").appendChild(div);
        document.querySelector("#main-screen").appendChild(h1);
        if (button.getAttribute("function").includes("menu")) {
            const BaseURL = `https://spokiy-cofee-ua-default-rtdb.europe-west1.firebasedatabase.app/`;
            const endpoint = `menu.json`;
            const API = new FetchWrapper(BaseURL);

            loadMenu(endpoint, API);
        }
    });
})

const loadMenu = (endpoint, API) => {
    loadMenuContent(endpoint, API);
    loadMenuEdit(endpoint, API);
}

const loadMenuContent = (endpoint, API) => {
    const div = document.createElement("div");
    div.classList.add("region-container");
    div.setAttribute("id", "get-menu");
    const table = document.createElement("table");

    
    document.querySelector("#main-screen").appendChild(div);
    div.appendChild(table);
    table.insertAdjacentHTML("afterbegin", `
        <tr>
            <th>Элемент</th>
            <th>Цена</th> 
            <th>Значение</th>
        </tr>
    `);
    API.get(endpoint).then(data => {
        Object.values(data ? data : false).forEach(item => {
            table.insertAdjacentHTML("beforeend", `
                <tr>
                    <td>${item.element.name}</td>
                    <td>${item.element.price}</td>
                    <td>${item.element.value}</td>
                </tr>
            `);
        });
    })
}

const loadMenuEdit = (endpoint, API) => {
    addItem();
    editItem(endpoint, API);
    
    document.querySelector("#set-menu-form").addEventListener("submit", event => {
        event.preventDefault();
        API.post(endpoint, {
            element: {
                name: document.querySelector("#element-name").value,
                price: document.querySelector("#element-price").value,
                value: document.querySelector("#element-value")?.value
            }
        }).then(response => {location.reload()});
    });

    document.querySelector("#delete-button").addEventListener("click", event => {
        event.preventDefault();
        loadAlert(`Удалить элемент: `, endpoint, API);
        document.querySelector(".alert-container").classList.add("visible");
    });

    document.querySelector("#edit-button").addEventListener("click", event => {
        event.preventDefault();
        loadEditForm(endpoint, API);
        const select = document.querySelector("#menu-select");
        document.querySelector("#element-edit-name").value = select.options[select.selectedIndex].getAttribute("name");
        document.querySelector("#element-edit-price").value = select.options[select.selectedIndex].getAttribute("price");
        document.querySelector("#element-edit-value").value = select.options[select.selectedIndex].getAttribute("item-value");
    });
}

const addItem = () => {
    const div = document.createElement("div");
    div.classList.add("region-container");
    div.setAttribute("id", "set-element-container");
    const h2 = document.createElement("h2");
    h2.textContent = "Добавить элемент";
    const label = document.createElement("label");
    const div2 = document.createElement("div");
    div2.classList.add("input-container");
    const form = document.createElement("form");
    form.setAttribute("id", "set-menu-form");
    label.setAttribute("for", "element-name");
    const inputField = document.createElement("input");
    const inputAttributes = {
        placeholder: "Название элемента",
        id: "element-name",
        minlength: 1,
        maxlength: 30,
        required: "required"
    }
    for (const attribute in inputAttributes) {
        inputField.setAttribute(attribute, inputAttributes[attribute]);
    }
    const priceField = document.createElement("input");
    priceField.style.width = "70px";
    const priceFieldAttributes = {
        placeholder: "Цена",
        id: "element-price",
        minlength: 1,
        required: "required"
    }
    for (const attribute in priceFieldAttributes) {
        priceField.setAttribute(attribute, priceFieldAttributes[attribute]);
    }
    const valueField = document.createElement("input");
    valueField.style.width = "70px";
    const valueFieldAttributes = {
        placeholder: "Вес",
        id: "element-value",
        minlength: 1
    }
    for (const attribute in valueFieldAttributes) {
        valueField.setAttribute(attribute, valueFieldAttributes[attribute]);
    }

    const saveButton = document.createElement("button");
    saveButton.setAttribute("id", "send-button");
    saveButton.setAttribute("type", "submit");
    saveButton.textContent = "Отправить";

    document.querySelector("#main-screen").appendChild(div);
    div.appendChild(h2);
    div.appendChild(div2)
        .appendChild(form)
        .appendChild(label)
        .appendChild(inputField);
    form.appendChild(priceField);
    form.appendChild(valueField);
    form.appendChild(saveButton);
}

const editItem = (endpoint, API) => {
    const div = document.createElement("div");
    div.classList.add("region-container");
    div.setAttribute("id", "edit-element-container");
    const h2 = document.createElement("h2");
    h2.textContent = "Редактировать элемент";
    const form = document.createElement("form");
    form.setAttribute("id", "edit-menu-form");
    const label = document.createElement("label");
    label.setAttribute("for", "menu-select");
    label.textContent = "Элемент:";
    const select = document.createElement("select");
    select.setAttribute("id", "menu-select");
    const firstOption = document.createElement("option");
    firstOption.setAttribute("value", "");
    firstOption.textContent = "Выберите элемент";
    firstOption.setAttribute("disabled", "disabled");
    
    API.get(endpoint).then(data => {
        const listOfTokens = [];
        if (data) {
            Object.entries(data).forEach(item => {
                listOfTokens.push(item);
            });
        }

        for (const item of listOfTokens) {
            const selectOption = document.createElement("option");

            selectOption.setAttribute("name", item[1].element.name);
            selectOption.setAttribute("price", item[1].element.price);
            selectOption.setAttribute("item-value", item[1].element.value === "" ? "empty" : item[1].element.value);
            selectOption.setAttribute("value", item[0]);
            selectOption.textContent = item[1].element.name;

            select.appendChild(selectOption);
        }
    });
    
    const editButton = document.createElement("button");
    editButton.classList.add("edit-buttons");
    editButton.setAttribute("id", "edit-button");
    editButton.textContent = "Редактировать";

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("edit-buttons");
    deleteButton.setAttribute("id", "delete-button");
    deleteButton.textContent = "Удалить";

    document.querySelector("#main-screen").appendChild(div).appendChild(h2);
    div.appendChild(form).appendChild(label).appendChild(select).appendChild(firstOption);
    form.appendChild(editButton);
    form.appendChild(deleteButton);

    document.querySelectorAll(".edit-buttons").forEach(button => {
        button.setAttribute("disabled", "disabled");
    })

    document.querySelector("#menu-select").addEventListener("change", event => {
        document.querySelectorAll(".edit-buttons").forEach(button => {
            button.removeAttribute("disabled");
        });
    });
}

const loadPromotions = () => {

}

const loadReviews = () => {

}

const loadAlert = (alertMessage, endpoint, API) => {
    document.querySelector("#delete-item-alert")?.remove();
    const div = document.createElement("div");
    div.classList.add("alert-container");
    div.setAttribute("id", "delete-item-alert");
    const h2 = document.createElement("h2");
    h2.textContent = alertMessage;
    const yesButton = document.createElement("button");
    yesButton.setAttribute("id", "accept-button");
    yesButton.textContent = "Да";
    const noButton = document.createElement("button");
    noButton.setAttribute("id", "cancel-button");
    noButton.textContent = "Нет";

    document.body.appendChild(div).appendChild(h2);
    div.appendChild(yesButton);
    div.appendChild(noButton);

    document.querySelector("#cancel-button").addEventListener("click", event => {
        document.querySelector(".alert-container").classList.remove("visible");
    });

    document.querySelector("#accept-button").addEventListener("click", event => {
        document.querySelector(".alert-container").classList.remove("visible");
        API.delete(`menu/${document.querySelector("#menu-select").value}.json`).then(response => location.reload());
    });
}

const loadEditForm = (endpoint, API) => {
    const div = document.createElement("div");
    div.classList.add("edit-wrapper");
    const h2 = document.createElement("h2");
    h2.textContent = "Редактирование";
    const label = document.createElement("label");
    const div2 = document.createElement("div");
    div2.classList.add("input-container");
    const form = document.createElement("form");
    form.setAttribute("id", "edit-element-form");
    label.setAttribute("for", "element-edit-name");
    const inputField = document.createElement("input");
    const inputAttributes = {
        placeholder: "Название элемента",
        id: "element-edit-name",
        minlength: 1,
        maxlength: 30,
        required: "required"
    }
    for (const attribute in inputAttributes) {
        inputField.setAttribute(attribute, inputAttributes[attribute]);
    }
    const priceField = document.createElement("input");
    priceField.style.width = "70px";
    const priceFieldAttributes = {
        placeholder: "Цена",
        id: "element-edit-price",
        minlength: 1,
        required: "required"
    }
    for (const attribute in priceFieldAttributes) {
        priceField.setAttribute(attribute, priceFieldAttributes[attribute]);
    }
    const valueField = document.createElement("input");
    valueField.style.width = "70px";
    const valueFieldAttributes = {
        placeholder: "Вес",
        id: "element-edit-value",
        minlength: 1
    }
    for (const attribute in valueFieldAttributes) {
        valueField.setAttribute(attribute, valueFieldAttributes[attribute]);
    }

    const saveButton = document.createElement("button");
    saveButton.setAttribute("id", "send-edit-button");
    saveButton.setAttribute("type", "submit");
    saveButton.textContent = "Отправить";

    document.querySelector("#edit-element-container").appendChild(div).appendChild(h2);
    div.appendChild(div2).appendChild(form).appendChild(label).appendChild(inputField);
    form.appendChild(priceField);
    form.appendChild(valueField);
    form.appendChild(saveButton);

    document.querySelector("#edit-element-form").addEventListener("submit", event => { 
        event.preventDefault();
        const name = document.querySelector("#element-edit-name");
        const price = document.querySelector("#element-edit-price");
        const value = document.querySelector("#element-edit-value");
        API.put(`menu/${document.querySelector("#menu-select").value}.json`, {element : {
            name: name.value != "" ? name.value : "",
            price: price.value != "" ? price.value : "",
            value: value.value != "" ? value.value : ""
        }});
    });
}