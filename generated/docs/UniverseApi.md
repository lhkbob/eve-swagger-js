# EveSwaggerInterface.UniverseApi

All URIs are relative to *https://esi.tech.ccp.is/latest*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getUniverseBloodlines**](UniverseApi.md#getUniverseBloodlines) | **GET** /universe/bloodlines/ | Get bloodlines
[**getUniverseCategories**](UniverseApi.md#getUniverseCategories) | **GET** /universe/categories/ | Get item categories
[**getUniverseCategoriesCategoryId**](UniverseApi.md#getUniverseCategoriesCategoryId) | **GET** /universe/categories/{category_id}/ | Get item category information
[**getUniverseConstellations**](UniverseApi.md#getUniverseConstellations) | **GET** /universe/constellations/ | Get constellations
[**getUniverseConstellationsConstellationId**](UniverseApi.md#getUniverseConstellationsConstellationId) | **GET** /universe/constellations/{constellation_id}/ | Get constellation information
[**getUniverseFactions**](UniverseApi.md#getUniverseFactions) | **GET** /universe/factions/ | Get factions
[**getUniverseGroups**](UniverseApi.md#getUniverseGroups) | **GET** /universe/groups/ | Get item groups
[**getUniverseGroupsGroupId**](UniverseApi.md#getUniverseGroupsGroupId) | **GET** /universe/groups/{group_id}/ | Get item group information
[**getUniverseMoonsMoonId**](UniverseApi.md#getUniverseMoonsMoonId) | **GET** /universe/moons/{moon_id}/ | Get moon information
[**getUniversePlanetsPlanetId**](UniverseApi.md#getUniversePlanetsPlanetId) | **GET** /universe/planets/{planet_id}/ | Get planet information
[**getUniverseRaces**](UniverseApi.md#getUniverseRaces) | **GET** /universe/races/ | Get character races
[**getUniverseRegions**](UniverseApi.md#getUniverseRegions) | **GET** /universe/regions/ | Get regions
[**getUniverseRegionsRegionId**](UniverseApi.md#getUniverseRegionsRegionId) | **GET** /universe/regions/{region_id}/ | Get region information
[**getUniverseStargatesStargateId**](UniverseApi.md#getUniverseStargatesStargateId) | **GET** /universe/stargates/{stargate_id}/ | Get stargate information
[**getUniverseStationsStationId**](UniverseApi.md#getUniverseStationsStationId) | **GET** /universe/stations/{station_id}/ | Get station information
[**getUniverseStructures**](UniverseApi.md#getUniverseStructures) | **GET** /universe/structures/ | List all public structures
[**getUniverseStructuresStructureId**](UniverseApi.md#getUniverseStructuresStructureId) | **GET** /universe/structures/{structure_id}/ | Get structure information
[**getUniverseSystems**](UniverseApi.md#getUniverseSystems) | **GET** /universe/systems/ | Get solar systems
[**getUniverseSystemsSystemId**](UniverseApi.md#getUniverseSystemsSystemId) | **GET** /universe/systems/{system_id}/ | Get solar system information
[**getUniverseTypes**](UniverseApi.md#getUniverseTypes) | **GET** /universe/types/ | Get types
[**getUniverseTypesTypeId**](UniverseApi.md#getUniverseTypesTypeId) | **GET** /universe/types/{type_id}/ | Get type information
[**postUniverseNames**](UniverseApi.md#postUniverseNames) | **POST** /universe/names/ | Get names and categories for a set of ID&#39;s


<a name="getUniverseBloodlines"></a>
# **getUniverseBloodlines**
> [GetUniverseBloodlines200Ok] getUniverseBloodlines(opts)

Get bloodlines

Get a list of bloodlines  ---  Alternate route: &#x60;/v1/universe/bloodlines/&#x60;  Alternate route: &#x60;/legacy/universe/bloodlines/&#x60;  Alternate route: &#x60;/dev/universe/bloodlines/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.UniverseApi();

var opts = { 
  'datasource': "tranquility", // String | The server name you would like data from
  'language': "en-us", // String | Language to use in the response
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
apiInstance.getUniverseBloodlines(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]
 **language** | **String**| Language to use in the response | [optional] [default to en-us]
 **userAgent** | **String**| Client identifier, takes precedence over headers | [optional] 
 **xUserAgent** | **String**| Client identifier, takes precedence over User-Agent | [optional] 

### Return type

[**[GetUniverseBloodlines200Ok]**](GetUniverseBloodlines200Ok.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getUniverseCategories"></a>
# **getUniverseCategories**
> [&#39;Integer&#39;] getUniverseCategories(opts)

Get item categories

Get a list of item categories  ---  Alternate route: &#x60;/v1/universe/categories/&#x60;  Alternate route: &#x60;/legacy/universe/categories/&#x60;  Alternate route: &#x60;/dev/universe/categories/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.UniverseApi();

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
apiInstance.getUniverseCategories(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]
 **userAgent** | **String**| Client identifier, takes precedence over headers | [optional] 
 **xUserAgent** | **String**| Client identifier, takes precedence over User-Agent | [optional] 

### Return type

**[&#39;Integer&#39;]**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getUniverseCategoriesCategoryId"></a>
# **getUniverseCategoriesCategoryId**
> GetUniverseCategoriesCategoryIdOk getUniverseCategoriesCategoryId(categoryId, opts)

Get item category information

Get information of an item category  ---  Alternate route: &#x60;/v1/universe/categories/{category_id}/&#x60;  Alternate route: &#x60;/legacy/universe/categories/{category_id}/&#x60;  Alternate route: &#x60;/dev/universe/categories/{category_id}/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.UniverseApi();

var categoryId = 56; // Integer | An Eve item category ID

var opts = { 
  'datasource': "tranquility", // String | The server name you would like data from
  'language': "en-us", // String | Language to use in the response
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
apiInstance.getUniverseCategoriesCategoryId(categoryId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **categoryId** | **Integer**| An Eve item category ID | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]
 **language** | **String**| Language to use in the response | [optional] [default to en-us]
 **userAgent** | **String**| Client identifier, takes precedence over headers | [optional] 
 **xUserAgent** | **String**| Client identifier, takes precedence over User-Agent | [optional] 

### Return type

[**GetUniverseCategoriesCategoryIdOk**](GetUniverseCategoriesCategoryIdOk.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getUniverseConstellations"></a>
# **getUniverseConstellations**
> [&#39;Integer&#39;] getUniverseConstellations(opts)

Get constellations

Get a list of constellations  ---  Alternate route: &#x60;/v1/universe/constellations/&#x60;  Alternate route: &#x60;/legacy/universe/constellations/&#x60;  Alternate route: &#x60;/dev/universe/constellations/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.UniverseApi();

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
apiInstance.getUniverseConstellations(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]
 **userAgent** | **String**| Client identifier, takes precedence over headers | [optional] 
 **xUserAgent** | **String**| Client identifier, takes precedence over User-Agent | [optional] 

### Return type

**[&#39;Integer&#39;]**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getUniverseConstellationsConstellationId"></a>
# **getUniverseConstellationsConstellationId**
> GetUniverseConstellationsConstellationIdOk getUniverseConstellationsConstellationId(constellationId, opts)

Get constellation information

Get information on a constellation  ---  Alternate route: &#x60;/v1/universe/constellations/{constellation_id}/&#x60;  Alternate route: &#x60;/legacy/universe/constellations/{constellation_id}/&#x60;  Alternate route: &#x60;/dev/universe/constellations/{constellation_id}/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.UniverseApi();

var constellationId = 56; // Integer | constellation_id integer

var opts = { 
  'datasource': "tranquility", // String | The server name you would like data from
  'language': "en-us", // String | Language to use in the response
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
apiInstance.getUniverseConstellationsConstellationId(constellationId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **constellationId** | **Integer**| constellation_id integer | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]
 **language** | **String**| Language to use in the response | [optional] [default to en-us]
 **userAgent** | **String**| Client identifier, takes precedence over headers | [optional] 
 **xUserAgent** | **String**| Client identifier, takes precedence over User-Agent | [optional] 

### Return type

[**GetUniverseConstellationsConstellationIdOk**](GetUniverseConstellationsConstellationIdOk.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getUniverseFactions"></a>
# **getUniverseFactions**
> [GetUniverseFactions200Ok] getUniverseFactions(opts)

Get factions

Get a list of factions  ---  Alternate route: &#x60;/v1/universe/factions/&#x60;  Alternate route: &#x60;/legacy/universe/factions/&#x60;  Alternate route: &#x60;/dev/universe/factions/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.UniverseApi();

var opts = { 
  'datasource': "tranquility", // String | The server name you would like data from
  'language': "en-us", // String | Language to use in the response
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
apiInstance.getUniverseFactions(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]
 **language** | **String**| Language to use in the response | [optional] [default to en-us]
 **userAgent** | **String**| Client identifier, takes precedence over headers | [optional] 
 **xUserAgent** | **String**| Client identifier, takes precedence over User-Agent | [optional] 

### Return type

[**[GetUniverseFactions200Ok]**](GetUniverseFactions200Ok.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getUniverseGroups"></a>
# **getUniverseGroups**
> [&#39;Integer&#39;] getUniverseGroups(opts)

Get item groups

Get a list of item groups  ---  Alternate route: &#x60;/v1/universe/groups/&#x60;  Alternate route: &#x60;/legacy/universe/groups/&#x60;  Alternate route: &#x60;/dev/universe/groups/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.UniverseApi();

var opts = { 
  'datasource': "tranquility", // String | The server name you would like data from
  'page': 56, // Integer | Which page to query
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
apiInstance.getUniverseGroups(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]
 **page** | **Integer**| Which page to query | [optional] 
 **userAgent** | **String**| Client identifier, takes precedence over headers | [optional] 
 **xUserAgent** | **String**| Client identifier, takes precedence over User-Agent | [optional] 

### Return type

**[&#39;Integer&#39;]**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getUniverseGroupsGroupId"></a>
# **getUniverseGroupsGroupId**
> GetUniverseGroupsGroupIdOk getUniverseGroupsGroupId(groupId, opts)

Get item group information

Get information on an item group  ---  Alternate route: &#x60;/v1/universe/groups/{group_id}/&#x60;  Alternate route: &#x60;/legacy/universe/groups/{group_id}/&#x60;  Alternate route: &#x60;/dev/universe/groups/{group_id}/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.UniverseApi();

var groupId = 56; // Integer | An Eve item group ID

var opts = { 
  'datasource': "tranquility", // String | The server name you would like data from
  'language': "en-us", // String | Language to use in the response
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
apiInstance.getUniverseGroupsGroupId(groupId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **groupId** | **Integer**| An Eve item group ID | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]
 **language** | **String**| Language to use in the response | [optional] [default to en-us]
 **userAgent** | **String**| Client identifier, takes precedence over headers | [optional] 
 **xUserAgent** | **String**| Client identifier, takes precedence over User-Agent | [optional] 

### Return type

[**GetUniverseGroupsGroupIdOk**](GetUniverseGroupsGroupIdOk.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getUniverseMoonsMoonId"></a>
# **getUniverseMoonsMoonId**
> GetUniverseMoonsMoonIdOk getUniverseMoonsMoonId(moonId, opts)

Get moon information

Get information on a moon  ---  Alternate route: &#x60;/v1/universe/moons/{moon_id}/&#x60;  Alternate route: &#x60;/legacy/universe/moons/{moon_id}/&#x60;  Alternate route: &#x60;/dev/universe/moons/{moon_id}/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.UniverseApi();

var moonId = 56; // Integer | moon_id integer

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
apiInstance.getUniverseMoonsMoonId(moonId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **moonId** | **Integer**| moon_id integer | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]
 **userAgent** | **String**| Client identifier, takes precedence over headers | [optional] 
 **xUserAgent** | **String**| Client identifier, takes precedence over User-Agent | [optional] 

### Return type

[**GetUniverseMoonsMoonIdOk**](GetUniverseMoonsMoonIdOk.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getUniversePlanetsPlanetId"></a>
# **getUniversePlanetsPlanetId**
> GetUniversePlanetsPlanetIdOk getUniversePlanetsPlanetId(planetId, opts)

Get planet information

Get information on a planet  ---  Alternate route: &#x60;/v1/universe/planets/{planet_id}/&#x60;  Alternate route: &#x60;/legacy/universe/planets/{planet_id}/&#x60;  Alternate route: &#x60;/dev/universe/planets/{planet_id}/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.UniverseApi();

var planetId = 56; // Integer | planet_id integer

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
apiInstance.getUniversePlanetsPlanetId(planetId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **planetId** | **Integer**| planet_id integer | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]
 **userAgent** | **String**| Client identifier, takes precedence over headers | [optional] 
 **xUserAgent** | **String**| Client identifier, takes precedence over User-Agent | [optional] 

### Return type

[**GetUniversePlanetsPlanetIdOk**](GetUniversePlanetsPlanetIdOk.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getUniverseRaces"></a>
# **getUniverseRaces**
> [GetUniverseRaces200Ok] getUniverseRaces(opts)

Get character races

Get a list of character races  ---  Alternate route: &#x60;/v1/universe/races/&#x60;  Alternate route: &#x60;/legacy/universe/races/&#x60;  Alternate route: &#x60;/dev/universe/races/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.UniverseApi();

var opts = { 
  'datasource': "tranquility", // String | The server name you would like data from
  'language': "en-us", // String | Language to use in the response
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
apiInstance.getUniverseRaces(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]
 **language** | **String**| Language to use in the response | [optional] [default to en-us]
 **userAgent** | **String**| Client identifier, takes precedence over headers | [optional] 
 **xUserAgent** | **String**| Client identifier, takes precedence over User-Agent | [optional] 

### Return type

[**[GetUniverseRaces200Ok]**](GetUniverseRaces200Ok.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getUniverseRegions"></a>
# **getUniverseRegions**
> [&#39;Integer&#39;] getUniverseRegions(opts)

Get regions

Get a list of regions  ---  Alternate route: &#x60;/v1/universe/regions/&#x60;  Alternate route: &#x60;/legacy/universe/regions/&#x60;  Alternate route: &#x60;/dev/universe/regions/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.UniverseApi();

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
apiInstance.getUniverseRegions(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]
 **userAgent** | **String**| Client identifier, takes precedence over headers | [optional] 
 **xUserAgent** | **String**| Client identifier, takes precedence over User-Agent | [optional] 

### Return type

**[&#39;Integer&#39;]**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getUniverseRegionsRegionId"></a>
# **getUniverseRegionsRegionId**
> GetUniverseRegionsRegionIdOk getUniverseRegionsRegionId(regionId, opts)

Get region information

Get information on a region  ---  Alternate route: &#x60;/v1/universe/regions/{region_id}/&#x60;  Alternate route: &#x60;/legacy/universe/regions/{region_id}/&#x60;  Alternate route: &#x60;/dev/universe/regions/{region_id}/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.UniverseApi();

var regionId = 56; // Integer | region_id integer

var opts = { 
  'datasource': "tranquility", // String | The server name you would like data from
  'language': "en-us", // String | Language to use in the response
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
apiInstance.getUniverseRegionsRegionId(regionId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **regionId** | **Integer**| region_id integer | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]
 **language** | **String**| Language to use in the response | [optional] [default to en-us]
 **userAgent** | **String**| Client identifier, takes precedence over headers | [optional] 
 **xUserAgent** | **String**| Client identifier, takes precedence over User-Agent | [optional] 

### Return type

[**GetUniverseRegionsRegionIdOk**](GetUniverseRegionsRegionIdOk.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getUniverseStargatesStargateId"></a>
# **getUniverseStargatesStargateId**
> GetUniverseStargatesStargateIdOk getUniverseStargatesStargateId(stargateId, opts)

Get stargate information

Get information on a stargate  ---  Alternate route: &#x60;/v1/universe/stargates/{stargate_id}/&#x60;  Alternate route: &#x60;/legacy/universe/stargates/{stargate_id}/&#x60;  Alternate route: &#x60;/dev/universe/stargates/{stargate_id}/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.UniverseApi();

var stargateId = 56; // Integer | stargate_id integer

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
apiInstance.getUniverseStargatesStargateId(stargateId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **stargateId** | **Integer**| stargate_id integer | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]
 **userAgent** | **String**| Client identifier, takes precedence over headers | [optional] 
 **xUserAgent** | **String**| Client identifier, takes precedence over User-Agent | [optional] 

### Return type

[**GetUniverseStargatesStargateIdOk**](GetUniverseStargatesStargateIdOk.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getUniverseStationsStationId"></a>
# **getUniverseStationsStationId**
> GetUniverseStationsStationIdOk getUniverseStationsStationId(stationId, opts)

Get station information

Get information on a station  ---  Alternate route: &#x60;/v2/universe/stations/{station_id}/&#x60;  Alternate route: &#x60;/dev/universe/stations/{station_id}/&#x60;   ---  This route is cached for up to 300 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.UniverseApi();

var stationId = 56; // Integer | station_id integer

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
apiInstance.getUniverseStationsStationId(stationId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **stationId** | **Integer**| station_id integer | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]
 **userAgent** | **String**| Client identifier, takes precedence over headers | [optional] 
 **xUserAgent** | **String**| Client identifier, takes precedence over User-Agent | [optional] 

### Return type

[**GetUniverseStationsStationIdOk**](GetUniverseStationsStationIdOk.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getUniverseStructures"></a>
# **getUniverseStructures**
> [&#39;Integer&#39;] getUniverseStructures(opts)

List all public structures

List all public structures  ---  Alternate route: &#x60;/v1/universe/structures/&#x60;  Alternate route: &#x60;/legacy/universe/structures/&#x60;  Alternate route: &#x60;/dev/universe/structures/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.UniverseApi();

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
apiInstance.getUniverseStructures(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]
 **userAgent** | **String**| Client identifier, takes precedence over headers | [optional] 
 **xUserAgent** | **String**| Client identifier, takes precedence over User-Agent | [optional] 

### Return type

**[&#39;Integer&#39;]**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getUniverseStructuresStructureId"></a>
# **getUniverseStructuresStructureId**
> GetUniverseStructuresStructureIdOk getUniverseStructuresStructureId(structureId, opts)

Get structure information

Returns information on requested structure, if you are on the ACL. Otherwise, returns \&quot;Forbidden\&quot; for all inputs.  ---  Alternate route: &#x60;/v1/universe/structures/{structure_id}/&#x60;  Alternate route: &#x60;/legacy/universe/structures/{structure_id}/&#x60;  Alternate route: &#x60;/dev/universe/structures/{structure_id}/&#x60; 

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');
var defaultClient = EveSwaggerInterface.ApiClient.default;

// Configure OAuth2 access token for authorization: evesso
var evesso = defaultClient.authentications['evesso'];
evesso.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new EveSwaggerInterface.UniverseApi();

var structureId = 789; // Integer | An Eve structure ID

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
apiInstance.getUniverseStructuresStructureId(structureId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **structureId** | **Integer**| An Eve structure ID | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]
 **token** | **String**| Access token to use, if preferred over a header | [optional] 
 **userAgent** | **String**| Client identifier, takes precedence over headers | [optional] 
 **xUserAgent** | **String**| Client identifier, takes precedence over User-Agent | [optional] 

### Return type

[**GetUniverseStructuresStructureIdOk**](GetUniverseStructuresStructureIdOk.md)

### Authorization

[evesso](../README.md#evesso)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getUniverseSystems"></a>
# **getUniverseSystems**
> [&#39;Integer&#39;] getUniverseSystems(opts)

Get solar systems

Get a list of solar systems  ---  Alternate route: &#x60;/v1/universe/systems/&#x60;  Alternate route: &#x60;/legacy/universe/systems/&#x60;  Alternate route: &#x60;/dev/universe/systems/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.UniverseApi();

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
apiInstance.getUniverseSystems(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]
 **userAgent** | **String**| Client identifier, takes precedence over headers | [optional] 
 **xUserAgent** | **String**| Client identifier, takes precedence over User-Agent | [optional] 

### Return type

**[&#39;Integer&#39;]**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getUniverseSystemsSystemId"></a>
# **getUniverseSystemsSystemId**
> GetUniverseSystemsSystemIdOk getUniverseSystemsSystemId(systemId, opts)

Get solar system information

Get information on a solar system  ---  Alternate route: &#x60;/v2/universe/systems/{system_id}/&#x60;  Alternate route: &#x60;/dev/universe/systems/{system_id}/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.UniverseApi();

var systemId = 56; // Integer | system_id integer

var opts = { 
  'datasource': "tranquility", // String | The server name you would like data from
  'language': "en-us", // String | Language to use in the response
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
apiInstance.getUniverseSystemsSystemId(systemId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **systemId** | **Integer**| system_id integer | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]
 **language** | **String**| Language to use in the response | [optional] [default to en-us]
 **userAgent** | **String**| Client identifier, takes precedence over headers | [optional] 
 **xUserAgent** | **String**| Client identifier, takes precedence over User-Agent | [optional] 

### Return type

[**GetUniverseSystemsSystemIdOk**](GetUniverseSystemsSystemIdOk.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getUniverseTypes"></a>
# **getUniverseTypes**
> [&#39;Integer&#39;] getUniverseTypes(opts)

Get types

Get a list of type ids  ---  Alternate route: &#x60;/v1/universe/types/&#x60;  Alternate route: &#x60;/legacy/universe/types/&#x60;  Alternate route: &#x60;/dev/universe/types/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.UniverseApi();

var opts = { 
  'datasource': "tranquility", // String | The server name you would like data from
  'page': 56, // Integer | Which page to query
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
apiInstance.getUniverseTypes(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]
 **page** | **Integer**| Which page to query | [optional] 
 **userAgent** | **String**| Client identifier, takes precedence over headers | [optional] 
 **xUserAgent** | **String**| Client identifier, takes precedence over User-Agent | [optional] 

### Return type

**[&#39;Integer&#39;]**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getUniverseTypesTypeId"></a>
# **getUniverseTypesTypeId**
> GetUniverseTypesTypeIdOk getUniverseTypesTypeId(typeId, opts)

Get type information

Get information on a type  ---  Alternate route: &#x60;/v2/universe/types/{type_id}/&#x60;  Alternate route: &#x60;/dev/universe/types/{type_id}/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.UniverseApi();

var typeId = 56; // Integer | An Eve item type ID

var opts = { 
  'datasource': "tranquility", // String | The server name you would like data from
  'language': "en-us", // String | Language to use in the response
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
apiInstance.getUniverseTypesTypeId(typeId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **typeId** | **Integer**| An Eve item type ID | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]
 **language** | **String**| Language to use in the response | [optional] [default to en-us]
 **userAgent** | **String**| Client identifier, takes precedence over headers | [optional] 
 **xUserAgent** | **String**| Client identifier, takes precedence over User-Agent | [optional] 

### Return type

[**GetUniverseTypesTypeIdOk**](GetUniverseTypesTypeIdOk.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="postUniverseNames"></a>
# **postUniverseNames**
> [PostUniverseNames200Ok] postUniverseNames(ids, opts)

Get names and categories for a set of ID&#39;s

Resolve a set of IDs to names and categories. Supported ID&#39;s for resolving are: Characters, Corporations, Alliances, Stations, Solar Systems, Constellations, Regions, Types.  ---  Alternate route: &#x60;/v2/universe/names/&#x60;  Alternate route: &#x60;/dev/universe/names/&#x60; 

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.UniverseApi();

var ids = [new EveSwaggerInterface.[Integer]()]; // [Integer] | The ids to resolve

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
apiInstance.postUniverseNames(ids, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ids** | **[Integer]**| The ids to resolve | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]
 **userAgent** | **String**| Client identifier, takes precedence over headers | [optional] 
 **xUserAgent** | **String**| Client identifier, takes precedence over User-Agent | [optional] 

### Return type

[**[PostUniverseNames200Ok]**](PostUniverseNames200Ok.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

