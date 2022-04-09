"use strict";
class Menu {
    constructor(name, description, price, imgUrl) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.imgUrl = imgUrl;
    }
    display(generalLayout) {
        const layout = document.createElement("div");
        layout.style.boxShadow = "10px 5px black";
        generalLayout.append(layout);
        const img = document.createElement("img");
        img.src = this.imgUrl;
        img.style.width = "100%";
        img.style.height = "40%";
        img.style.display = "block";
        layout.append(img);
        const texts = document.createElement("div");
        texts.style.width = "100%";
        texts.style.height = "60%";
        layout.append(texts);
        const title = document.createElement("h3");
        title.innerHTML = `Menu: ${this.name}`;
        title.style.textWeight = "bold";
        texts.append(title);
        const description = document.createElement("p");
        description.innerHTML = this.description;
        texts.append(description);
    }
}
const Fitnes = new Menu("Fitnes", "Lorem ipsum dolor si ammetLorem ipsum dolor" +
    " si ammetLorem ipsum dolor si ammetLorem ipsum dolor si ammetLorem ipsum " +
    "dolor si ammetLorem ipsum dolor si ammetLorem ipsum dolor si ammetLorem " +
    "ipsum dolor si ammetLorem ipsum dolor si ammet", 229, "1.jpg");
Fitnes.display(document.body);