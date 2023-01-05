import { IDrpgItemBase } from "drpg-economy";

export type ItemCategories =
	| "Unknown"
	| "Food"
	| "Armour"
	| "Weapons"
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
	// packageMeta?: IBasePackage;
}
