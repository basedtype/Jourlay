import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';

@Entity()
export class Service {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	service: string;

	@Column()
	target: string;

	@Column()
	api: string

	@Column()
	secret: string

    @Column()
	login: string

    @Column()
	password: string

    @Column()
	description: string
}