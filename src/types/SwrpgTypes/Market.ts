import { ItemRarity } from "./Item";

export interface IDrpgMarketBase {
	name: string;
	description?: string;

	itemWhitelist?: string[];
	itemBlacklist?: string[];

	priceModifier?: number;
	activityIndex?: number;

	itemOverrides?: IMarketItemOverride[];
	//locationId: string; //! You're gonna need this - but adding it at save level maybe?
}

export interface IBaseMarketOverride {
	rarity?: ItemRarity;
	priceModifier?: number;
}

export interface IMarketItemOverride extends IBaseMarketOverride {
	itemId: string;
}

export interface IItemMarketOverride extends IBaseMarketOverride {
	locationId: string;
}
