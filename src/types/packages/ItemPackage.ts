import { ILocationData } from "drpg-economy";
import type { IEventBase } from "../SwrpgTypes/IEventBase";
import { IItem } from "../SwrpgTypes/v2";
import type { IBasePackage } from "./BasePackage";

export interface IPackageDefinition extends IBasePackage {
	items?: IItem[];
	locations?: ILocationData[];
	events?: IEventBase[];
}
