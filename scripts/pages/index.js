/**
 * Cette fonction permet d'initialiser la page index.html
 */
async function init() {
     
     const resultDOM = document.querySelector(".search-result");

     initMotCles();//initialisation des mot clés
     initResultats(resultDOM); //Initialisation de l'interface contenant les recettes

     //On écoute le champ de recherche
     document.getElementsByName("recherche-recette")[0].addEventListener("input",function() {
          if(this.value.length == 0) { //Champ recherche vide, alors on initialise l'interface
               console.log("champ vide on initialise")
               initResultats(resultDOM);
          }
          else {
               rechercheAvecForeach(resultDOM, this.value); 
               //rechercheAvecFor(resultDOM, this.value); 
          }
     });
}

init();//initialisation de la page index.html

/**
 * Cette fonction permet d'initialiser l'interface contenant les recettes
 * @param {*} resultDOM 
 */
function initResultats(resultDOM) {
     resultDOM.innerHTML = "";
     //Je boucle sur la liste des recettes
     recipes.forEach(data => {
          let recette = new RecetteModel(data);
          resultDOM.insertAdjacentHTML("beforeend", recette.getCard());
     }); 
}

/**
 * Cette fonction permet d'initialiser les filtres par mots clés
 */
function initMotCles() {
     
     let ingredientsDOM = document.getElementById("ingredients");
     let appareilsDOM = document.getElementById("appareils");
     let ustensilesDOM = document.getElementById("ustensiles");

     recipes.forEach(data => {
          let option = "";
          data.ingredients.forEach(objIngredient =>{
               option = `<a class="dropdown-item" href="#">${objIngredient.ingredient}</a>`;
               ingredientsDOM.getElementsByClassName("dropdown-items")[0].insertAdjacentHTML("beforeend", option);
          });
          
          option = `<a class="dropdown-item" href="#">${data.appliance}</a>`;
          appareilsDOM.getElementsByClassName("dropdown-items")[0].insertAdjacentHTML("beforeend", option);

          option = `<a class="dropdown-item" href="#">${data.ustensils}</a>`;
          ustensilesDOM.getElementsByClassName("dropdown-items")[0].insertAdjacentHTML("beforeend", option);

     });

     ingredientsDOM.getElementsByClassName("dropdown-toggle")[0].addEventListener("click", function() {
          fermerTousMenus();
          ingredientsDOM.getElementsByClassName("dropdown-menu")[0].style.display = "block"; 
          ingredientsDOM.getElementsByClassName("dropdown-toggle")[0].style.width="39.5rem";
          ingredientsDOM.getElementsByClassName("fa-chevron-up")[0].addEventListener("click",function(){
               fermerTousMenus();
          });
      });
     
      appareilsDOM.getElementsByClassName("dropdown-toggle")[0].addEventListener("click", function() {
          fermerTousMenus();
          appareilsDOM.getElementsByClassName("dropdown-menu")[0].style.display = "block"; 
          appareilsDOM.getElementsByClassName("dropdown-toggle")[0].style.width="39.5rem";
          appareilsDOM.getElementsByClassName("fa-chevron-up")[0].addEventListener("click",function(){
               fermerTousMenus();
          });
      });

      ustensilesDOM.getElementsByClassName("dropdown-toggle")[0].addEventListener("click", function() {
          fermerTousMenus();
          ustensilesDOM.getElementsByClassName("dropdown-menu")[0].style.display = "block"; 
          ustensilesDOM.getElementsByClassName("dropdown-toggle")[0].style.width="39.5rem";
          ustensilesDOM.getElementsByClassName("fa-chevron-up")[0].addEventListener("click",function(){
               fermerTousMenus();
          });
      });
}

/**
 * Cette fonction utilitaire permet de fermer les menus 
 */
function fermerTousMenus() {
     Array.from(document.getElementsByClassName("dropdown-toggle")).forEach(function(element) {
          element.style.width="";
     });
     
     document.getElementById("ingredients").getElementsByClassName("dropdown-menu")[0].style.display = "none"; 
     document.getElementById("appareils").getElementsByClassName("dropdown-menu")[0].style.display = "none"; 
     document.getElementById("ustensiles").getElementsByClassName("dropdown-menu")[0].style.display = "none"; 
}

/**
 * Cette fonction permet de faire la recherche avec foreach
 * @param {*} resultDOM 
 * @param {*} criteria 
 */
/**
 * Cette fonction permet de faire la recherche avec la boucle for
 * @param {*} resultDOM 
 * @param {*} criteria 
 */
 function rechercheAvecFor(resultDOM, criteria) {
     if(criteria.length >=3) { //On commence la recherche à partir de 3 caractère saisis
 
          let filteredRecipes = new Array(); //Liste des Recettes filtrées
 
          let term = criteria.toLowerCase();
 
          for(let index = 0; index < recipes.length; index++) {
               let data = recipes[index];
               
               if(data.name.toLowerCase().includes(term)){//Recherche dans titre
                    filteredRecipes.push(data);
               }
               else if(data.ingredients) { //recherche dans ingrédients
                    
                    let ingredientIsFound = false;
                    
                    let index = 0;
                    while(!ingredientIsFound && index < data.ingredients.length) {
                         
                         let objIngredient = data.ingredients[index];
                         if(objIngredient.ingredient.toLowerCase().includes(term)){
                              filteredRecipes.push(data);
                              ingredientIsFound = true;
                         }
                         index++;
                    }
               }
               else if(data.description.toLowerCase().includes(term)) {//recherche dans description
                    filteredRecipes.push(data);
               }
          }
     
          resultDOM.innerHTML = "";//Réinit DOM
          if(filteredRecipes.length > 0) { //Si au moins un résultat trouvé
               for(let index = 0; index < filteredRecipes.length; index++) {
                    let recette = new RecetteModel(filteredRecipes[index]);
                    resultDOM.insertAdjacentHTML("beforeend", recette.getCard());
               }
          }
          else { //Pas de résultat
               resultDOM.innerHTML = "« Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.";
          }
     }
 }
