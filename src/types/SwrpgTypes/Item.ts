import { IDrpgItemBase } from "drpg-economy";
import { IEquipmentProperties } from "./Equipment";
import { IWeaponProperties } from "./Weapon";

export type ItemCategories =
	| "Unknown"
	| "Food"
	| "Armour"
	| "Weapon"
	| "Medical"
	| "Tools"
	| "Clothing"
	| "Resources"
	| "Minerals"
	| "Luxuries"
	| "Technology"
	| "Salvage"
	| "Chemicals";
export type ItemRarity = "Abundant" | "Common" | "Uncommon" | "Rare" | "Legendary" | "Unique";

export interface ISkillCappedItem {
	attributeRequirement?: { attribute: string; level: number }[];
}

export interface IItemQuantity {
	itemId: string;
	item?: IItem;
	count: number;
}

export interface IItem extends IDrpgItemBase {
	_id: string;
	image?: string;
	description?: string;
	category: ItemCategories;
	encumbrance: number;
	weaponProperties?: IWeaponProperties;
	equipmentProperties?: IEquipmentProperties;
	// packageMeta?: IBasePackage;
}
