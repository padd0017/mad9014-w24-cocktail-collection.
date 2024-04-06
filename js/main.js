let search = document.querySelector("#search")
let btn = document.querySelector(".submit");
let list = document.querySelector("#cocktail");
let para = document.querySelector("p")
let box = document.querySelectorAll(".box");
let dialogBox = document.querySelector(".dialogBox");
let key = "buzzywarthog-1810"
let save = document.querySelector(".btnSave");
let btnSaved = document.getElementById("saved");
let savedImages=document.getElementById("savedItems")

function ignite() {
    btn.addEventListener("click", fetchCocktial)
}

save.addEventListener("click", function () {
    
    
    localSaved.push(dialogBoxMatch);
   
    saveData()
    dialogBox.close(); 
})
// pushing data here
let savedDrinks = []
let localSaved = []
localSaved = []


getData();

function getData() {
    let local = localStorage.getItem(key);
    if(local) {
        localSaved = JSON.parse(local);
    }
    else {
        localSaved = [];
    }
}


function saveData() {
    localStorage.setItem(key, JSON.stringify(localSaved))
}



function fetchCocktial(ev) {
    ev.preventDefault();
    savedImages.style.display = "none";
    let cocktailSearch = search.value.trim();
    

    if(cocktailSearch) {

        
     fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktailSearch}`)
    .then((response)=>{
        if(!response.ok){
            throw new Error("Something went Wrong")
        }
        return response.json()
     })
    .then((data)=>{
        savedDrinks.push(...data.drinks)
        displayFetch(data.drinks);
     })
    .catch((err)=>{
        list.innerHTML = `<h2>No Drinks found for ${cocktailSearch}</h2>`
     })
    } else {
        list.innerHTML = `<h2>Please Type Something</h2>`
    }
}

function displayFetch(drinks) {
    list.innerHTML=""
    let df = new DocumentFragment;

    drinks.forEach((item)=>{
        let box = document.createElement("div");
        box.classList.add("box");
        box.setAttribute("data-id", item.idDrink); 

        let img = document.createElement("img");
        img.classList.add("images");
        img.src = item.strDrinkThumb;
        img.alt = "drink is nothing";

        let h2 = document.createElement("p");
        h2.innerText = item.strDrink;

        box.appendChild(img);
        box.appendChild(h2);
        df.appendChild(box);
    });
    list.appendChild(df);
    list.addEventListener("click", getDialogBox)
}

function getDialogBox(ev) {
    if(ev.target.closest(".box")) {
        let getID = ev.target.closest(".box").getAttribute("data-id");
      

        dialogBox.showModal();
        
        let match= savedDrinks.find((item)=>{
            return item.idDrink===getID
        })
        
        dialogBoxMatch = match;

        if (isDrinkSaved(dialogBoxMatch)) {
            save.style.display = "none";
        } else {
            save.style.display = "block";
        }

    
        // content
        
        dialogBox.querySelector(".dialog-image").src= match.strDrinkThumb
        dialogBox.querySelector(".dialog-info").innerText = match.strInstructions
        
        saveData()
        
        
        
    }
    let Cancel = document.querySelector(".btnCancel");
    Cancel.addEventListener('click', function() {
        dialogBox.close(); 
    })
}

btnSaved.addEventListener("click", displaySaved)


function displaySaved(){
    savedImages.innerHTML=" "
    savedImages.style.display = "flex";
    let df=new DocumentFragment();

    localSaved.forEach((items)=>{
        

        let divSaved=document.createElement("div");
        divSaved.classList.add("box")

        // let deletebtn = document.createElement("button")
        // deletebtn.textContent = "Delete"
        // deletebtn.classList.add("deletebtn")
        // deletebtn.setAttribute("data-index", items.index)

        let imgSaved=document.createElement("img");
        imgSaved.classList.add("images");
        imgSaved.src=items.strDrinkThumb;

        let headingSaved=document.createElement("p")
        headingSaved.innerText=items.strDrink;

        divSaved.append(imgSaved);
        // divSaved.append(deletebtn)
        divSaved.append(headingSaved)
        df.append(divSaved);
    })
    savedImages.append(df)
    list.innerHTML= " "
    
   
 savedImages.addEventListener("click", savedFunctionClick)
 }

 function savedFunctionClick(ev) {
    console.log("outside");
    if (ev.target.closest(".box")) {
      console.log("inside");
  
      let getID = ev.target.closest(".box").getAttribute("data-id");
  
      dialogBox.showModal();
  
      let match = localSaved.find((item) => {
        return item.idDrink === getID;
      });
      console.log(match);
  
      dialogBoxMatch = match;
  
      save.style.display = "none";
  
      dialogBox.querySelector(".dialog-image").src = match.strDrinkThumb;
      dialogBox.querySelector(".dialog-info").innerText = match.strInstructions;
    }
    let Cancel = document.querySelector(".btnCancel");
    Cancel.addEventListener("click", function () {
      dialogBox.close();
    });
  }


function isDrinkSaved(drink) {
    
    return localSaved.some((savedDrink) => savedDrink.idDrink === drink.idDrink);
}

window.addEventListener("DOMContentLoaded", ignite)