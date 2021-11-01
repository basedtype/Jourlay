import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email: string;

	@Column()
	password: string;

	@Column({ default: false })
	isEmailVerified: boolean;

	@Column({ nullable: true })
	emailVerificationCode: string;

	@Column({ nullable: true })
	emailVerificationCodeExpiresAt: Date

	@Column({ nullable: true })
	resetPasswordCode: string

	@Column({ nullable: true, type: 'timestamp' })
	resetPasswordCodeExpiresAt: Date

	@Column({ default: true })
	isUserVerified: boolean;

	@CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
	createdAt: Date;
}
