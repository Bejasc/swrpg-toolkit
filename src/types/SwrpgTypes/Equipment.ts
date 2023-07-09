import { ISkillCappedItem } from "./Item";
import { DamageTypes } from "./Weapon";

export interface IDamageResistance {
	damageType: DamageTypes;
	value: number;
}

export type EquipmentSlot = "primaryWeapon" | "head" | "upperBody" | "lowerBody" | "back";

export type EquipmentSlotConfig = {
	key: EquipmentSlot;
	name: string;
	aliases?: string[];
	displayOrder: number;
};

export const EquipmentSlots: Record<EquipmentSlot, EquipmentSlotConfig> = {
	primaryWeapon: { key: "primaryWeapon", name: "Primary Weapon", displayOrder: 1, aliases: ["weapon"] },
	head: { key: "head", name: "Head", displayOrder: 2, aliases: ["helmet", "headgear", "mask", "face", "hat"] },
	upperBody: { key: "upperBody", name: "Upper Body", displayOrder: 3, aliases: ["gloves", "shirt", "torso", "upper", "chest", "top"] },
	lowerBody: { key: "lowerBody", name: "Lower Body", displayOrder: 4, aliases: ["pants", "boots", "trousers", "legs", "greaves", "lower", "bottoms"] },
	back: { key: "back", name: "Back", displayOrder: 5, aliases: ["backpack", "bag"] },
};
export interface IEquipmentProperties extends ISkillCappedItem {
	slot: EquipmentSlot[];
	armorBonus: number;
	resistances: IDamageResistance[];
}

export function DEFUALT_EQUIPMENT(): IEquipmentProperties {
	return {
		armorBonus: 0,
		slot: [EquipmentSlots.upperBody.key],
		resistances: [],
		attributeRequirement: [],
	};
}
