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

     initDropdownLists();//initialisation des liste déroulantes
     
     //On écoute le champ de recherche
     document.getElementsByName("recherche-recette")[0].addEventListener("input",function() {
          initSearch(this.value); 
     });
}

init();//initialisation de la page index.html

/**
 * Cette fonction permet d'initialiser l'interface contenant les recettes
 */
function displayRecipes(recipesList) {
     const resultDOM = document.querySelector(".search-result");
     resultDOM.innerHTML = "";
     //Je boucle sur la liste des recettes
     for(let index = 0; index < recipesList.length; index++) {
          resultDOM.insertAdjacentHTML("beforeend", recipesList[index].getCard());
     } 
}


/**
 * Cette fonction permet d'initialiser les filtres par mots clés
 */
function initDropdownLists() {
     initDropdownListItems();
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
     dropdownListDOM.getElementsByClassName("dropdown-toggle")[0].addEventListener("click", function() {
          closeDropdownLists();

          //Affichage de la liste sur laquelle l'utilisateur a cliquée
          dropdownListDOM.getElementsByClassName("dropdown-menu")[0].style.display = "block"; 

          //Je cache le bouton sur lequel l'utilisateur a cliqué
          dropdownListDOM.getElementsByClassName("dropdown-toggle")[0].style.width="39rem";
          dropdownListDOM.getElementsByClassName("dropdown-toggle")[0].style.visibility="hidden";

          //Ecoute du clic sur le chevron permetant de fermer la liste déroulante
          dropdownListDOM.getElementsByClassName("fa-chevron-up")[0].addEventListener("click",function(){
               dropdownListDOM.getElementsByClassName("dropdown-toggle")[0].style.width="";
               dropdownListDOM.getElementsByClassName("dropdown-toggle")[0].style.visibility="visible";
               dropdownListDOM.getElementsByClassName("dropdown-menu")[0].style.display = "none";
          });
     });
}

/**
 * Cette fonction utilitaire permet de fermer toutes les liste déroulantes
 */
 function closeDropdownLists() {
     let togglesList = document.getElementsByClassName("dropdown-toggle");

     for(let index = 0; index < togglesList.length; index++) {
          togglesList[index].style.width="";
          togglesList[index].style.visibility="visible";
     }
     
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
     for(let index = 0; index < elementsList.length; index++ ) {
          
          let element = elementsList[index];

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

               this.remove();//On supprime l'item de la liste

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
     }
}

/**
 * Cette méthode permet de créer les items des menus "liste déroulante"
 */
function initDropdownListItems() {
     
     //Réinitialisation des listes sans doublons
     noDuplicatedIngredientsList = [];
     noDuplicatedAppliancesList = [];
     noDuplicatedUstensilesList = [];

     //On boucle sur la liste des recettes
     for(let index = 0; index < filteredRecipes.length; index++){
          let recette = filteredRecipes[index];

          let ingredientsList = recette.getIngredients();
          
          //On boucle sur la liste d'ingrédients de la recette en cours
          for(let index = 0; index < ingredientsList.length; index++){
               let objIngredient = ingredientsList[index];

               //Je transform mon array "noDuplicatedIngredientsList" en String
               //je mets la chaine en minuscule
               //Je cherche l'ingredient encours dedans grâce à la méthode includes()
               if(!noDuplicatedIngredientsList.join('_').toLowerCase().includes(objIngredient.ingredient.toLowerCase())){
          
                    //Ingrédient pas trouvé, alors je l'ajoute à la liste
                    noDuplicatedIngredientsList.push(objIngredient.ingredient);
               }
          }

          if(!noDuplicatedAppliancesList.join('_').toLowerCase().includes(recette.getAppliance().toLowerCase())) {
               noDuplicatedAppliancesList.push(recette.getAppliance());
          }

          let ustensilsList = recette.getUstensils();
          for( let index = 0; index < ustensilsList.length; index++) {
               let ustensil = ustensilsList[index];
               if(!noDuplicatedUstensilesList.join('_').toLowerCase().includes(ustensil.toLowerCase())) {
                    noDuplicatedUstensilesList.push(ustensil);
               }
          }
     }

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

     document.getElementsByName("recherche-ingredient")[0].addEventListener("input",function(event) {
          let filterdIngredientsList = [];
          let index = 0;
          while(index < noDuplicatedIngredientsList.length) {
               if(noDuplicatedIngredientsList[index].toLowerCase().includes(event.target.value.toLowerCase())){
                    filterdIngredientsList.push(noDuplicatedIngredientsList[index]); 
               }
               index++;
          }
         let ingredientsDOM = document.getElementById("ingredients");
         ingredientsDOM.getElementsByClassName("dropdown-items")[0].innerHTML = "";
         createItems(filterdIngredientsList, ingredientsDOM, ingredientTagsList, "btn-primary");
     });

     document.getElementsByName("recherche-appareil")[0].addEventListener("input",function(event) {
          let filterAppareilsList = [];
          let index = 0;
          while(index < noDuplicatedAppliancesList.length) {
               if(noDuplicatedAppliancesList[index].toLowerCase().includes(event.target.value.toLowerCase())) {
                    filterAppareilsList.push(noDuplicatedAppliancesList[index]);
               }
               index++;
          }
          let appareilsDOM = document.getElementById("appareils");
          appareilsDOM.getElementsByClassName("dropdown-items")[0].innerHTML = "";
          createItems(filterAppareilsList, appareilsDOM, appareilTagsList, "btn-lightgreen");
     });

     document.getElementsByName("recherche-ustensile")[0].addEventListener("input",function(event) {
          let filterdUstensilesList = [];
          let index = 0;
          while (index < noDuplicatedUstensilesList.length ) {
               if (noDuplicatedUstensilesList[index].toLowerCase().includes(event.target.value.toLowerCase())) {
                    filterdUstensilesList.push(noDuplicatedUstensilesList[index]);  
               }
               index++;
          }
          let ustensilesDOM = document.getElementById("ustensiles");
          ustensilesDOM.getElementsByClassName("dropdown-items")[0].innerHTML = "";
          createItems(filterdUstensilesList, ustensilesDOM, ustensileTagsList, "btn-orange");
    });
}

