import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

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

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@DeleteDateColumn()
	deletedAt?: Date;

}