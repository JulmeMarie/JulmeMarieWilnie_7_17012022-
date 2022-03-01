class RecetteFactory {
    #listeRecettes;
    
    constructor() {
        this.#listeRecettes = new Array();
        
        recipes.forEach(recipe => {
            this.#listeRecettes.push(new RecetteModel(recipe));
       });
    }

    getListe() {
        return this.#listeRecettes;
    }
}