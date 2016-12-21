/**
 * A container for the [market](https://esi.tech.ccp.is/latest/#/Market)
 * ESI endpoints. You should not require this module directly, as it technically
 * returns a factory function that requires an internal API. Instead an instance
 * is automatically exposed when the 
 * {@link module:eve_swagger_interface} is loaded and configured.
 *
 * @see https://esi.tech.ccp.is/latest/#/Market
 * @param api The internal API instance configured by the root module
 * @module market
 */
 module.exports = function(api) {
    var newRequest = api.newRequest;
    var ESI = api.esi;

    var exports = {};

    /**
     * Get prices for all items from the ESI endpoint. This makes an HTTP GET
     * request to [`/markets/prices`](https://esi.tech.ccp.is/latest/#!/Market/get_markets_prices).
     * The request is returned as an asynchronous Promise that resolves to 
     * an array parsed from the response JSON model. An example value looks 
     * like:
     * ```
     * [
     *   {
     *     "adjusted_price": 306988.09,
     *     "average_price": 306292.67,
     *     "type_id": 32772
     *   }
     * ]
     * ```
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Market/get_markets_prices
     * @esi_link MarketApi.getMarketsPrices
     */
    exports.getPrices = function() {
        return newRequest(ESI.MarketApi, 'getMarketsPrices', []);
    };

    /**
     * Get historical market statistics for the given region and item from the
     * ESI endpoint. This makes an HTTP GET request to 
     * [`/markets/{regionId}/history/`](https://esi.tech.ccp.is/latest/#!/Market/get_markets_region_id_history).
     * The request is returned as an asynchronous Promise that resolves to 
     * an array parsed from the response JSON model. An example value looks 
     * like:
     * ```
     * [
     *   {
     *     "average": 5.25,
     *     "date": "2015-05-01",
     *     "highest": 5.27,
     *     "lowest": 5.11,
     *     "order_count": 2267,
     *     "volume": 16276782035
     *   }
     * ]
     * ```
     *
     * @param {Integer} regionId The region id to query
     * @param {Integer} typeId The type of item on the market the statistics
     *   refer to
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Market/get_markets_region_id_history
     * @esi_link MarketApi.getMarketsRegionIdHistory
     */
    exports.getHistory = function(regionId, typeId) {
        return newRequest(ESI.MarketApi, 'getMarketsRegionIdHistory', 
                          [regionId, typeId]);
    };

    /**
     * Get a page of market orders in the given region from the ESI 
     * endpoint. Orders include buy and sell, and are for any item type. 
     * This makes an HTTP GET request to 
     * [`/markets/{regionId}/orders/`](https://esi.tech.ccp.is/latest/#!/Market/get_markets_region_id_orders).
     * The request is returned as an asynchronous Promise that resolves to 
     * an array parsed from the response JSON model. An example value looks 
     * like:
     * ```
     * [
     *   {
     *     "duration": 90,
     *     "is_buy_order": false,
     *     "issued": "2016-09-03T05:12:25Z",
     *     "location_id": 60005599,
     *     "min_volume": 1,
     *     "order_id": 4623824223,
     *     "price": 9.9,
     *     "range": "region",
     *     "type_id": 34,
     *     "volume_remain": 1296000,
     *     "volume_total": 2000000
     *   }
     * ]
     * ```
     * This orders request is paginated, with `page` starting at 1 for the first
     * page of data. If `page` is not provided, it defaults to 1. Per the 
     * ESI documentation, both buy and sell orders are reported with this 
     * request.
     *
     * @param {Integer} regionId The region id to query
     * @param {Integer} page The page of orders that is requested
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Market/get_markets_region_id_orders
     * @esi_link MarketApi.getMarketsRegionIdOrders
     */
    exports.getOrders = function(regionId, page) {
        page = page || 1;
        return newRequestOpt(ESI.MarketApi, 'getMarketsRegionIdOrders', 'all',
                             [regionId], {'page': page});
    };

    /**
     * Get all market orders in the given region for the given item type from 
     * the ESI endpoint. Orders include buy and sell, but are restricted to the
     * selected type id. This makes an HTTP GET request to 
     * [`/markets/{regionId}/orders/`](https://esi.tech.ccp.is/latest/#!/Market/get_markets_region_id_orders).
     * The request is returned as an asynchronous Promise that resolves to 
     * an array parsed from the response JSON model. An example value looks 
     * like:
     * ```
     * [
     *   {
     *     "duration": 90,
     *     "is_buy_order": false,
     *     "issued": "2016-09-03T05:12:25Z",
     *     "location_id": 60005599,
     *     "min_volume": 1,
     *     "order_id": 4623824223,
     *     "price": 9.9,
     *     "range": "region",
     *     "type_id": 34,
     *     "volume_remain": 1296000,
     *     "volume_total": 2000000
     *   }
     * ]
     * ```
     * This orders request is not paginated because it is restricted to a type.
     *
     * @param {Integer} regionId The region id to query
     * @param {Integer} typeId The type id to query from the market
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Market/get_markets_region_id_orders
     * @esi_link MarketApi.getMarketsRegionIdOrders
     */
    exports.getOrdersFor = function(regionId, typeId) {
        return newRequestOpt(ESI.MarketApi, 'getMarketsRegionIdOrders', 'all',
                             [regionId], {'typeId': typeId });
    }

    /**
     * Get all buy market orders in the given region for the particular item
     * type. This is equivalent to {@link module:market.getOrdersFor getOrdersFor} 
     * except that the returned orders are limited to the `'buy'` type.
     *
     * @param {Integer} regionId The region id to query
     * @param {Integer} typeId The type id to query from the market
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Market/get_markets_region_id_orders
     * @esi_link MarketApi.getMarketsRegionIdOrders
     */
    exports.getBuyOrdersFor = function(regionId, typeId) {
        return newRequestOpt(ESI.MarketApi, 'getMarketsRegionIdOrders', 'buy',
                             [regionId], {'typeId': typeId });
    };

    /**
     * Get all sell market orders in the given region for the particular item
     * type. This is equivalent to {@link module:market.getOrdersFor getOrdersFor} 
     * except that the returned orders are limited to the `'sell'` type.
     *
     * @param {Integer} regionId The region id to query
     * @param {Integer} typeId The type id to query from the market
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Market/get_markets_region_id_orders
     * @esi_link MarketApi.getMarketsRegionIdOrders
     */
    exports.getSellOrdersFor = function(regionId, typeId) {
        return newRequestOpt(ESI.MarketApi, 'getMarketsRegionIdOrders', 'sell',
                             [regionId], {'typeId': typeId });
    };

    return exports;
};
