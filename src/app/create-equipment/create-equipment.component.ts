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
  allEquipment: any[] = []; // Holds all equipment data from the backend
  filteredEquipment: any[] = []; // Holds filtered equipment based on type
  filterType: string = ''; // For filtering equipment by type

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
      guilds: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadGuilds();
    this.loadEquipment();
  }

  // Load the list of guilds
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

  // Load the list of all equipment
  loadEquipment(): void {
    this.equipmentService.getAllEquipment().subscribe(
      (equipment) => {
        this.allEquipment = equipment;
        this.filteredEquipment = equipment; // Initialize with all equipment
      },
      (error) => {
        console.error('Error fetching equipment', error);
      }
    );
  }

  // Dynamically add form controls for each guild's required level
  addGuildControls(guilds: any[]): void {
    const guildArray = this.equipmentForm.get('guilds') as FormArray;
    guilds.forEach((guild) => {
      guildArray.push(
        this.fb.group({
          guildId: [guild.id],
          requiredLevel: [0, [Validators.min(0)]]
        })
      );
    });
  }

  // Filter the equipment list based on the selected type
  filterEquipment(): void {
    if (this.filterType) {
      this.filteredEquipment = this.allEquipment.filter(
        (equipment) => equipment.type === this.filterType
      );
    } else {
      this.filteredEquipment = this.allEquipment;
    }
  }

  selectEquipment(equipment: any): void {
    this.equipmentForm.patchValue({
      name: equipment.name,
      type: equipment.type,
      handedness: equipment.handedness,
      damageMin: equipment.damageMin,
      damageMax: equipment.damageMax,
      defense: equipment.defense,
      strengthRequirement: equipment.strengthRequirement,
      dexterityRequirement: equipment.dexterityRequirement,
      constitutionRequirement: equipment.constitutionRequirement,
      intelligenceRequirement: equipment.intelligenceRequirement,
      wisdomRequirement: equipment.wisdomRequirement,
      charismaRequirement: equipment.charismaRequirement,
      hitPoints: equipment.hitPoints,
      manaPoints: equipment.manaPoints,
      strengthBonus: equipment.strengthBonus,
      dexterityBonus: equipment.dexterityBonus,
      constitutionBonus: equipment.constitutionBonus,
      intelligenceBonus: equipment.intelligenceBonus,
      wisdomBonus: equipment.wisdomBonus,
      charismaBonus: equipment.charismaBonus,
      alignment: equipment.alignment,
      value: equipment.value,
      isCursed: equipment.isCursed,
      special: equipment.special,
      special2: equipment.special2,
      iconUrl: equipment.iconUrl,
    });

    // Clear the existing form array for guilds
    const guildArray = this.equipmentForm.get('guilds') as FormArray;
    guildArray.clear();

    // Populate guild requirements
    this.guilds.forEach((guild, index) => {
      guildArray.push(
        this.fb.group({
          guildId: [guild.id],
          requiredLevel: [equipment[`guild${index + 1}RequiredLevel`] || 0, [Validators.min(0)]]
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
          this.router.navigate(['/menu']);
        },
        (error) => {
          console.error('Error creating equipment', error);
        }
      );
    }
  }

  // Method to delete equipment
  deleteEquipment(equipmentId: number): void {
    if (confirm('Are you sure you want to delete this equipment?')) {
      this.equipmentService.deleteEquipment(equipmentId).subscribe(
        (response) => {
          console.log('Equipment deleted successfully');
          this.loadEquipment();  // Reload the equipment list after deletion
        },
        (error) => {
          console.error('Error deleting equipment', error);
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

    return { ...formData, ...guildLevelMapping };
  }

  get guildFormArray() {
    return this.equipmentForm.get('guilds') as FormArray;
  }
}
