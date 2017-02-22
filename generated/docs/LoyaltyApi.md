# EveSwaggerInterface.LoyaltyApi

All URIs are relative to *https://esi.tech.ccp.is/latest*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getCharactersCharacterIdLoyaltyPoints**](LoyaltyApi.md#getCharactersCharacterIdLoyaltyPoints) | **GET** /characters/{character_id}/loyalty/points/ | Get loyalty points
[**getLoyaltyStoresCorporationIdOffers**](LoyaltyApi.md#getLoyaltyStoresCorporationIdOffers) | **GET** /loyalty/stores/{corporation_id}/offers/ | List loyalty store offers


<a name="getCharactersCharacterIdLoyaltyPoints"></a>
# **getCharactersCharacterIdLoyaltyPoints**
> [GetCharactersCharacterIdLoyaltyPoints200Ok] getCharactersCharacterIdLoyaltyPoints(characterId, opts)

Get loyalty points

Return a list of loyalty points for all corporations the character has worked for  ---  Alternate route: &#x60;/v1/characters/{character_id}/loyalty/points/&#x60;  Alternate route: &#x60;/legacy/characters/{character_id}/loyalty/points/&#x60;  Alternate route: &#x60;/dev/characters/{character_id}/loyalty/points/&#x60; 

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');
var defaultClient = EveSwaggerInterface.ApiClient.default;

// Configure OAuth2 access token for authorization: evesso
var evesso = defaultClient.authentications['evesso'];
evesso.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new EveSwaggerInterface.LoyaltyApi();

var characterId = 56; // Integer | ID for a character

var opts = { 
  'datasource': "tranquility", // String | The server name you would like data from
  'token': "token_example", // String | Access token to use, if preferred over a header
  'userAgent': "userAgent_example", // String | Client identifier, takes precedence over headers
  'xUserAgent': "xUserAgent_example" // String | Client identifier, takes precedence over User-Agent
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getCharactersCharacterIdLoyaltyPoints(characterId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **characterId** | **Integer**| ID for a character | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]
 **token** | **String**| Access token to use, if preferred over a header | [optional] 
 **userAgent** | **String**| Client identifier, takes precedence over headers | [optional] 
 **xUserAgent** | **String**| Client identifier, takes precedence over User-Agent | [optional] 

### Return type

[**[GetCharactersCharacterIdLoyaltyPoints200Ok]**](GetCharactersCharacterIdLoyaltyPoints200Ok.md)

### Authorization

[evesso](../README.md#evesso)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getLoyaltyStoresCorporationIdOffers"></a>
# **getLoyaltyStoresCorporationIdOffers**
> [GetLoyaltyStoresCorporationIdOffers200Ok] getLoyaltyStoresCorporationIdOffers(corporationId, opts)

List loyalty store offers

Return a list of offers from a specific corporation&#39;s loyalty store  ---  Alternate route: &#x60;/v1/loyalty/stores/{corporation_id}/offers/&#x60;  Alternate route: &#x60;/legacy/loyalty/stores/{corporation_id}/offers/&#x60;  Alternate route: &#x60;/dev/loyalty/stores/{corporation_id}/offers/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.LoyaltyApi();

var corporationId = 56; // Integer | ID of a corporation

var opts = { 
  'datasource': "tranquility", // String | The server name you would like data from
  'userAgent': "userAgent_example", // String | Client identifier, takes precedence over headers
  'xUserAgent': "xUserAgent_example" // String | Client identifier, takes precedence over User-Agent
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getLoyaltyStoresCorporationIdOffers(corporationId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **corporationId** | **Integer**| ID of a corporation | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]
 **userAgent** | **String**| Client identifier, takes precedence over headers | [optional] 
 **xUserAgent** | **String**| Client identifier, takes precedence over User-Agent | [optional] 

### Return type

[**[GetLoyaltyStoresCorporationIdOffers200Ok]**](GetLoyaltyStoresCorporationIdOffers200Ok.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

