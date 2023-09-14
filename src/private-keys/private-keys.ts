import { Injectable, Inject, Logger } from '@nestjs/common';
import { SECRET_KEY, TIME } from 'src/constants/constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import * as crypto from 'crypto';
import { Cache } from 'cache-manager';

@Injectable()
export class PrivateKey {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    public async getPrivateKey(): Promise<string> {
        Logger.log(`PrivateKey->checkPrivateKey() entered`);
        try {
            let privateKey: string = await this.cacheManager.get(SECRET_KEY);
            if (!privateKey) {
                Logger.log(`PrivateKey->checkPrivateKey() create valid key`);
                privateKey = crypto.randomBytes(64).toString("hex");
                await this.cacheManager.set(SECRET_KEY, privateKey, TIME.DAY)
            }
            return privateKey;
        } catch (error) {
            console.log(error);
            Logger.warn(`PrivateKey->checkPrivateKey() cache failed, created new seed number`);
            return crypto.randomBytes(64).toString("hex");
        }
    }
}
