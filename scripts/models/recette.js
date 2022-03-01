class RecetteModel {

    constructor(recette) {
        this.id = recette.id;
        this.name = recette.name;
        this.servings = recette.servings;
        this.ingredients = recette.ingredients;
        this.time = recette.time;
        this.description = recette.description;
        this.appliance = recette.appliance;
        this.ustensils = recette.ustensils;
    }

    getId()
    {
        return this.id;
    }

    getName()
    {
        return this.name;
    }

    getDescription(){
        return this.description;
    }

    getAppliance() {
        return this.appliance;
    }

    getIngredients() {
        return this.ingredients;
    }

    getUstensils() {
        return this.ustensils;
    }

    getIngredientsHtmlList() 
    {
        let list = "";
        this.ingredients.forEach(element => {
            let item = `<b>${element.ingredient} :</b> `;
            if(element.quantity) 
            {
                item +=  `${element.quantity}`;
            }
            if(element.unit) 
            {
                item += ` ${element.unit}`;
            }
            list += `<li>${item}</li>`;  
        });
        return `<ul>${list}</ul>`;
    }

    getCard() {
        return `
        <div class="card">
        <div class="card-img-top"></div>
        <div class="card-body">
            <div class="card-text">
                <h5 class="name">${this.name}</h5>
                <div class="times"><i class="fa fa-clock-o"></i> ${this.time} min</div>
                <div class="ingredients">
                    ${this.getIngredientsHtmlList()}
                </div>
                <div class="description">${this.description}</div>
            </div>
        </div>
        </div>
        `;
    }

    hasUstensile(ustensil) {
        if(!this.ustensils) {
            return false;
        }
        let filteredUstebsiles = this.ustensils.filter(objUstensil => {
            return objUstensil.toLowerCase() == ustensil.toLowerCase();
        });
        return filteredUstebsiles.length > 0;
    }

    hasIngredient(ingredient) {
        if(!this.ingredients){
             return false;
        }
        let filteredIngredients = this.ingredients.filter(objIngredient => {
            return objIngredient.ingredient.toLowerCase() == ingredient.toLowerCase();
        });
        return filteredIngredients.length > 0;
    }

    hasAppliance(appareil) {
        if(!this.appliance) {
            return false;
        }
        return this.appliance.toLowerCase() == appareil.toLowerCase();
    }
}