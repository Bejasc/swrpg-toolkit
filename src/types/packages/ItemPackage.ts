import type IItem from "../SwrpgTypes/IItem";
import type { ILocation } from "../SwrpgTypes/ILocation";
import type { IBasePackage } from "./BasePackage";

export interface IPackageDefinition extends IBasePackage {
	items?: IItem[];
	locations?: ILocation[];
}
