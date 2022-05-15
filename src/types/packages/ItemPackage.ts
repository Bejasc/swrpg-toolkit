import type IItem from "../SwrpgTypes/IItem";
import type { IBasePackage } from "./BasePackage";

export interface IPackageDefinitionItem extends IBasePackage {
	items: IItem[];
}
