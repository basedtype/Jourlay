import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class Service {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	service: string;

	@Column({ nullable: true })
	target: string;

	@Column({ nullable: true })
	api: string;

	@Column({ nullable: true })
	secret: string;

	@Column({ nullable: true })
	login: string;

	@Column({ nullable: true })
	password: string;

	@Column({ nullable: true })
	description: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@DeleteDateColumn()
	deletedAt?: Date;

}
