import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	CreateDateColumn,
	JoinColumn,
	UpdateDateColumn,
	DeleteDateColumn,
} from 'typeorm';
import { Discord } from 'types';

@Entity()
export class NswfEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	url: string;

	@Column()
	approve: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@DeleteDateColumn()
	deletedAt?: Date;
}
