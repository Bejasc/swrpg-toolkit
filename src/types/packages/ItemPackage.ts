import { IItem, ISwrpgLocationData } from "../SwrpgTypes";
import type { IEventBase } from "../SwrpgTypes/IEventBase";
import type { IBasePackage } from "./BasePackage";

export interface IPackageDefinition extends IBasePackage {
	items?: IItem[];
	locations?: ISwrpgLocationData[];
	events?: IEventBase[];
}
