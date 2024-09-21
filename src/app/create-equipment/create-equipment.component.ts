import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { EquipmentService } from '../services/equipment.service';
import { GuildService } from '../services/guild.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-equipment',
  templateUrl: './create-equipment.component.html',
  styleUrls: ['./create-equipment.component.css']
})
export class CreateEquipmentComponent implements OnInit {
  equipmentForm: FormGroup;
  guilds: any[] = [];

  constructor(
    private fb: FormBuilder,
    private equipmentService: EquipmentService,
    private guildService: GuildService,
    private router: Router
  ) {
    this.equipmentForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      handedness: [1],
      damageMin: [0, [Validators.min(0)]],
      damageMax: [0, [Validators.min(0)]],
      defense: [0, [Validators.min(0)]],
      strengthRequirement: [0, [Validators.min(0)]],
      dexterityRequirement: [0, [Validators.min(0)]],
      constitutionRequirement: [0, [Validators.min(0)]],
      intelligenceRequirement: [0, [Validators.min(0)]],
      wisdomRequirement: [0, [Validators.min(0)]],
      charismaRequirement: [0, [Validators.min(0)]],
      hitPoints: [0, [Validators.min(0)]],
      manaPoints: [0, [Validators.min(0)]],
      strengthBonus: [0],
      dexterityBonus: [0],
      constitutionBonus: [0],
      intelligenceBonus: [0],
      wisdomBonus: [0],
      charismaBonus: [0],
      alignment: ['Neutral', Validators.required],
      value: [0, [Validators.min(0)]],
      isCursed: [false],
      special: [''],
      special2: [''],
      iconUrl: [''],
      guilds: this.fb.array([]) // Form array to hold the guild level requirements
    });
  }

  ngOnInit(): void {
    this.loadGuilds();
  }

  // Fetch all guilds and dynamically add form controls for guild requirements
  loadGuilds(): void {
    this.guildService.getAllGuilds().subscribe(
      (guilds) => {
        this.guilds = guilds;
        this.addGuildControls(guilds);
      },
      (error) => {
        console.error('Error fetching guilds', error);
      }
    );
  }

  // Dynamically add form controls for each guild's required level
  addGuildControls(guilds: any[]): void {
    const guildArray = this.equipmentForm.get('guilds') as FormArray;
    guilds.forEach((guild) => {
      guildArray.push(
        this.fb.group({
          guildId: [guild.id],  // The guild ID
          requiredLevel: [0, [Validators.min(0)]]  // The required level for the guild
        })
      );
    });
  }

  onSubmit(): void {
    if (this.equipmentForm.valid) {
      const formData = this.equipmentForm.value;
      const mappedData = this.mapGuildsToRequiredLevels(formData);
      this.equipmentService.createEquipment(mappedData).subscribe(
        (response) => {
          console.log('Equipment created successfully', response);
          this.router.navigate(['/menu']);  // Redirect back to the menu
        },
        (error) => {
          console.error('Error creating equipment', error);
        }
      );
    }
  }

  // Map the guild level requirements to the correct field names expected by the backend
  mapGuildsToRequiredLevels(formData: any): any {
    const guildLevelMapping: any = {};

    formData.guilds.forEach((guild: any, index: number) => {
      guildLevelMapping[`guild${index + 1}RequiredLevel`] = guild.requiredLevel || 0;
    });

    // Merge guild level mapping into the form data
    return { ...formData, ...guildLevelMapping };
  }

  get guildFormArray() {
    return this.equipmentForm.get('guilds') as FormArray;
  }
}
