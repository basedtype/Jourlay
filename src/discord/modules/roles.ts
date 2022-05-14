import {DiscordRolesTypes} from "types";

export class DiscordRoles {
	private minecraftRole: number = null;
	private warzoneRole: number = null;
	private watchRole: number = null;
	private animeRole: number = null;

	private async setRole(
		opt: DiscordRolesTypes.SetRoleOpt
	): Promise<DiscordRolesTypes.Output> {
		const guild = opt.guild;
		const role = await guild.roles.fetch(opt.roleID);
		const user = await opt.guild.members.fetch(opt.userID);
		const result = await user.roles
			.add(role)
			.then(() => ({error: false, description: `Role successfuly setted`}))
			.catch(err => ({error: true, reason: err}));
		return result;
	}
}
