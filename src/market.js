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
     * Get historical market statistics for the given region from the ESI 
     * endpoint. This makes an HTTP GET request to 
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
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Market/get_markets_region_id_history
     * @esi_link MarketApi.getMarketsRegionIdHistory
     */
    exports.getHistory = function(regionId) {
        return newRequest(ESI.MarketApi, 'getMarketsRegionIdHistory', 
                          [regionId]);
    };

    /**
     * Get a list of market orders for the given region from the ESI 
     * endpoint. This makes an HTTP GET request to 
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
     *
     * @param {Integer} regionId The region id to query
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Market/get_markets_region_id_orders
     * @esi_link MarketApi.getMarketsRegionIdOrders
     */
    exports.getHistory = function(regionId) {
        return newRequest(ESI.MarketApi, 'getMarketsRegionIdOrders', 
                          [regionId]);
    };

    return exports;
};