/**
 * Cette méthode permet de lancer la recherche avancée (recherche lancée avec des mots clés)
 */
function initAdvancedSearch() {

     //Si aucun tag sélectionné alors, on affiche la liste des recette et on initialise les items des liste déroulantes
     if(ingredientTagsList.length == 0  && appareilTagsList.length == 0 && ustensileTagsList.length == 0) {
          displayRecipes(filteredRecipes);
          initDropdownLists();
     }
     else
     {         
          let localFilterdRecipes = [];
          for(let index = 0; index < filteredRecipes.length; index++) {
               let recette = filteredRecipes[index];
               let indexIngredient = 0;

               while(indexIngredient < ingredientTagsList.length) {//filtre par ingrédient
                    if(recette.hasIngredient(ingredientTagsList[indexIngredient])) {
                         localFilterdRecipes.push(recette);
                    }
                    indexIngredient++;
               }

               let indexAppliance = 0;
               while (indexAppliance < appareilTagsList.length) {
                    if(recette.hasAppliance(appareilTagsList[indexAppliance])) {
                         localFilterdRecipes.push(recette);
                    }
                    indexAppliance++;
               }

               let indexUstensil = 0;
               while (indexUstensil < ustensileTagsList.length) {
                    if(recette.hasUstensile(ustensileTagsList[indexUstensil])) {
                         localFilterdRecipes.push(recette); 
                    }
                    indexUstensil++;
               }
          }

          //console.log(localFilterdRecipes);
          let noDuplicatedFilteredRecipes = []; //Recettes triées sans doublon
          let recipesName = [];
          for(let index = 0; index < localFilterdRecipes.length; index++) {
               if(!recipesName.includes(localFilterdRecipes[index].getName())) {
                    noDuplicatedFilteredRecipes.push(localFilterdRecipes[index]);
                    recipesName.push(localFilterdRecipes[index].getName());
               }
          }
     
          if(localFilterdRecipes.length == 0) {
               document.getElementsByName("recherche-recette")[0].dispatchEvent(new Event('input', {bubbles:true}));
          }
          else {
               displayRecipes(noDuplicatedFilteredRecipes);
          }
     }
}


/**
 * Cette fonction permet de faire la recherche avec la "boucle for"
 * @param {*} criteria 
 */
 function initSearch(criteria) {
     filteredRecipes = factory.getListe();
     
     if(criteria.length >=3) { //On commence la recherche à partir de 3 caractère saisis
 
          let localFilteredRecipes = []; //Liste des Recettes filtrées selon le critère choisi(à remplir)
          let term = criteria.toLowerCase();
 
          for(let index = 0; index < filteredRecipes.length; index++) {
               
               let recipe = filteredRecipes[index];
               
               if(recipe.getName().toLowerCase().includes(term)){//Recherche dans titre
                    localFilteredRecipes.push(recipe);
               }
               //Si pas trouvé dans titre, alors on cherche dans la liste d'ingrédients
               else if(recipe.getIngredients()) { 
                    
                    let ingredientsList = recipe.getIngredients(); //List d'ingrédient de la recette en cours
                    let index = 0;

                    //Tant que l'index est inférieur à la longueur du tableau d'ingrédients de la recette, on continue
                    while(index < ingredientsList.length) {
                         
                         let objIngredient = ingredientsList[index];

                         //Si cet ingrédient correspond au critère de recherche, alors on ajoute la recette
                         //à la liste localFilteredRecipes, puis on arrête la boucle
                         if(objIngredient.ingredient.toLowerCase().includes(term)){
                              localFilteredRecipes.push(recipe);
                              index = ingredientsList.length;//Permet de stopper la boucle
                         }
                         index++;
                    }
               }
               //Si pas trouvé dans titre, ni ingrédients, alors on recherche dans description
               else if(recipe.getDescription().toLowerCase().includes(term)) {
                    localFilteredRecipes.push(recipe);
               }
          }
          
          filteredRecipes = localFilteredRecipes;
          initDropdownLists();
          if(filteredRecipes.length > 0){ //Au moins un résultat trouvé
               displayRecipes(filteredRecipes);
          }
          else { //Pas de résultat
               document.querySelector(".search-result").innerHTML = "« Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.";
          }
     }
     else if(criteria.length == 0) {//Si champ de recherche est vide, alors on initialise
          initAdvancedSearch();
     }
 }