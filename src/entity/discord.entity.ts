import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Discord } from 'types';

@Entity()
export class DiscordUser {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userID: string;

	@Column()
	warnings: number;

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

@Entity()
export class DiscordLog {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	service: string;

	@Column({ default: 100 })
	code: number;

	@Column()
	description: string;

	@Column({ default: false })
	isRequestAttention: Boolean

	@CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
	timestamp: Date;
}