import { IDrpgLocationBase } from "drpg-economy";
import IBasePackage from "drpg-utils/dist/types/IBasePackage";
import { Document } from "mongoose";

export interface ISwrpgLocationData {
	location: ILocation;
	market: unknown; //TODO
}

export interface ILocation extends IDrpgLocationBase, Document {
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
		id: string;
		name: string;
		category: string;
		accessOptions: {
			hideOnLocation: boolean;
			roles: [
				{
					autoCreate: boolean;
					name: string;
					color?: string;
					read: boolean;
					write: boolean;
					id: string;
				},
			];
		};
	};
	initialPoints: {
		factionId: string;
		points: number;
		description: string;
	}[];
	packageMeta?: IBasePackage;
}
