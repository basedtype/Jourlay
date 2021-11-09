import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';

@Entity()
export class Log {
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