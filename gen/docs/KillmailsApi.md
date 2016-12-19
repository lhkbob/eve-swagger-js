# EveSwaggerInterface.KillmailsApi

All URIs are relative to *https://esi.tech.ccp.is/latest*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getCharactersCharacterIdKillmailsRecent**](KillmailsApi.md#getCharactersCharacterIdKillmailsRecent) | **GET** /characters/{character_id}/killmails/recent/ | List kills and losses
[**getKillmailsKillmailIdKillmailHash**](KillmailsApi.md#getKillmailsKillmailIdKillmailHash) | **GET** /killmails/{killmail_id}/{killmail_hash}/ | Get a single killmail


<a name="getCharactersCharacterIdKillmailsRecent"></a>
# **getCharactersCharacterIdKillmailsRecent**
> [GetCharactersCharacterIdKillmailsRecent200Ok] getCharactersCharacterIdKillmailsRecent(characterId, opts)

List kills and losses

Return a list of character&#39;s recent kills and losses  ---  Alternate route: &#x60;/v1/characters/{character_id}/killmails/recent/&#x60;  Alternate route: &#x60;/legacy/characters/{character_id}/killmails/recent/&#x60;  Alternate route: &#x60;/dev/characters/{character_id}/killmails/recent/&#x60;   ---  This route is cached for up to 120 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');
var defaultClient = EveSwaggerInterface.ApiClient.default;

// Configure OAuth2 access token for authorization: evesso
var evesso = defaultClient.authentications['evesso'];
evesso.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new EveSwaggerInterface.KillmailsApi();

var characterId = 56; // Integer | An EVE character ID

var opts = { 
  'maxCount': 50, // Integer | How many killmails to return at maximum
  'maxKillId': 56, // Integer | Only return killmails with ID smaller than this. 
  'datasource': "tranquility" // String | The server name you would like data from
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getCharactersCharacterIdKillmailsRecent(characterId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **characterId** | **Integer**| An EVE character ID | 
 **maxCount** | **Integer**| How many killmails to return at maximum | [optional] [default to 50]
 **maxKillId** | **Integer**| Only return killmails with ID smaller than this.  | [optional] 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

[**[GetCharactersCharacterIdKillmailsRecent200Ok]**](GetCharactersCharacterIdKillmailsRecent200Ok.md)

### Authorization

[evesso](../README.md#evesso)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getKillmailsKillmailIdKillmailHash"></a>
# **getKillmailsKillmailIdKillmailHash**
> GetKillmailsKillmailIdKillmailHashOk getKillmailsKillmailIdKillmailHash(killmailId, killmailHash, opts)

Get a single killmail

Return a single killmail from its ID and hash  ---  Alternate route: &#x60;/v1/killmails/{killmail_id}/{killmail_hash}/&#x60;  Alternate route: &#x60;/legacy/killmails/{killmail_id}/{killmail_hash}/&#x60;  Alternate route: &#x60;/dev/killmails/{killmail_id}/{killmail_hash}/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.KillmailsApi();

var killmailId = 56; // Integer | The killmail ID to be queried

var killmailHash = "killmailHash_example"; // String | The killmail hash for verification

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
apiInstance.getKillmailsKillmailIdKillmailHash(killmailId, killmailHash, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **killmailId** | **Integer**| The killmail ID to be queried | 
 **killmailHash** | **String**| The killmail hash for verification | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

[**GetKillmailsKillmailIdKillmailHashOk**](GetKillmailsKillmailIdKillmailHashOk.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

