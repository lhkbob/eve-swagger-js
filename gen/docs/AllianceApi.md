# EveSwaggerInterface.AllianceApi

All URIs are relative to *https://esi.tech.ccp.is/latest*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getAlliances**](AllianceApi.md#getAlliances) | **GET** /alliances/ | List all alliances
[**getAlliancesAllianceId**](AllianceApi.md#getAlliancesAllianceId) | **GET** /alliances/{alliance_id}/ | Get alliance information
[**getAlliancesAllianceIdCorporations**](AllianceApi.md#getAlliancesAllianceIdCorporations) | **GET** /alliances/{alliance_id}/corporations/ | List alliance&#39;s corporations
[**getAlliancesAllianceIdIcons**](AllianceApi.md#getAlliancesAllianceIdIcons) | **GET** /alliances/{alliance_id}/icons/ | Get alliance icon
[**getAlliancesNames**](AllianceApi.md#getAlliancesNames) | **GET** /alliances/names/ | Get alliance names


<a name="getAlliances"></a>
# **getAlliances**
> [&#39;Integer&#39;] getAlliances(opts)

List all alliances

List all active player alliances  ---  Alternate route: &#x60;/v1/alliances/&#x60;  Alternate route: &#x60;/legacy/alliances/&#x60;  Alternate route: &#x60;/dev/alliances/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.AllianceApi();

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
apiInstance.getAlliances(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

**[&#39;Integer&#39;]**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getAlliancesAllianceId"></a>
# **getAlliancesAllianceId**
> GetAlliancesAllianceIdOk getAlliancesAllianceId(allianceId, opts)

Get alliance information

Public information about an alliance  ---  Alternate route: &#x60;/v2/alliances/{alliance_id}/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.AllianceApi();

var allianceId = 56; // Integer | An Eve alliance ID

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
apiInstance.getAlliancesAllianceId(allianceId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **allianceId** | **Integer**| An Eve alliance ID | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

[**GetAlliancesAllianceIdOk**](GetAlliancesAllianceIdOk.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getAlliancesAllianceIdCorporations"></a>
# **getAlliancesAllianceIdCorporations**
> [&#39;Integer&#39;] getAlliancesAllianceIdCorporations(allianceId, opts)

List alliance&#39;s corporations

List all current member corporations of an alliance  ---  Alternate route: &#x60;/v1/alliances/{alliance_id}/corporations/&#x60;  Alternate route: &#x60;/legacy/alliances/{alliance_id}/corporations/&#x60;  Alternate route: &#x60;/dev/alliances/{alliance_id}/corporations/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.AllianceApi();

var allianceId = 56; // Integer | An EVE alliance ID

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
apiInstance.getAlliancesAllianceIdCorporations(allianceId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **allianceId** | **Integer**| An EVE alliance ID | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

**[&#39;Integer&#39;]**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getAlliancesAllianceIdIcons"></a>
# **getAlliancesAllianceIdIcons**
> GetAlliancesAllianceIdIconsOk getAlliancesAllianceIdIcons(allianceId, opts)

Get alliance icon

Get the icon urls for a alliance  ---  Alternate route: &#x60;/v1/alliances/{alliance_id}/icons/&#x60;  Alternate route: &#x60;/legacy/alliances/{alliance_id}/icons/&#x60;  Alternate route: &#x60;/dev/alliances/{alliance_id}/icons/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.AllianceApi();

var allianceId = 56; // Integer | An EVE alliance ID

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
apiInstance.getAlliancesAllianceIdIcons(allianceId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **allianceId** | **Integer**| An EVE alliance ID | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

[**GetAlliancesAllianceIdIconsOk**](GetAlliancesAllianceIdIconsOk.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getAlliancesNames"></a>
# **getAlliancesNames**
> [GetAlliancesNames200Ok] getAlliancesNames(allianceIds, opts)

Get alliance names

Resolve a set of alliance IDs to alliance names  ---  Alternate route: &#x60;/v1/alliances/names/&#x60;  Alternate route: &#x60;/legacy/alliances/names/&#x60;  Alternate route: &#x60;/dev/alliances/names/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.AllianceApi();

var allianceIds = [56]; // [Integer] | A comma separated list of alliance IDs

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
apiInstance.getAlliancesNames(allianceIds, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **allianceIds** | [**[Integer]**](Integer.md)| A comma separated list of alliance IDs | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

[**[GetAlliancesNames200Ok]**](GetAlliancesNames200Ok.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

