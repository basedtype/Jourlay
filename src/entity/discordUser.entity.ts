import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Discord } from 'types';

@Entity()
export class DiscordUser {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userID: string;

	@Column()
	warnings: Discord.Warning[];

	@Column()
	bans: number;

	@Column({ default: false })
	isMuted: string;

	@Column({ nullable: true })
	mutedExpires: Date

	@Column({ default: 0 })
	messages: number;

	@Column({ default: 0})
	minutesInVoice: number;

	@Column({ nullable: true })
	color: string;
}