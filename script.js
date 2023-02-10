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

            loadMenu(BaseURL, endpoint);

            const API = new FetchWrapper(BaseURL);

            document.querySelector("#set-menu-form").addEventListener("submit", event => {
                event.preventDefault();
                API.post(endpoint, {
                    element: {
                        name: document.querySelector("#element-name").value,
                        price: document.querySelector("#element-price").value,
                        value: document.querySelector("#element-value")?.value
                    }
                }).then(response => {
                    console.log(response);
                });
            });

            // remove
            document.querySelector("#get-button").addEventListener("click", event => {
                API.get(endpoint).then(data => {
                    Object.values(data ? data : false).forEach(item => {
                        console.log(item.element.name);
                    })
                })
            })
        }
    });
})

const loadMenu = (BaseURL, endpoint) => {
    loadMenuContent(BaseURL, endpoint);
    loadMenuEdit();
}

const loadMenuContent = (BaseURL, endpoint) => {
    const API = new FetchWrapper(BaseURL);
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

const loadMenuEdit = () => {
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
    // REMOVE
    const getButton = document.createElement("button");
    getButton.setAttribute("id", "get-button");
    getButton.textContent = "Получить";

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
    // REMOVE
    div.appendChild(getButton);
}

const loadPromotions = () => {

}

const loadReviews = () => {

}