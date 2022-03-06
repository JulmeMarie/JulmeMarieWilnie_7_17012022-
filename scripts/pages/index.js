//Variable permertant de stocker les recettes filtrées
var filteredRecipes = [];

//Variables permetant de stocker les tags (mots clé) choisis par l'utilisateur
var ingredientTagsList = [];
var appareilTagsList = [];
var ustensileTagsList = [];

//Variables permettant de stocker la liste des menus déroulantes (sans doublons)
var noDuplicatedIngredientsList = [];
var noDuplicatedAppliancesList = [];
var noDuplicatedUstensilesList = [];

//Variable permettant de créer des objets model  (recetteModel)
var factory = new RecetteFactory();

/**
 * Cette fonction permet d'initialiser la page index.html
 */
async function init() {

     filteredRecipes = factory.getListe();
     displayRecipes(filteredRecipes); //Initialisation de l'interface contenant les recettes

     initDropdownLists(filteredRecipes);//initialisation des liste déroulantes
     
     //On écoute le champ de recherche
     document.getElementsByName("recherche-recette")[0].addEventListener("input",function() {
          initSearch(this.value); 
     });
}

init();//initialisation de la page index.html

/**
 * Cette fonction permet d'initialiser l'interface contenant les recettes 
 * @param {*} recipesList 
 */
function displayRecipes(recipesList) {
     const resultDOM = document.querySelector(".search-result");
     if(recipesList.length == 0) { //Pas de résultat
          resultDOM.innerHTML = "« Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.";
     }
     else {
          resultDOM.innerHTML = "";
          //Je boucle sur la liste des recettes
          recipesList.forEach(recette => {
               resultDOM.insertAdjacentHTML("beforeend", recette.getCard());
          }); 
     }
}

/**
 * Cette fonction permet d'initialiser les filtres par mots clés
 * @param {*} recipesList 
 */
function initDropdownLists(recipesList) {
     initDropdownListItems(recipesList);
     initDropdownListSearch();

     //Récupération DOM
     let ingredientsDOM = document.getElementById("ingredients");
     let appareilsDOM = document.getElementById("appareils");
     let ustensilesDOM = document.getElementById("ustensiles");

     initDropdownToggle(ingredientsDOM);
     initDropdownToggle(appareilsDOM);
     initDropdownToggle(ustensilesDOM);
}

/**
 * Cette fonction permet d'écouter les clics utilisateurs sur le toggle permettant 
 * d'afficher ou de fermer la liste déroulante
 * @param {*} dropdownListDOM 
 */
function initDropdownToggle(dropdownListDOM) {
     //Ecoute de clicks sur la liste déroulante
     dropdownListDOM.getElementsByClassName("custom-dropdown-toggle")[0].addEventListener("click", function() {
          closeDropdownLists();

          //Affichage de la liste sur laquelle l'utilisateur a cliquée
          dropdownListDOM.getElementsByClassName("dropdown-menu")[0].style.display = "block"; 

          //Je cache le bouton sur lequel l'utilisateur a cliqué
          dropdownListDOM.getElementsByClassName("custom-dropdown-toggle")[0].style.width="39rem";
          dropdownListDOM.getElementsByClassName("custom-dropdown-toggle")[0].style.visibility="hidden";

          //Ecoute du clic sur le chevron permetant de fermer la liste déroulante
          dropdownListDOM.getElementsByClassName("fa-chevron-up")[0].addEventListener("click",function(){
               dropdownListDOM.getElementsByClassName("custom-dropdown-toggle")[0].style.width="9rem";
               dropdownListDOM.getElementsByClassName("custom-dropdown-toggle")[0].style.visibility="visible";
               dropdownListDOM.getElementsByClassName("dropdown-menu")[0].style.display = "none";
          });
     });
}

/**
 * Cette fonction utilitaire permet de fermer toutes les liste déroulantes
 */
 function closeDropdownLists() {
     Array.from(document.getElementsByClassName("custom-dropdown-toggle")).forEach(function(element) {
          element.style.width="9rem";
          element.style.visibility="visible";
     });
     
     document.getElementById("ingredients").getElementsByClassName("dropdown-menu")[0].style.display = "none"; 
     document.getElementById("appareils").getElementsByClassName("dropdown-menu")[0].style.display = "none"; 
     document.getElementById("ustensiles").getElementsByClassName("dropdown-menu")[0].style.display = "none"; 
}

/**
 * Cette fonction permet de créer les items d'une liste déroulante
 * @param {*} elementsList // La liste des items à créer (ingrédients ou appareils ou ustensiles)
 * @param {*} elementDOM // L'élément Html contenant la liste à créer
 * @param {*} elementTagsList //La liste des tags correspondants à la liste
 * @param {*} tagClassName //La class CSS de la liste (important pour que les tags puissent avoir la couleur de la liste)
 */
