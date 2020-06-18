import { Recipe } from './recipe.model';
import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';


@Injectable()
export class RecipeService {

  constructor(private slService: ShoppingListService) {}

  private recipes: Recipe[] = [
    new Recipe('Test',
    'Test Desc',
    'https://www.bbcgoodfood.com/sites/default/files/recipe-collections/collection-image/2013/05/chorizo-mozarella-gnocchi-bake-cropped.jpg',
    [
      new Ingredient('abc', 1),
      new Ingredient('xyz', 10)
    ]),
    new Recipe('Test2',
    'Test Desc2',
    'https://www.bbcgoodfood.com/sites/default/files/recipe-collections/collection-image/2013/05/chorizo-mozarella-gnocchi-bake-cropped.jpg',
    [
      new Ingredient('abc', 2),
      new Ingredient('xyz', 30)
    ])
  ];

  getRecipes() {
    //we only get a copy and not direct reference to the array
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

}
