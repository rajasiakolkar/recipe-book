import { Recipe } from './recipe.model';
import { EventEmitter, Output } from '@angular/core';

export class RecipeService {

  @Output()
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe('Test', 'Test Desc', 'https://www.bbcgoodfood.com/sites/default/files/recipe-collections/collection-image/2013/05/chorizo-mozarella-gnocchi-bake-cropped.jpg'),
    new Recipe('Test2', 'Test Desc2', 'https://www.bbcgoodfood.com/sites/default/files/recipe-collections/collection-image/2013/05/chorizo-mozarella-gnocchi-bake-cropped.jpg')
  ];

  getRecipes() {
    //we only get a copy and not direct reference to the array
    return this.recipes.slice();
  }

}