function createItems(elementsList, elementDOM, elementTagsList, tagClassName) {

     elementsList.forEach(element => {
          let itemDOM = document.createElement('a');//Création de l'item (balise a)
          itemDOM.setAttribute("href","#");
          itemDOM.className = 'dropdown-item'; //ajout de class  bootstrap
          itemDOM.innerHTML = element;

          //ajout de l'élément nouvellement créé dans le DOM Html
          elementDOM.getElementsByClassName("dropdown-items")[0].append(itemDOM);

          //Ecoute du clic utilisateur sur l'item nouvellement créé
          itemDOM.addEventListener("click", function(event){
               event.preventDefault(); //Prévenir tout comportement par défaut

               //Création de tag (mot clé)
               let tagDOM = document.querySelector(".badges");
               let buttonDOM = document.createElement("button");
               buttonDOM.className = `btn ${tagClassName}`;
               buttonDOM.innerHTML = `${element} <span class="badge text-light"> <i class="delete-tag fa fa-times"></i></span>`;
               tagDOM.append(buttonDOM);// affichage du tag créé
               
               elementTagsList.push(element);//ajout de l'élément à la liste des tags affichés
              
               initAdvancedSearch();//on lance la recherche

               //this.remove();//On supprime l'item de la liste

               //on écoute le clic permettant d'enlever le tag
               buttonDOM.getElementsByClassName("delete-tag")[0].addEventListener("click",function() {
                    buttonDOM.remove();//Suppression du tag (interface)

                    //(re)ajout de l'item à la liste déroulante
                    elementDOM.getElementsByClassName("dropdown-items")[0].append(itemDOM);

                    //suppression du tag (dans la liste des tags affichés)
                    elementTagsList.splice(elementTagsList.indexOf(element),1);

                    initAdvancedSearch();//On lance la recherche
               });
          });
     });
}

/**
 * Cette méthode permet de créer les items des menus "liste déroulante"
 * @param {*} recipesList 
 */
function initDropdownListItems(recipesList) {
     
     //Réinitialisation des listes sans doublons
     noDuplicatedIngredientsList = [];
     noDuplicatedAppliancesList = [];
     noDuplicatedUstensilesList = [];
     
     //On boucle sur la liste des recettes
     recipesList.forEach(recette => {
          
          //On boucle sur la liste d'ingrédients de la recette en cours
          recette.getIngredients().forEach(objIngredient => {

               //Je cherche l'ingredient encours dedans grâce à la méthode includes()
               if(!arrayToLowerCase(noDuplicatedIngredientsList).includes(objIngredient.ingredient.toLowerCase())){
                    
                    if(!arrayToLowerCase(ingredientTagsList).includes(objIngredient.ingredient.toLowerCase())){
                    //Ingrédient pas trouvé, alors je l'ajoute à la liste
                    noDuplicatedIngredientsList.push(objIngredient.ingredient);
                    }
               }
          });

          if(!arrayToLowerCase(noDuplicatedAppliancesList).includes(recette.getAppliance().toLowerCase())) {
               if(!arrayToLowerCase(appareilTagsList).includes(recette.getAppliance().toLowerCase())){
                    noDuplicatedAppliancesList.push(recette.getAppliance());
               }
          }

          recette.getUstensils().forEach(ustensil => {
               if(!arrayToLowerCase(noDuplicatedUstensilesList).includes(ustensil.toLowerCase())) {
                    if(!arrayToLowerCase(ustensileTagsList).includes(ustensil.toLowerCase())) {
                         noDuplicatedUstensilesList.push(ustensil);
                    }
               }
          });
     });

     //Récupération DOM
     let ingredientsDOM = document.getElementById("ingredients");
     let appareilsDOM = document.getElementById("appareils");
     let ustensilesDOM = document.getElementById("ustensiles");

     //initialisation DOM
     ingredientsDOM.getElementsByClassName("dropdown-items")[0].innerHTML = "";
     appareilsDOM.getElementsByClassName("dropdown-items")[0].innerHTML = "";
     ustensilesDOM.getElementsByClassName("dropdown-items")[0].innerHTML = "";

     //Création des items des listes déroulante
     createItems(noDuplicatedIngredientsList, ingredientsDOM, ingredientTagsList, "btn-primary");
     createItems(noDuplicatedAppliancesList, appareilsDOM, appareilTagsList, "btn-lightgreen");
     createItems(noDuplicatedUstensilesList, ustensilesDOM, ustensileTagsList, "btn-orange");
}

/**
 * Cette fonction permet de chercher un mot clé dans les 3 listes déroulantes (ingredients, appareils, ustensiles)
 */
