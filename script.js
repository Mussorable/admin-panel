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

            loadMenu();

            const API = new FetchWrapper(BaseURL);

            document.querySelector("#send-button").addEventListener("click", event => {
                API.post(endpoint, {
                    element: {
                        name: document.querySelector("#element-name").value
                    }
                }).then(response => {
                    console.log(response);
                });
            });

            document.querySelector("#get-button").addEventListener("click", event => {
                API.get(endpoint).then(data => {
                    Object.values(data).forEach(item => {
                        console.log(item.element.name);
                    })
                })
            })
        }
    });
})

const loadMenu = () => {
    loadMenuContent();
    loadMenuEdit();
}

const loadMenuContent = () => {
    
}

const loadMenuEdit = () => {
    const div = document.createElement("div");
    div.classList.add("region-container");
    div.setAttribute("id", "set-element-container");
    const h2 = document.createElement("h2");
    h2.textContent = "Добавить элемент";
    const label = document.createElement("label");
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
    const saveButton = document.createElement("button");
    saveButton.setAttribute("id", "send-button");
    // REMOVE
    const getButton = document.createElement("button");
    getButton.setAttribute("id", "get-button");
    getButton.textContent = "Получить";

    saveButton.textContent = "Отправить";

    document.querySelector("#main-screen").appendChild(div);
    const setElemContainer = document.querySelector("#set-element-container");
    setElemContainer.appendChild(h2);
    setElemContainer.appendChild(label);
    setElemContainer.appendChild(inputField);
    setElemContainer.appendChild(saveButton);
    // REMOVE
    setElemContainer.appendChild(getButton);
}

const loadPromotions = () => {

}

const loadReviews = () => {

}