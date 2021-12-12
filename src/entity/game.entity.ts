import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class GameUser {
	@PrimaryGeneratedColumn()
	id: number;

    @Column({ default: 0})
    wallet: number;

    @Column({ default: 0})
    xp: number;

    @Column({ default: 100 })
    hp: number;

    @Column({ default: 100 })
    hp_max: number;

    @Column({ nullable: true })
    adventureExpire?: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@DeleteDateColumn()
	deletedAt?: Date;

}

@Entity()
export class Thing {
    @PrimaryGeneratedColumn()
	id: number;

    @Column()
    name: string;

    @Column()
    type: string;

    @Column({ default: 0})
    armor: number

    @Column({ default: 0})
    damage: number;

    @Column({ default: 0})
    heal: number;

    @CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@DeleteDateColumn()
	deletedAt?: Date;
}

@Entity()
export class World {
    @PrimaryGeneratedColumn()
	id: number;

    @CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@DeleteDateColumn()
	deletedAt?: Date;
}