export type ItemRarity = "Abundant" | "Common" | "Uncommon" | "Rare" | "Legendary" | "Unique";

export interface IItemTradeProperties {
	baseValue: number;
	itemRarity: ItemRarity;
	locationBlacklist?: string[];
	locationWhitelist?: string[];
	marketOverrides?: IMarketOverride[];
}

export interface IMarketOverride {
	location: string;
	rarity?: ItemRarity;
	priceModifier?: number;
}

export default interface IItem {
	_id: string;
	name: string;
	aliases?: string[];
	image?: string;
	description?: string;
	category: string;
	encumbrance: number;
	tradeProperties?: IItemTradeProperties;
}
