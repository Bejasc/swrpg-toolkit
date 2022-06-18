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
}
