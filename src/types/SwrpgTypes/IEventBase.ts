export interface IEventBase {
	id: string;
	author?: string;
	/**Is this event avaialable via random events? */
	circulationOptions?: {
		allowCirculation: boolean;
		/**By default, the event will be available in all Locations */
		locationOptions?: ILocationOptions;
		frequency?: Frequency;
		frequencyOverride?: {
			location: string;
			frequency: Frequency;
		}[];
	};
	timeout?: number;
	postOnNoReact?: boolean;
	embedOptions?: IEmbedOptions;
	eventLinks?: IEventLink[];
	requirements?: IEventRequirement;
	results?: {
		pickRandom?: boolean;
		changes: IEventResult[];
	};
}

export type Frequency = "Disabled" | "Common" | "Regular" | "Uncommon" | "Rare" | "Legendary";

export interface ILocationOptions {
	/**When set to Whitelist, Locations will *only* be selected from values. When set to Blacklist, any location in values will be ignored. */
	type: "Whitelist" | "Blacklist";
	/**List of Location names or IDs to use */
	values: string[];
}

export interface IEventLink {
	title: string;
	emoji?: string;
	description?: string;
	eventId: IEventBase[];
}

export interface IEmbedOptions {
	author?: {
		avatar?: string;
		name?: string;
	};
	/**The Title of the Discord Embed */
	title?: string;
	/**The Description shown in the Embed */
	description?: string;
	image?: string;
	thumbnail?: string;
	/**The colour that appears dow nthe side of the embed */
	color?: string;
}

export type RequirementMatch = "One of" | "All of" | "None of";

export interface IRequirementDetail {
	/**How the requirements are matched.. Either `One of`, `All of`, or `None of` */
	match: RequirementMatch;
	/** The values to use for this requirement. Array of any of the types `string`, `IItemQuantity`, and `ISkillLevel`.
	 * Location and Race requirements proved as `string[]`, `IItemQuantity[]` for item requirements,
	 * and `ISkillLevel[]` for skill requirements */
	values: string[] | IItemQuantity[] | ISkillLevel[] | IAffinity;
}

export interface IRequirement {
	/**How the requirements are matched.. Either `One of`, `All of`, or `None of` */
	match: RequirementMatch;
	/**Require certain race conditions for this event. */
	race?: IRequirementDetail;
	/**Require certain Item conditions for this event. Treated separately from Items removed via event results*/
	itemInInventory?: IRequirementDetail;
	/**Require certain Location conditions for this event. Treated separately from Event location whitelist/blacklist*/
	location?: IRequirementDetail;
	/**Require certain Skill conditions for this event. Can also be provided as Credits or Renown */
	skill?: IRequirementDetail;
	/**Require certain Faction Affinity for this event. */
	affinity?: IRequirementDetail;
	/**Require the character to be wearing or holding certain armor or weapons */
	itemEquipped?: IRequirementDetail;
}

export interface IEventRequirement extends IRequirement {
	/**Require the character to win combat against an NPC. */
	combat?: IEventCombat;

	/**The event that is presented when the conditions faile. */
	failEvent: string[];
	onFail: string;
}

export interface IEventCombat {
	npcId: string;
	playerEndAtHp?: number;
	npcEndAtHp?: number;
	forceWeapon?: string;
	fleeEvent?: [];
}

export interface IEventResult {
	modifier: "add" | "subtract" | "set";
	type: "item" | "credits" | "affinity" | "skill" | "experience" | "hitpoints" | "location" | "primaryWeapon" | "secondaryWeapon" | "ship" | "equipment" | "flag";
	key: string;
	value: string | number | null;
}

export interface IItemQuantity {
	itemId: string;
	count: number;
}

export interface ISkillLevel {
	skill: string;
	level: number;
}

export interface IAffinity {
	faction: string;
	points: number;
}
