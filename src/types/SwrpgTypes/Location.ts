import { IDrpgLocationBase } from "drpg-economy";
import IBasePackage from "drpg-utils/dist/types/IBasePackage";

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