function initDropdownListSearch() {

     //Initialisation du champ de recherche dans la liste déroulante des ingrédients
     document.getElementsByName("recherche-ingredient")[0].addEventListener("input",function(event) {
         let filterdIngredientsList = noDuplicatedIngredientsList.filter(ingredient =>{
            return ingredient.toLowerCase().includes(event.target.value.toLowerCase());
         });
         let ingredientsDOM = document.getElementById("ingredients");
         ingredientsDOM.getElementsByClassName("dropdown-items")[0].innerHTML = "";
         createItems(filterdIngredientsList, ingredientsDOM, ingredientTagsList, "btn-primary");
     });

     //Initialisation du champ de recherche dans la liste de recherches des appareils
     document.getElementsByName("recherche-appareil")[0].addEventListener("input",function(event) {
          let filterAppareilsList = noDuplicatedAppliancesList.filter(appareil =>{
               return appareil.toLowerCase().includes(event.target.value.toLowerCase());
            });
          let appareilsDOM = document.getElementById("appareils");
          appareilsDOM.getElementsByClassName("dropdown-items")[0].innerHTML = "";
          createItems(filterAppareilsList, appareilsDOM, appareilTagsList, "btn-lightgreen");
     });

     //Initialisation du champ de recherche dans la liste de recherche des ustensiles
     document.getElementsByName("recherche-ustensile")[0].addEventListener("input",function(event) {
          let filterdUstensilesList = noDuplicatedUstensilesList.filter(ustensile =>{
               return ustensile.toLowerCase().includes(event.target.value.toLowerCase());
            });
          let ustensilesDOM = document.getElementById("ustensiles");
          ustensilesDOM.getElementsByClassName("dropdown-items")[0].innerHTML = "";
          createItems(filterdUstensilesList, ustensilesDOM, ustensileTagsList, "btn-orange");
    });
}

/**
 * Cette méthode permet de lancer la recherche avancée (recherche lancée avec des mots clés)
 */
function initAdvancedSearch() {

     if(ingredientTagsList.length == 0  && appareilTagsList.length == 0 && ustensileTagsList.length == 0) {
          displayRecipes(filteredRecipes);
          initDropdownLists(filteredRecipes);
     }
     else
     {  
          //On filtre sur la liste des recettes en cours
          let localFilterdRecipes = filteredRecipes.filter(recipe =>{

               //La variable matchValues permet de stocker la liste (ingredients/appareils/Ustensils) 
               //qui correspond à la recette encours.
               let matchValues = ingredientTagsList.filter(ingredientTag => {
                    return recipe.hasIngredient(ingredientTag)
               });
               //Si la recette contient tous les ingrédients dans la liste des tags
               if(matchValues.length == ingredientTagsList.length) {
                    matchValues = []; //On initialise

                    //On filtre le tableau des tags des appareils
                    matchValues = appareilTagsList.filter(appareilTag => {
                         return recipe.hasAppliance(appareilTag);
                    });

                    //Si la recette contient tous les appreils dans la liste des tags
                    if(matchValues.length == appareilTagsList.length) {
                         matchValues = []; //On initialise

                         //On filtre la liste des ustensils
                         matchValues = ustensileTagsList.filter(ustensileTag => {
                              return recipe.hasUstensile(ustensileTag);
                         });
                         return matchValues.length == ustensileTagsList.length;
                    }
               }
               return false;
          });

          displayRecipes(localFilterdRecipes);
          initDropdownLists(localFilterdRecipes);
     }
}

/**
 * Cette fonction permet de faire la recherche avec filter
 * @param {*} criteria 
 */
function initSearch(criteria) {
     filteredRecipes = factory.getListe();
     if(criteria.length >=3 ) { //On commence la recherche à partir de 3 caractère saisis
          
          let term = criteria.toLowerCase();//Convertir en minuscule
          filteredRecipes = filteredRecipes.filter(recette => {
               if(recette.getName().toLowerCase().includes(term)){//Recherche dans titre
                    return true;
               }
               else if(recette.getIngredients()) { //Recherche dans ingrédients
                    let filteredIngredients = recette.getIngredients().filter(objIngredient =>{
                         return objIngredient.ingredient.toLowerCase().includes(term);
                    });
                    if(filteredIngredients.length > 0) {
                         return true;
                    }
               }
               else{
                    return recette.getDescription().toLowerCase().includes(term); //Recherche dans descriptio 
               }
          });
          initAdvancedSearch();
     }
     else if(criteria.length == 0) {
          initAdvancedSearch();
     }
}

/**
  * Cette fonction permet de convertir un tableau de chaînes de caractère en minuscule
  * @param {*} inputArray 
  * @returns 
  */
 function arrayToLowerCase(inputArray) {
     let outputArray = [];
     inputArray.forEach(element => {
          outputArray.push(element.toLowerCase());
     });
     return outputArray;
}