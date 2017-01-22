# EveSwaggerInterface.MarketApi

All URIs are relative to *https://esi.tech.ccp.is/latest*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getMarketsPrices**](MarketApi.md#getMarketsPrices) | **GET** /markets/prices/ | List market prices
[**getMarketsRegionIdHistory**](MarketApi.md#getMarketsRegionIdHistory) | **GET** /markets/{region_id}/history/ | List historical market statistics in a region
[**getMarketsRegionIdOrders**](MarketApi.md#getMarketsRegionIdOrders) | **GET** /markets/{region_id}/orders/ | List orders in a region
[**getMarketsStructuresStructureId**](MarketApi.md#getMarketsStructuresStructureId) | **GET** /markets/structures/{structure_id}/ | List orders in a structure


<a name="getMarketsPrices"></a>
# **getMarketsPrices**
> [GetMarketsPrices200Ok] getMarketsPrices(opts)

List market prices

Return a list of prices  ---  Alternate route: &#x60;/v1/markets/prices/&#x60;  Alternate route: &#x60;/legacy/markets/prices/&#x60;  Alternate route: &#x60;/dev/markets/prices/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.MarketApi();

var opts = { 
  'datasource': "tranquility" // String | The server name you would like data from
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getMarketsPrices(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

[**[GetMarketsPrices200Ok]**](GetMarketsPrices200Ok.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getMarketsRegionIdHistory"></a>
# **getMarketsRegionIdHistory**
> [GetMarketsRegionIdHistory200Ok] getMarketsRegionIdHistory(regionId, typeId, opts)

List historical market statistics in a region

Return a list of historical market statistics for the specified type in a region  ---  Alternate route: &#x60;/v1/markets/{region_id}/history/&#x60;  Alternate route: &#x60;/legacy/markets/{region_id}/history/&#x60;  Alternate route: &#x60;/dev/markets/{region_id}/history/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.MarketApi();

var regionId = 56; // Integer | Return statistics in this region

var typeId = 56; // Integer | Return statistics for this type

var opts = { 
  'datasource': "tranquility" // String | The server name you would like data from
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getMarketsRegionIdHistory(regionId, typeId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **regionId** | **Integer**| Return statistics in this region | 
 **typeId** | **Integer**| Return statistics for this type | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

[**[GetMarketsRegionIdHistory200Ok]**](GetMarketsRegionIdHistory200Ok.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getMarketsRegionIdOrders"></a>
# **getMarketsRegionIdOrders**
> [GetMarketsRegionIdOrders200Ok] getMarketsRegionIdOrders(regionId, orderType, opts)

List orders in a region

Return a list of orders in a region  ---  Alternate route: &#x60;/v1/markets/{region_id}/orders/&#x60;  Alternate route: &#x60;/legacy/markets/{region_id}/orders/&#x60;  Alternate route: &#x60;/dev/markets/{region_id}/orders/&#x60;   ---  This route is cached for up to 300 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.MarketApi();

var regionId = 56; // Integer | Return orders in this region

var orderType = "all"; // String | Filter buy/sell orders, return all orders by default. If you query without type_id, we always return both buy and sell orders. 

var opts = { 
  'typeId': 56, // Integer | Return orders only for this type
  'page': 1, // Integer | Which page to query, only used for querying without type_id. Starting at 1 
  'datasource': "tranquility" // String | The server name you would like data from
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getMarketsRegionIdOrders(regionId, orderType, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **regionId** | **Integer**| Return orders in this region | 
 **orderType** | **String**| Filter buy/sell orders, return all orders by default. If you query without type_id, we always return both buy and sell orders.  | [default to all]
 **typeId** | **Integer**| Return orders only for this type | [optional] 
 **page** | **Integer**| Which page to query, only used for querying without type_id. Starting at 1  | [optional] [default to 1]
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

[**[GetMarketsRegionIdOrders200Ok]**](GetMarketsRegionIdOrders200Ok.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getMarketsStructuresStructureId"></a>
# **getMarketsStructuresStructureId**
> [GetMarketsStructuresStructureId200Ok] getMarketsStructuresStructureId(structureId, opts)

List orders in a structure

Return all orders in a structure  ---  Alternate route: &#x60;/v1/markets/structures/{structure_id}/&#x60;  Alternate route: &#x60;/legacy/markets/structures/{structure_id}/&#x60;  Alternate route: &#x60;/dev/markets/structures/{structure_id}/&#x60;   ---  This route is cached for up to 300 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');
var defaultClient = EveSwaggerInterface.ApiClient.default;

// Configure OAuth2 access token for authorization: evesso
var evesso = defaultClient.authentications['evesso'];
evesso.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new EveSwaggerInterface.MarketApi();

var structureId = 789; // Integer | Return orders in this region

var opts = { 
  'page': 1, // Integer | Which page to query, only used for querying without type_id. Starting at 1 
  'datasource': "tranquility" // String | The server name you would like data from
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getMarketsStructuresStructureId(structureId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **structureId** | **Integer**| Return orders in this region | 
 **page** | **Integer**| Which page to query, only used for querying without type_id. Starting at 1  | [optional] [default to 1]
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

[**[GetMarketsStructuresStructureId200Ok]**](GetMarketsStructuresStructureId200Ok.md)

### Authorization

[evesso](../README.md#evesso)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

