import type { IEventBase } from "../SwrpgTypes/IEventBase";
import type IItem from "../SwrpgTypes/IItem";
import type { ILocationData } from "../SwrpgTypes/ILocation";
import type { IBasePackage } from "./BasePackage";

export interface IPackageDefinition extends IBasePackage {
	items?: IItem[];
	locations?: ILocationData[];
	events?: IEventBase[];
}
