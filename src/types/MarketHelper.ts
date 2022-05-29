import type { ILocation } from "./SwrpgTypes/ILocation";

export class MarketHelper {
	public isAvailableEverywhere: boolean;
	public isWhitelist: boolean;
	public locations: ILocation[];

	public constructor() {
		this.isAvailableEverywhere = true;
		this.isWhitelist = true;
		this.locations = [];
	}
}
