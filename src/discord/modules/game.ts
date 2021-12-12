import { DatabaseService } from "src/database/database.service";


export class Game {
    private currency = 'Золото';

    constructor (
        private readonly databaseService = DatabaseService,
    ) {}

    async initPlayer() {
        
    }
}