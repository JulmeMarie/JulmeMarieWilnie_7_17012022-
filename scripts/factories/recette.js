class RecetteFactory {
    #listeRecettes;
    
    constructor() {
        this.#listeRecettes = new Array();

        for(let index = 0; index < recipes.length; index++) {
            this.#listeRecettes.push(new RecetteModel(recipes[index]));
        }
    }

    getListe() {
        return this.#listeRecettes;
    }
}