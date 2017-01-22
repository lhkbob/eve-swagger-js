# EveSwaggerInterface.FittingsApi

All URIs are relative to *https://esi.tech.ccp.is/latest*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteCharactersCharacterIdFittingsFittingId**](FittingsApi.md#deleteCharactersCharacterIdFittingsFittingId) | **DELETE** /characters/{character_id}/fittings/{fitting_id}/ | Delete fitting
[**getCharactersCharacterIdFittings**](FittingsApi.md#getCharactersCharacterIdFittings) | **GET** /characters/{character_id}/fittings/ | Get fittings
[**postCharactersCharacterIdFittings**](FittingsApi.md#postCharactersCharacterIdFittings) | **POST** /characters/{character_id}/fittings/ | Create fitting


<a name="deleteCharactersCharacterIdFittingsFittingId"></a>
# **deleteCharactersCharacterIdFittingsFittingId**
> deleteCharactersCharacterIdFittingsFittingId(characterId, fittingId, opts)

Delete fitting

Delete a fitting from a character  ---  Alternate route: &#x60;/v1/characters/{character_id}/fittings/{fitting_id}/&#x60;  Alternate route: &#x60;/legacy/characters/{character_id}/fittings/{fitting_id}/&#x60;  Alternate route: &#x60;/dev/characters/{character_id}/fittings/{fitting_id}/&#x60; 

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');
var defaultClient = EveSwaggerInterface.ApiClient.default;

// Configure OAuth2 access token for authorization: evesso
var evesso = defaultClient.authentications['evesso'];
evesso.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new EveSwaggerInterface.FittingsApi();

var characterId = 56; // Integer | ID for a character

var fittingId = 56; // Integer | ID for a fitting of this character

var opts = { 
  'datasource': "tranquility" // String | The server name you would like data from
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.deleteCharactersCharacterIdFittingsFittingId(characterId, fittingId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **characterId** | **Integer**| ID for a character | 
 **fittingId** | **Integer**| ID for a fitting of this character | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

null (empty response body)

### Authorization

[evesso](../README.md#evesso)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getCharactersCharacterIdFittings"></a>
# **getCharactersCharacterIdFittings**
> [GetCharactersCharacterIdFittings200Ok] getCharactersCharacterIdFittings(characterId, opts)

Get fittings

Return fittings of a character  ---  Alternate route: &#x60;/v1/characters/{character_id}/fittings/&#x60;  Alternate route: &#x60;/legacy/characters/{character_id}/fittings/&#x60;  Alternate route: &#x60;/dev/characters/{character_id}/fittings/&#x60;   ---  This route is cached for up to 300 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');
var defaultClient = EveSwaggerInterface.ApiClient.default;

// Configure OAuth2 access token for authorization: evesso
var evesso = defaultClient.authentications['evesso'];
evesso.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new EveSwaggerInterface.FittingsApi();

var characterId = 56; // Integer | ID for a character

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
apiInstance.getCharactersCharacterIdFittings(characterId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **characterId** | **Integer**| ID for a character | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

[**[GetCharactersCharacterIdFittings200Ok]**](GetCharactersCharacterIdFittings200Ok.md)

### Authorization

[evesso](../README.md#evesso)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="postCharactersCharacterIdFittings"></a>
# **postCharactersCharacterIdFittings**
> PostCharactersCharacterIdFittingsCreated postCharactersCharacterIdFittings(characterId, opts)

Create fitting

Save a new fitting for a character  ---  Alternate route: &#x60;/v1/characters/{character_id}/fittings/&#x60;  Alternate route: &#x60;/legacy/characters/{character_id}/fittings/&#x60;  Alternate route: &#x60;/dev/characters/{character_id}/fittings/&#x60; 

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');
var defaultClient = EveSwaggerInterface.ApiClient.default;

// Configure OAuth2 access token for authorization: evesso
var evesso = defaultClient.authentications['evesso'];
evesso.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new EveSwaggerInterface.FittingsApi();

var characterId = 56; // Integer | ID for a character

var opts = { 
  'fitting': new EveSwaggerInterface.PostCharactersCharacterIdFittingsFitting(), // PostCharactersCharacterIdFittingsFitting | Details about the new fitting
  'datasource': "tranquility" // String | The server name you would like data from
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.postCharactersCharacterIdFittings(characterId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **characterId** | **Integer**| ID for a character | 
 **fitting** | [**PostCharactersCharacterIdFittingsFitting**](PostCharactersCharacterIdFittingsFitting.md)| Details about the new fitting | [optional] 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

[**PostCharactersCharacterIdFittingsCreated**](PostCharactersCharacterIdFittingsCreated.md)

### Authorization

[evesso](../README.md#evesso)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

