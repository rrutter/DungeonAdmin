import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { CreateEquipmentComponent } from './create-equipment/create-equipment.component';  // Add your other components here as you create them

const routes: Routes = [
  { path: '', redirectTo: '/menu', pathMatch: 'full' },  // Default route to main menu
  { path: 'menu', component: MainMenuComponent },
  { path: 'create-equipment', component: CreateEquipmentComponent },
  // Add more routes here for consumables, dungeon levels, etc.
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
