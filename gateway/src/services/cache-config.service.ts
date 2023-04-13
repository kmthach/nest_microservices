import { CacheModuleOptions, CacheOptionsFactory } from "@nestjs/cache-manager";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CacheConfigService implements CacheOptionsFactory{
    createCacheOptions(): CacheModuleOptions<Record<string, any>> | Promise<CacheModuleOptions<Record<string, any>>> {
        return {
            ttl: 5000
        }
    }
}