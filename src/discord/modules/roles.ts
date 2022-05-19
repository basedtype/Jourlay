import {Logger} from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import * as ds from "discord.js";

export class DRoles {
	private logger = new Logger(DRoles.name);

	private roleIDs = {
		onlineRole: `975351738259361812`,
		offlineRole: `975355639121453056`,
	};

	private client: ds.Client;
	private guild: ds.Guild;

	public init(c: ds.Client, g: ds.Guild) {
		this.client = c;
		this.guild = g;

		this.logger.log(`✅ Roles module`);
	}

	private async setRole(u: string, r: string): Promise<Output> {
		const role = await this.guild.roles.fetch(r);
		const user = await this.guild.members.fetch(u);
		const result = await user.roles
			.add(role)
			.then(() => ({error: false, description: `Role successfuly setted`}))
			.catch(err => ({error: true, reason: err}));
		return result;
	}

	private async removeRole(u: string, r: string) {
		const role = await this.guild.roles.fetch(r);
		const user = await this.guild.members.fetch(u);
		const result = await user.roles
			.remove(role)
			.then(() => ({error: false, description: `Role successfuly removed`}))
			.catch(e => ({error: true, reason: e}));
		return result;
	}

	@Cron(`*/1 * * * * *`)
	private async onlineRole() {
		if (!this.client) return;

		const allMembers = (await this.guild.members.fetch()).toJSON();

		const stats = {
			online: 0,
			on: 0,
			offline: 0,
			off: 0,
		};

		for (const m of allMembers) {
			if (m.presence && m.presence.status !== `offline`) {
				stats.on++;
				if (m.roles.cache.toJSON().filter(i => i.id === this.roleIDs.onlineRole).length === 0) {
					stats.online++;
					await this.setRole(m.id, this.roleIDs.onlineRole);
				}
				if (m.roles.cache.toJSON().filter(i => i.id === this.roleIDs.offlineRole).length >= 1) {
					await this.removeRole(m.id, this.roleIDs.offlineRole);
				}
			} else {
				stats.off++;
				if (m.roles.cache.toJSON().filter(i => i.id === this.roleIDs.offlineRole).length === 0) {
					stats.offline++;
					await this.setRole(m.id, this.roleIDs.offlineRole);
				}
				if (m.roles.cache.toJSON().filter(i => i.id === this.roleIDs.onlineRole).length >= 1) {
					await this.removeRole(m.id, this.roleIDs.onlineRole);
				}
			}
		}
	}
}

export interface SetRoleOpt {
	client: ds.Client;
	guild: ds.Guild;
	userID: string;
	roleID: string;
	expire?: number;
}

export interface Output {
	error: boolean;
	description?: string;
	reason?: string;
}
