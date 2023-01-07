import { IDrpgLocationBase } from "drpg-economy";
import IBasePackage from "drpg-utils/dist/types/IBasePackage";
import { invariant } from "../../plugins/Utils";

export function getMatchingLocation(value: string, locations: ILocation[]): ILocation {
	value = invariant(value);

	const location = locations.find((e) => invariant(e._id) === value || invariant(e.name) === value || e.aliases.map((a) => invariant(a)).includes(value));

	return location;
}

export interface ISwrpgLocationData {
	location: ILocation;
	market: unknown; //TODO
}

export interface ILocation extends IDrpgLocationBase {
	_id: string;
	name: string;
	image?: string;
	planetImage?: string;
	aliases?: string[];
	description?: string;
	landingSite?: string;
	secret?: boolean;
	coordinates: {
		x: number;
		y: number;
		hyperlaneProximity: number;
		sector?: string;
		region?: string;
	};
	channelOptions?: {
		autoCreate: boolean;
		name: string;
		category: string;
	};
	initialPoints: {
		factionId: string;
		points: number;
		description: string;
	}[];
	packageMeta?: IBasePackage;
}
