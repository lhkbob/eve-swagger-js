# EveSwaggerInterface.UniverseApi

All URIs are relative to *https://esi.tech.ccp.is/latest*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getUniverseCategories**](UniverseApi.md#getUniverseCategories) | **GET** /universe/categories/ | Get item categories
[**getUniverseCategoriesCategoryId**](UniverseApi.md#getUniverseCategoriesCategoryId) | **GET** /universe/categories/{category_id}/ | Get item category information
[**getUniverseGroups**](UniverseApi.md#getUniverseGroups) | **GET** /universe/groups/ | Get item groups
[**getUniverseGroupsGroupId**](UniverseApi.md#getUniverseGroupsGroupId) | **GET** /universe/groups/{group_id}/ | Get item group information
[**getUniverseStationsStationId**](UniverseApi.md#getUniverseStationsStationId) | **GET** /universe/stations/{station_id}/ | Get station information
[**getUniverseStructures**](UniverseApi.md#getUniverseStructures) | **GET** /universe/structures/ | List all public structures
[**getUniverseStructuresStructureId**](UniverseApi.md#getUniverseStructuresStructureId) | **GET** /universe/structures/{structure_id}/ | Get structure information
[**getUniverseSystemsSystemId**](UniverseApi.md#getUniverseSystemsSystemId) | **GET** /universe/systems/{system_id}/ | Get solar system information
[**getUniverseTypes**](UniverseApi.md#getUniverseTypes) | **GET** /universe/types/ | Get types
[**getUniverseTypesTypeId**](UniverseApi.md#getUniverseTypesTypeId) | **GET** /universe/types/{type_id}/ | Get type information
[**postUniverseNames**](UniverseApi.md#postUniverseNames) | **POST** /universe/names/ | Get names and categories for a set of ID&#39;s


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
  'datasource': "tranquility" // String | The server name you would like data from
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
  'language': "en-us", // String | Language to use in the response
  'datasource': "tranquility" // String | The server name you would like data from
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
 **language** | **String**| Language to use in the response | [optional] [default to en-us]
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

[**GetUniverseCategoriesCategoryIdOk**](GetUniverseCategoriesCategoryIdOk.md)

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
  'page': 56, // Integer | Which page to query
  'datasource': "tranquility" // String | The server name you would like data from
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
 **page** | **Integer**| Which page to query | [optional] 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

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
  'language': "en-us", // String | Language to use in the response
  'datasource': "tranquility" // String | The server name you would like data from
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
 **language** | **String**| Language to use in the response | [optional] [default to en-us]
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

[**GetUniverseGroupsGroupIdOk**](GetUniverseGroupsGroupIdOk.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getUniverseStationsStationId"></a>
# **getUniverseStationsStationId**
> GetUniverseStationsStationIdOk getUniverseStationsStationId(stationId, opts)

Get station information

Public information on stations  ---  Alternate route: &#x60;/v1/universe/stations/{station_id}/&#x60;  Alternate route: &#x60;/legacy/universe/stations/{station_id}/&#x60;  Alternate route: &#x60;/dev/universe/stations/{station_id}/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.UniverseApi();

var stationId = 56; // Integer | An Eve station ID

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
apiInstance.getUniverseStationsStationId(stationId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **stationId** | **Integer**| An Eve station ID | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

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
  'datasource': "tranquility" // String | The server name you would like data from
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
  'datasource': "tranquility" // String | The server name you would like data from
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

### Return type

[**GetUniverseStructuresStructureIdOk**](GetUniverseStructuresStructureIdOk.md)

### Authorization

[evesso](../README.md#evesso)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getUniverseSystemsSystemId"></a>
# **getUniverseSystemsSystemId**
> GetUniverseSystemsSystemIdOk getUniverseSystemsSystemId(systemId, opts)

Get solar system information

Information on solar systems  ---  Alternate route: &#x60;/v1/universe/systems/{system_id}/&#x60;  Alternate route: &#x60;/legacy/universe/systems/{system_id}/&#x60;  Alternate route: &#x60;/dev/universe/systems/{system_id}/&#x60;   ---  This route is cached for up to 3600 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.UniverseApi();

var systemId = 56; // Integer | An Eve solar system ID

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
apiInstance.getUniverseSystemsSystemId(systemId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **systemId** | **Integer**| An Eve solar system ID | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

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
  'page': 56, // Integer | Which page to query
  'datasource': "tranquility" // String | The server name you would like data from
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
 **page** | **Integer**| Which page to query | [optional] 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

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
  'language': "en-us", // String | Language to use in the response
  'datasource': "tranquility" // String | The server name you would like data from
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
 **language** | **String**| Language to use in the response | [optional] [default to en-us]
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

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

Resolve a set of IDs to names and categories. Supported ID&#39;s for resolving are: Characters, Corporations, Alliances, Stations, Solar Systems, Constellations, Regions, Types.  ---  Alternate route: &#x60;/v1/universe/names/&#x60;  Alternate route: &#x60;/legacy/universe/names/&#x60; 

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');

var apiInstance = new EveSwaggerInterface.UniverseApi();

var ids = new EveSwaggerInterface.PostUniverseNamesIds(); // PostUniverseNamesIds | The ids to resolve

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
apiInstance.postUniverseNames(ids, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ids** | [**PostUniverseNamesIds**](PostUniverseNamesIds.md)| The ids to resolve | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

[**[PostUniverseNames200Ok]**](PostUniverseNames200Ok.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

