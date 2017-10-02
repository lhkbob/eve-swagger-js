/**
 * Cache is a simple in-memory cache implementation based off wrapping the
 * standard Map type. It supports expiring cache entries based off of fixed
 * points in the future (set via a TTL per entry, or with a default).
 *
 * Each Cache maintains an internal timer that only runs when the cache contains
 * expiring entries. Thus, it will eventually be automatically cleaned up when
 * the Cache is otherwise eligible for GC: no new entries will be added, the
 * cached values expire, it becomes empty, and then no new timer is enqueued.
 * However, the timers are marked as unref'ed so that the process can be
 * terminated early even if entries may expire far into the future.
 *
 * However, if entries have very long expirations they could prevent the
 * automatic GC of the cache for quite some time. If possible it is recommended
 * to {@link #clear()} the cache when it is no longer going to be used.
 *
 * Note that this cache implementation does not impose any limits on the size
 * of the cache, size of keys, or size of values.
 */
export default class Cache<V> {
    private defaultTTL;
    private cache;
    private cacheCheckTimestamp;
    private cacheTimer;
    /**
     * Create a new Cache with given default TTL. The TTL represents the
     * "time-to-live" for new entries; a new entry's expiration date is the
     * current time plus the TTL. If {@link #set()} is called without an explicit
     * TTL, it will use the value provided to this constructor.
     *
     * @param defaultTTL The TTL to use if no per-key TTL was provided, and
     *     defaults to infinity (disabling expiration unless overridden per key)
     */
    constructor(defaultTTL?: number);
    /**
     * Get the cached value associated with `key`, or returns `undefined` if it is
     * not in the cache. If the key was previously in the cache but it had expired
     * before calling `get(key)`, then `undefined` will still be returned.
     *
     * @param key The key to fetch
     * @returns The value associated with key if it is in the cache and hasn't
     *     yet expired
     */
    get(key: string): V | undefined;
    /**
     * Store the `value` associated with `key` into the cache. The stored value
     * will remain in the cache until it expires. This overwrites any previous
     * value associated with the key. There are two paths to expiration, depending
     * on the `ttl` and `accessPeriod` parameters (or their defaults provided to
     * the Cache constructor).
     *
     * If `ttl` is undefined, the TTL of the cached value will be determined by
     * the `defaultTTL` specified at construction time. If this final TTL value is
     * greater than 0, it represents the time in milliseconds that the value will
     * remain in the cache. This timestamp is fixed as `ttl + now()` when the
     * value is stored in the cache.
     *
     * To store an entry without any expiration, the TTL should be set to
     * `Number.POSITIVE_INFINITY`. If the TTL is less than or equal to 0, the
     * value is effectively already expired and it will be silently ignored
     * (and not stored in the cache). This policy makes it easy to configure
     * cache behavior with a single number:
     *
     *  - `ttl <= 0` -> Caching is automatically disabled for the entry.
     *  - `0 < ttl < infinity` -> Entry expires in some finite amount of time.
     *  - `ttl = infinity` -> Entry does not expire
     *
     * @param key The key associated with the cached value
     * @param value The value to store in the cache
     * @param ttl Optional, custom TTL for this entry
     */
    set(key: string, value: V, ttl?: number): void;
    /**
     * Explicitly remove the given key from the cache.
     *
     * @param key The key to remove
     */
    del(key: string): void;
    /**
     * Remove all values from the cache.
     */
    clear(): void;
    private static getExpirationTimestamp<V>(e);
    private static isEntryValid<V>(e, now);
    private startCacheTimerMaybe(now, expirationTimestamp);
    private stopCacheTimer();
    private cleanCache();
}
