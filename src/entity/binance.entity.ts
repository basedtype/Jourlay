import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';

@Entity()
export class BinanceLog {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	currency: string;

	@Column()
	bidPrice: number;

	@Column()
	askPrice: string;

	@CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
	timestamp: Date;
}