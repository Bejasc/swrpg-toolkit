import { ISkillCappedItem } from "./Item";

export enum DamageTypes {
	Energy = "Energy",
	Ion = "Ion",
	Fire = "Fire",
	Blast = "Blast",
	Pierce = "Pierce",
	Slash = "Slash",
	Blunt = "Blunt",
}

export enum WeaponTypes {
	Unarmed = "Unarmed", //Str
	Blaster = "Blaster", //dex
	Slugthrower = "Slugthrower", //dex
	Melee = "Melee", //str
	Lightsaber = "Lightsaber", //str/dex/con
	Thrown = "Thrown", //str
}

export interface IWeaponProperties extends ISkillCappedItem {
	weaponType: WeaponTypes;
	damageType: DamageTypes;
	minDamage: number;
	maxDamage: number;
	handling: number;
}

export enum WeaponHandling {
	Terrible = 0.5,
	Poor = 0.75,
	Average = 1,
	Good = 1.25,
	Great = 1.5,
}

export function DEFAULT_WEAPON(): IWeaponProperties {
	return {
		damageType: DamageTypes.Energy,
		weaponType: WeaponTypes.Blaster,
		handling: WeaponHandling.Average,
		minDamage: 5,
		maxDamage: 10,
		attributeRequirement: [],
	};
}
