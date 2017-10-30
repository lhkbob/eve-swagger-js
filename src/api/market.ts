import { esi } from '../esi';

/**
 * Market is an interface that is implemented by specific market providing APIs.
 * Currently, regions and structures provide similar but slightly incompatible
 * ESI endpoints for accessing the markets within their scope. This interface
 * defines a common subset that can be implemented for both.
 *
 * Given a Market instance, the orders and types refer to the market of
 * providing region or structure.
 *
 * This is api that provides functions for accessing the
 * [market](https://esi.tech.ccp.is/latest/#/Market) ESI endpoints.
 */
export interface Market {
  /**
   * Get all orders active in the market. The orders can be for any item type
   * and can be either buy or sell. Because there are so many potential orders,
   * they are returned as an asynchronous iterator since the underlying resource
   * is likely paginated.
   *
   * @returns All orders in the market
   */
  orders() :AsyncIterableIterator<esi.market.Order>;

  /**
   * Get only orders for the specific type in the market. Since it
   * is restricted to a type, all buy orders can be returned at once.
   *
   * @param type The type the orders will be for
   * @returns Buy orders in the market for the type
   */
  buyOrdersFor(type: number) :Promise<esi.market.Order[]>;

  /**
   * Get only sell orders for the specific type in the market. Since it
   * is restricted to a type, all sell orders can be returned at once.
   *
   * @param type The type the orders will be for
   * @returns Sell orders in the market for the type
   */
  sellOrdersFor(type: number) :Promise<esi.market.Order[]>;

  /**
   * Get both buy and sell orders for the specific type in the market. Since it
   * is restricted to a type, all orders can be returned at once.
   *
   * @param type The type the orders will be for
   * @returns Buy and sell orders in the market for the type
   */
  ordersFor(type: number) : Promise<esi.market.Order[]>;

  /**
   * @returns The type ids that have orders in the market
   */
  types() : AsyncIterableIterator<number>;
}
