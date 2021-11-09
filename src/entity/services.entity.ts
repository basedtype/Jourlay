import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';

@Entity()
export class Service {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	service: string;

	@Column()
	target: string;

	@Column({ nullable: true })
	api: string

	@Column({ nullable: true })
	secret: string

    @Column({ nullable: true })
	login: string

    @Column({ nullable: true })
	password: string

    @Column({ nullable: true })
	description: string
}