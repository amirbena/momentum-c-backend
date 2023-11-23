import { Injectable, Inject, Logger } from '@nestjs/common';
import { SECRET_KEY, TIME } from 'src/constants/constants';
import * as crypto from 'crypto';
import { InjectRedis, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';


@Injectable()
export class PrivateKey {
    constructor(@InjectRedis() private readonly redis: Redis) { }

    public async getPrivateKey(): Promise<string> {
        Logger.log(`PrivateKey->checkPrivateKey() entered`);
        try {
            let privateKey: string = await this.redis.get(SECRET_KEY);
            if (!privateKey) {
                Logger.log(`PrivateKey->checkPrivateKey() create valid key`);
                privateKey = crypto.randomBytes(64).toString("hex");
                await this.redis.set(SECRET_KEY, privateKey);
                await this.redis.expire(SECRET_KEY,TIME.WEEK);
            }
            return privateKey;
        } catch (error) {
            Logger.warn(`PrivateKey->checkPrivateKey() cache failed, created new seed number`);
            return crypto.randomBytes(64).toString("hex");
        }
    }
}
