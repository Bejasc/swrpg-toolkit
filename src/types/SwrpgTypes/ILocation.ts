export interface ILocationData {
	location: ILocation;
	market?: boolean; //TODO change this to actual market type when available
}

export interface ILocation {
	_id: string;
	name: string;
	image?: string;
	planetImage?: string;
	aliases?: string[];
	description?: string;
	landingSite?: string;
	coordinates: {
		x: number;
		y: number;
		hyperlaneProximity: number;
		sector?: string;
		region?: string;
	};
	channelOptions: {
		name: string;
		autoCreate: true;
		category: string;
	};
	initialPoints?: [
		{
			factionId: string;
			points: number;
			description: string;
		},
	];
}
