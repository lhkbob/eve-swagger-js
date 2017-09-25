import Timer = NodeJS.Timer;

interface CacheEntry<V> {
  value: V;
  /**
   * Timestamp in milliseconds after which the cache value is invalid and should
   * be ignored. If infinity, the entry will not expire in this manner.
   */
  expires: number;
}

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
  private cache: Map<string, CacheEntry<V>>;
  private cacheCheckTimestamp: number | undefined;
  private cacheTimer: Timer | undefined;

  /**
   * Create a new Cache with given default TTL. The TTL represents the
   * "time-to-live" for new entries; a new entry's expiration date is the
   * current time plus the TTL. If {@link #set()} is called without an explicit
   * TTL, it will use the value provided to this constructor.
   *
   * @param defaultTTL The TTL to use if no per-key TTL was provided, and
   *     defaults to infinity (disabling expiration unless overridden per key)
   */
  constructor(private defaultTTL: number = Number.POSITIVE_INFINITY) {
    this.cacheCheckTimestamp = undefined;
    this.cacheTimer = undefined;
    this.cache = new Map();
  }

  /**
   * Get the cached value associated with `key`, or returns `undefined` if it is
   * not in the cache. If the key was previously in the cache but it had expired
   * before calling `get(key)`, then `undefined` will still be returned.
   *
   * @param key The key to fetch
   * @returns The value associated with key if it is in the cache and hasn't
   *     yet expired
   */
  get(key: string): V | undefined {
    let entry = this.cache.get(key);
    if (entry) {
      if (Cache.isEntryValid(entry, Date.now())) {
        return entry.value;
      } else {
        // Expired, so clean it up
        this.cache.delete(key);
        return undefined;
      }
    } else {
      // Not in the cache at all
      return undefined;
    }
  }

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
  set(key: string, value: V, ttl?: number): void {
    if (ttl === undefined) {
      // Use default TTL (must explicitly check against undefined since a
      // 0 value has special behavior).
      ttl = this.defaultTTL;
    }

    if (ttl <= 0) {
      // Implicitly already expired, so clear the cache and move on
      this.cache.delete(key);
      return;
    }

    let now = Date.now();

    let entry = { value: value, expires: now + ttl };
    this.cache.set(key, entry);

    this.startCacheTimerMaybe(now, Cache.getExpirationTimestamp(entry));
  }

  /**
   * Explicitly remove the given key from the cache.
   *
   * @param key The key to remove
   */
  del(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Remove all values from the cache.
   */
  clear() :void {
    this.stopCacheTimer();
    this.cache = new Map();
  }

  private static getExpirationTimestamp<V>(e: CacheEntry<V>): number | undefined {
    return Number.isFinite(e.expires) ? e.expires : undefined;
  }

  private static isEntryValid<V>(e: CacheEntry<V>, now: number): boolean {
    return e.expires > now;
  }

  private startCacheTimerMaybe(now: number,
      expirationTimestamp: number | undefined): void {
    if (expirationTimestamp === undefined) {
      // The new entry doesn't expire, so leave the timing check as is
      // (or if called from cleanCache, do not start a new timer)
      return;
    }

    if (this.cacheCheckTimestamp !== undefined && this.cacheCheckTimestamp
        < expirationTimestamp) {
      // There is already a check timer running that is set to expire before
      // this entry would come up, so leave it at that
      return;
    }

    // Possibly clear the current timer since it will be pre-empted
    this.stopCacheTimer();

    // Start a new timer for this timestamp (expiration + small buffer to make
    // it more likely to have actually expired if the timer triggers a little
    // early due to scheduler behavior).
    this.cacheCheckTimestamp = expirationTimestamp + 100;
    this.cacheTimer = setTimeout(() => this.cleanCache(),
        this.cacheCheckTimestamp - now);

    // Unref the timer so the application can end if nothing else is blocking it
    // but since there is only one active cache timer at a time, this shouldn't
    // impose too much load on Node's internal event tracking (per warning on
    // unref's documentation).
    this.cacheTimer.unref();
  }

  private stopCacheTimer(): void {
    if (this.cacheTimer) {
      clearTimeout(this.cacheTimer);
    }
    this.cacheTimer = undefined;
    this.cacheCheckTimestamp = undefined;
  }

  private cleanCache(): void {
    // Clear the current timer state, since it may not be rebooted for a while
    // or ever (if no new keys are added, for example).
    this.stopCacheTimer();

    let now = Date.now();

    // Determine entries to remove in a separate loop, and determine shortest
    // expiration timestamp of remaining cache entries.
    let keysToDelete = [];
    let nextClean = undefined;
    for (let key of this.cache.keys()) {
      let entry = this.cache.get(key);
      if (entry) {
        if (Cache.isEntryValid(entry, now)) {
          // Don't delete the entry, but calculate when the next clean timer
          // should be run at.
          let expires = Cache.getExpirationTimestamp(entry);
          if (expires !== undefined && (nextClean === undefined || expires
              < nextClean)) {
            nextClean = expires;
          }
        } else {
          // Delete entry
          keysToDelete.push(key);
        }
      }
    }

    // Remove all expired entries
    for (let key of keysToDelete) {
      this.cache.delete(key);
    }

    // Schedule new cleaning (if there are no entries, or no expiring entries,
    // then nextClean will be undefined, in which case startCacheTimerMaybe
    // will not actually set a new timer).
    this.startCacheTimerMaybe(now, nextClean);
  }
}