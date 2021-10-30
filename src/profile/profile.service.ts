import { Injectable } from '@nestjs/common';
import * as fs from "fs";

@Injectable()
export class ProfileService {
    loadPage() {
        return fs.readFileSync('./www/profile/index.html', 'utf8');
    }
}
