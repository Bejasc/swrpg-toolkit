import { ISkillCappedItem } from "./Item";
import { DamageTypes } from "./Weapon";

export interface IDamageResistance {
	damageType: DamageTypes;
	value: number;
}

export enum EquipmentSlots {
	Primary = "primary",
	Head = "head",
	Torso = "torso",
	Legs = "legs",
	// Arms,
	Back = "back",
}

export interface IEquipmentProperties extends ISkillCappedItem {
	slot: EquipmentSlots;
	armorBonus: number;
	resistances: IDamageResistance[];
}

export function DEFUALT_EQUIPMENT(): IEquipmentProperties {
	return {
		armorBonus: 0,
		slot: EquipmentSlots.Torso,
		resistances: [],
		attributeRequirement: [],
	};
}
