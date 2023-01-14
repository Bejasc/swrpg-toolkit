import { IItem, ILocation } from "@/types/SwrpgTypes";
import { IEventCondition, IEventOperator, IEventSubCondition, RequirementMatch } from "@/types/SwrpgTypes/IEventBase";

export class ConditionTranslator {
	private static items: IItem[] = [];
	private static locations: ILocation[] = [];

	public static explainCondition(condition: IEventCondition, items: IItem[], locations: ILocation[]): { main: string; subConditions: string[] } {
		this.items = items;
		this.locations = locations;

		const match = ConditionTranslator.getMatchString(condition.match);
		const main = `Will pass when ${match} of the following are *TRUE* for the Player`;

		const subConditions: string[] = condition.subConditions?.map((subcondition) => {
			return this.getSubconditionString(subcondition);
		});

		return { main, subConditions };
	}

	private static getSubconditionString(subcondition: IEventSubCondition): string {
		const op = ConditionTranslator.operatorString(subcondition.operator);

		switch (subcondition.type) {
			case "item":
				return `has ${op} ${subcondition.value}x ${ConditionTranslator.resolveItem(subcondition).name}`;
			case "location":
				return `${op} on location ${ConditionTranslator.resolveLocation(subcondition).name}`;
			case "credits":
				return `is holding ${op} ${subcondition.value}x credits`;
			case "species":
				return `${op} a ${subcondition.key}`;
			case "hitpoints":
				return `has ${op} ${subcondition.value} hitpoints`;
			case "skill":
			case "attribute":
				return ` has ${op} Level ${subcondition.value} ${subcondition.key}`;
		}
	}

	private static resolveItem(subcondition: IEventSubCondition): IItem {
		return this.items.find((e) => e._id == subcondition.key);
	}

	private static resolveLocation(subcondition: IEventSubCondition): ILocation {
		return this.locations.find((e) => e._id == subcondition.key);
	}

	private static operatorString(operator: IEventOperator): string {
		switch (operator) {
			case "!=":
				return "is not";
			case "==":
				return "is";
			case ">=":
				return "at least";
			case "<":
				return "less than";
		}
	}

	private static getMatchString(match: RequirementMatch): string {
		switch (match) {
			case "All of":
				return "*ALL*";
			case "Any of":
				return "*ANY**";
			case "None of":
				return "*NONE*";
		}
	}
}
