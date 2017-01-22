# EveSwaggerInterface.FleetsApi

All URIs are relative to *https://esi.tech.ccp.is/latest*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteFleetsFleetIdMembersMemberId**](FleetsApi.md#deleteFleetsFleetIdMembersMemberId) | **DELETE** /fleets/{fleet_id}/members/{member_id}/ | Kick fleet member
[**deleteFleetsFleetIdSquadsSquadId**](FleetsApi.md#deleteFleetsFleetIdSquadsSquadId) | **DELETE** /fleets/{fleet_id}/squads/{squad_id}/ | Delete fleet squad
[**deleteFleetsFleetIdWingsWingId**](FleetsApi.md#deleteFleetsFleetIdWingsWingId) | **DELETE** /fleets/{fleet_id}/wings/{wing_id}/ | Delete fleet wing
[**getFleetsFleetId**](FleetsApi.md#getFleetsFleetId) | **GET** /fleets/{fleet_id}/ | Get fleet information
[**getFleetsFleetIdMembers**](FleetsApi.md#getFleetsFleetIdMembers) | **GET** /fleets/{fleet_id}/members/ | Get fleet members
[**getFleetsFleetIdWings**](FleetsApi.md#getFleetsFleetIdWings) | **GET** /fleets/{fleet_id}/wings/ | Get fleet wings
[**postFleetsFleetIdMembers**](FleetsApi.md#postFleetsFleetIdMembers) | **POST** /fleets/{fleet_id}/members/ | Create fleet invitation
[**postFleetsFleetIdWings**](FleetsApi.md#postFleetsFleetIdWings) | **POST** /fleets/{fleet_id}/wings/ | Create fleet wing
[**postFleetsFleetIdWingsWingIdSquads**](FleetsApi.md#postFleetsFleetIdWingsWingIdSquads) | **POST** /fleets/{fleet_id}/wings/{wing_id}/squads/ | Create fleet squad
[**putFleetsFleetId**](FleetsApi.md#putFleetsFleetId) | **PUT** /fleets/{fleet_id}/ | Update fleet
[**putFleetsFleetIdMembersMemberId**](FleetsApi.md#putFleetsFleetIdMembersMemberId) | **PUT** /fleets/{fleet_id}/members/{member_id}/ | Move fleet member
[**putFleetsFleetIdSquadsSquadId**](FleetsApi.md#putFleetsFleetIdSquadsSquadId) | **PUT** /fleets/{fleet_id}/squads/{squad_id}/ | Rename fleet squad
[**putFleetsFleetIdWingsWingId**](FleetsApi.md#putFleetsFleetIdWingsWingId) | **PUT** /fleets/{fleet_id}/wings/{wing_id}/ | Rename fleet wing


<a name="deleteFleetsFleetIdMembersMemberId"></a>
# **deleteFleetsFleetIdMembersMemberId**
> deleteFleetsFleetIdMembersMemberId(fleetId, memberId, opts)

Kick fleet member

Kick a fleet member  ---  Alternate route: &#x60;/v1/fleets/{fleet_id}/members/{member_id}/&#x60;  Alternate route: &#x60;/legacy/fleets/{fleet_id}/members/{member_id}/&#x60;  Alternate route: &#x60;/dev/fleets/{fleet_id}/members/{member_id}/&#x60; 

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');
var defaultClient = EveSwaggerInterface.ApiClient.default;

// Configure OAuth2 access token for authorization: evesso
var evesso = defaultClient.authentications['evesso'];
evesso.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new EveSwaggerInterface.FleetsApi();

var fleetId = 789; // Integer | ID for a fleet

var memberId = 56; // Integer | The character ID of a member in this fleet

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
apiInstance.deleteFleetsFleetIdMembersMemberId(fleetId, memberId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **fleetId** | **Integer**| ID for a fleet | 
 **memberId** | **Integer**| The character ID of a member in this fleet | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

null (empty response body)

### Authorization

[evesso](../README.md#evesso)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="deleteFleetsFleetIdSquadsSquadId"></a>
# **deleteFleetsFleetIdSquadsSquadId**
> deleteFleetsFleetIdSquadsSquadId(fleetId, squadId, opts)

Delete fleet squad

Delete a fleet squad, only empty squads can be deleted  ---  Alternate route: &#x60;/v1/fleets/{fleet_id}/squads/{squad_id}/&#x60;  Alternate route: &#x60;/legacy/fleets/{fleet_id}/squads/{squad_id}/&#x60;  Alternate route: &#x60;/dev/fleets/{fleet_id}/squads/{squad_id}/&#x60; 

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');
var defaultClient = EveSwaggerInterface.ApiClient.default;

// Configure OAuth2 access token for authorization: evesso
var evesso = defaultClient.authentications['evesso'];
evesso.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new EveSwaggerInterface.FleetsApi();

var fleetId = 789; // Integer | ID for a fleet

var squadId = 789; // Integer | The squad to delete

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
apiInstance.deleteFleetsFleetIdSquadsSquadId(fleetId, squadId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **fleetId** | **Integer**| ID for a fleet | 
 **squadId** | **Integer**| The squad to delete | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

null (empty response body)

### Authorization

[evesso](../README.md#evesso)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="deleteFleetsFleetIdWingsWingId"></a>
# **deleteFleetsFleetIdWingsWingId**
> deleteFleetsFleetIdWingsWingId(fleetId, wingId, opts)

Delete fleet wing

Delete a fleet wing, only empty wings can be deleted. The wing may contain squads, but the squads must be empty  ---  Alternate route: &#x60;/v1/fleets/{fleet_id}/wings/{wing_id}/&#x60;  Alternate route: &#x60;/legacy/fleets/{fleet_id}/wings/{wing_id}/&#x60;  Alternate route: &#x60;/dev/fleets/{fleet_id}/wings/{wing_id}/&#x60; 

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');
var defaultClient = EveSwaggerInterface.ApiClient.default;

// Configure OAuth2 access token for authorization: evesso
var evesso = defaultClient.authentications['evesso'];
evesso.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new EveSwaggerInterface.FleetsApi();

var fleetId = 789; // Integer | ID for a fleet

var wingId = 789; // Integer | The wing to delete

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
apiInstance.deleteFleetsFleetIdWingsWingId(fleetId, wingId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **fleetId** | **Integer**| ID for a fleet | 
 **wingId** | **Integer**| The wing to delete | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

null (empty response body)

### Authorization

[evesso](../README.md#evesso)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getFleetsFleetId"></a>
# **getFleetsFleetId**
> GetFleetsFleetIdOk getFleetsFleetId(fleetId, opts)

Get fleet information

Return details about a fleet  ---  Alternate route: &#x60;/v1/fleets/{fleet_id}/&#x60;  Alternate route: &#x60;/legacy/fleets/{fleet_id}/&#x60;  Alternate route: &#x60;/dev/fleets/{fleet_id}/&#x60;   ---  This route is cached for up to 5 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');
var defaultClient = EveSwaggerInterface.ApiClient.default;

// Configure OAuth2 access token for authorization: evesso
var evesso = defaultClient.authentications['evesso'];
evesso.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new EveSwaggerInterface.FleetsApi();

var fleetId = 789; // Integer | ID for a fleet

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
apiInstance.getFleetsFleetId(fleetId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **fleetId** | **Integer**| ID for a fleet | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

[**GetFleetsFleetIdOk**](GetFleetsFleetIdOk.md)

### Authorization

[evesso](../README.md#evesso)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getFleetsFleetIdMembers"></a>
# **getFleetsFleetIdMembers**
> [GetFleetsFleetIdMembers200Ok] getFleetsFleetIdMembers(fleetId, opts)

Get fleet members

Return information about fleet members  ---  Alternate route: &#x60;/v1/fleets/{fleet_id}/members/&#x60;  Alternate route: &#x60;/legacy/fleets/{fleet_id}/members/&#x60;  Alternate route: &#x60;/dev/fleets/{fleet_id}/members/&#x60;   ---  This route is cached for up to 5 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');
var defaultClient = EveSwaggerInterface.ApiClient.default;

// Configure OAuth2 access token for authorization: evesso
var evesso = defaultClient.authentications['evesso'];
evesso.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new EveSwaggerInterface.FleetsApi();

var fleetId = 789; // Integer | ID for a fleet

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
apiInstance.getFleetsFleetIdMembers(fleetId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **fleetId** | **Integer**| ID for a fleet | 
 **language** | **String**| Language to use in the response | [optional] [default to en-us]
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

[**[GetFleetsFleetIdMembers200Ok]**](GetFleetsFleetIdMembers200Ok.md)

### Authorization

[evesso](../README.md#evesso)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getFleetsFleetIdWings"></a>
# **getFleetsFleetIdWings**
> [GetFleetsFleetIdWings200Ok] getFleetsFleetIdWings(fleetId, opts)

Get fleet wings

Return information about wings in a fleet  ---  Alternate route: &#x60;/v1/fleets/{fleet_id}/wings/&#x60;  Alternate route: &#x60;/legacy/fleets/{fleet_id}/wings/&#x60;  Alternate route: &#x60;/dev/fleets/{fleet_id}/wings/&#x60;   ---  This route is cached for up to 5 seconds

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');
var defaultClient = EveSwaggerInterface.ApiClient.default;

// Configure OAuth2 access token for authorization: evesso
var evesso = defaultClient.authentications['evesso'];
evesso.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new EveSwaggerInterface.FleetsApi();

var fleetId = 789; // Integer | ID for a fleet

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
apiInstance.getFleetsFleetIdWings(fleetId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **fleetId** | **Integer**| ID for a fleet | 
 **language** | **String**| Language to use in the response | [optional] [default to en-us]
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

[**[GetFleetsFleetIdWings200Ok]**](GetFleetsFleetIdWings200Ok.md)

### Authorization

[evesso](../README.md#evesso)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="postFleetsFleetIdMembers"></a>
# **postFleetsFleetIdMembers**
> postFleetsFleetIdMembers(fleetId, invitation, opts)

Create fleet invitation

Invite a character into the fleet, if a character has a CSPA charge set, it is not possible to invite them to the fleet using ESI  ---  Alternate route: &#x60;/v1/fleets/{fleet_id}/members/&#x60;  Alternate route: &#x60;/legacy/fleets/{fleet_id}/members/&#x60;  Alternate route: &#x60;/dev/fleets/{fleet_id}/members/&#x60; 

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');
var defaultClient = EveSwaggerInterface.ApiClient.default;

// Configure OAuth2 access token for authorization: evesso
var evesso = defaultClient.authentications['evesso'];
evesso.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new EveSwaggerInterface.FleetsApi();

var fleetId = 789; // Integer | ID for a fleet

var invitation = new EveSwaggerInterface.PostFleetsFleetIdMembersInvitation(); // PostFleetsFleetIdMembersInvitation | Details of the invitation

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
apiInstance.postFleetsFleetIdMembers(fleetId, invitation, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **fleetId** | **Integer**| ID for a fleet | 
 **invitation** | [**PostFleetsFleetIdMembersInvitation**](PostFleetsFleetIdMembersInvitation.md)| Details of the invitation | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

null (empty response body)

### Authorization

[evesso](../README.md#evesso)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="postFleetsFleetIdWings"></a>
# **postFleetsFleetIdWings**
> PostFleetsFleetIdWingsCreated postFleetsFleetIdWings(fleetId, opts)

Create fleet wing

Create a new wing in a fleet  ---  Alternate route: &#x60;/v1/fleets/{fleet_id}/wings/&#x60;  Alternate route: &#x60;/legacy/fleets/{fleet_id}/wings/&#x60;  Alternate route: &#x60;/dev/fleets/{fleet_id}/wings/&#x60; 

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');
var defaultClient = EveSwaggerInterface.ApiClient.default;

// Configure OAuth2 access token for authorization: evesso
var evesso = defaultClient.authentications['evesso'];
evesso.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new EveSwaggerInterface.FleetsApi();

var fleetId = 789; // Integer | ID for a fleet

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
apiInstance.postFleetsFleetIdWings(fleetId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **fleetId** | **Integer**| ID for a fleet | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

[**PostFleetsFleetIdWingsCreated**](PostFleetsFleetIdWingsCreated.md)

### Authorization

[evesso](../README.md#evesso)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="postFleetsFleetIdWingsWingIdSquads"></a>
# **postFleetsFleetIdWingsWingIdSquads**
> PostFleetsFleetIdWingsWingIdSquadsCreated postFleetsFleetIdWingsWingIdSquads(fleetId, wingId, opts)

Create fleet squad

Create a new squad in a fleet  ---  Alternate route: &#x60;/v1/fleets/{fleet_id}/wings/{wing_id}/squads/&#x60;  Alternate route: &#x60;/legacy/fleets/{fleet_id}/wings/{wing_id}/squads/&#x60;  Alternate route: &#x60;/dev/fleets/{fleet_id}/wings/{wing_id}/squads/&#x60; 

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');
var defaultClient = EveSwaggerInterface.ApiClient.default;

// Configure OAuth2 access token for authorization: evesso
var evesso = defaultClient.authentications['evesso'];
evesso.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new EveSwaggerInterface.FleetsApi();

var fleetId = 789; // Integer | ID for a fleet

var wingId = 789; // Integer | The wing_id to create squad in

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
apiInstance.postFleetsFleetIdWingsWingIdSquads(fleetId, wingId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **fleetId** | **Integer**| ID for a fleet | 
 **wingId** | **Integer**| The wing_id to create squad in | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

[**PostFleetsFleetIdWingsWingIdSquadsCreated**](PostFleetsFleetIdWingsWingIdSquadsCreated.md)

### Authorization

[evesso](../README.md#evesso)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="putFleetsFleetId"></a>
# **putFleetsFleetId**
> putFleetsFleetId(fleetId, newSettings, opts)

Update fleet

Update settings about a fleet  ---  Alternate route: &#x60;/v1/fleets/{fleet_id}/&#x60;  Alternate route: &#x60;/legacy/fleets/{fleet_id}/&#x60;  Alternate route: &#x60;/dev/fleets/{fleet_id}/&#x60; 

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');
var defaultClient = EveSwaggerInterface.ApiClient.default;

// Configure OAuth2 access token for authorization: evesso
var evesso = defaultClient.authentications['evesso'];
evesso.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new EveSwaggerInterface.FleetsApi();

var fleetId = 789; // Integer | ID for a fleet

var newSettings = new EveSwaggerInterface.PutFleetsFleetIdNewSettings(); // PutFleetsFleetIdNewSettings | What to update for this fleet

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
apiInstance.putFleetsFleetId(fleetId, newSettings, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **fleetId** | **Integer**| ID for a fleet | 
 **newSettings** | [**PutFleetsFleetIdNewSettings**](PutFleetsFleetIdNewSettings.md)| What to update for this fleet | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

null (empty response body)

### Authorization

[evesso](../README.md#evesso)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="putFleetsFleetIdMembersMemberId"></a>
# **putFleetsFleetIdMembersMemberId**
> putFleetsFleetIdMembersMemberId(fleetId, memberId, movement, opts)

Move fleet member

Move a fleet member around  ---  Alternate route: &#x60;/v1/fleets/{fleet_id}/members/{member_id}/&#x60;  Alternate route: &#x60;/legacy/fleets/{fleet_id}/members/{member_id}/&#x60;  Alternate route: &#x60;/dev/fleets/{fleet_id}/members/{member_id}/&#x60; 

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');
var defaultClient = EveSwaggerInterface.ApiClient.default;

// Configure OAuth2 access token for authorization: evesso
var evesso = defaultClient.authentications['evesso'];
evesso.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new EveSwaggerInterface.FleetsApi();

var fleetId = 789; // Integer | ID for a fleet

var memberId = 56; // Integer | The character ID of a member in this fleet

var movement = new EveSwaggerInterface.PutFleetsFleetIdMembersMemberIdMovement(); // PutFleetsFleetIdMembersMemberIdMovement | Details of the invitation

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
apiInstance.putFleetsFleetIdMembersMemberId(fleetId, memberId, movement, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **fleetId** | **Integer**| ID for a fleet | 
 **memberId** | **Integer**| The character ID of a member in this fleet | 
 **movement** | [**PutFleetsFleetIdMembersMemberIdMovement**](PutFleetsFleetIdMembersMemberIdMovement.md)| Details of the invitation | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

null (empty response body)

### Authorization

[evesso](../README.md#evesso)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="putFleetsFleetIdSquadsSquadId"></a>
# **putFleetsFleetIdSquadsSquadId**
> putFleetsFleetIdSquadsSquadId(fleetId, squadId, naming, opts)

Rename fleet squad

Rename a fleet squad  ---  Alternate route: &#x60;/v1/fleets/{fleet_id}/squads/{squad_id}/&#x60;  Alternate route: &#x60;/legacy/fleets/{fleet_id}/squads/{squad_id}/&#x60;  Alternate route: &#x60;/dev/fleets/{fleet_id}/squads/{squad_id}/&#x60; 

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');
var defaultClient = EveSwaggerInterface.ApiClient.default;

// Configure OAuth2 access token for authorization: evesso
var evesso = defaultClient.authentications['evesso'];
evesso.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new EveSwaggerInterface.FleetsApi();

var fleetId = 789; // Integer | ID for a fleet

var squadId = 789; // Integer | The squad to rename

var naming = new EveSwaggerInterface.PutFleetsFleetIdSquadsSquadIdNaming(); // PutFleetsFleetIdSquadsSquadIdNaming | New name of the squad

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
apiInstance.putFleetsFleetIdSquadsSquadId(fleetId, squadId, naming, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **fleetId** | **Integer**| ID for a fleet | 
 **squadId** | **Integer**| The squad to rename | 
 **naming** | [**PutFleetsFleetIdSquadsSquadIdNaming**](PutFleetsFleetIdSquadsSquadIdNaming.md)| New name of the squad | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

null (empty response body)

### Authorization

[evesso](../README.md#evesso)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="putFleetsFleetIdWingsWingId"></a>
# **putFleetsFleetIdWingsWingId**
> putFleetsFleetIdWingsWingId(fleetId, wingId, naming, opts)

Rename fleet wing

Rename a fleet wing  ---  Alternate route: &#x60;/v1/fleets/{fleet_id}/wings/{wing_id}/&#x60;  Alternate route: &#x60;/legacy/fleets/{fleet_id}/wings/{wing_id}/&#x60;  Alternate route: &#x60;/dev/fleets/{fleet_id}/wings/{wing_id}/&#x60; 

### Example
```javascript
var EveSwaggerInterface = require('eve_swagger_interface');
var defaultClient = EveSwaggerInterface.ApiClient.default;

// Configure OAuth2 access token for authorization: evesso
var evesso = defaultClient.authentications['evesso'];
evesso.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new EveSwaggerInterface.FleetsApi();

var fleetId = 789; // Integer | ID for a fleet

var wingId = 789; // Integer | The wing to rename

var naming = new EveSwaggerInterface.PutFleetsFleetIdWingsWingIdNaming(); // PutFleetsFleetIdWingsWingIdNaming | New name of the wing

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
apiInstance.putFleetsFleetIdWingsWingId(fleetId, wingId, naming, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **fleetId** | **Integer**| ID for a fleet | 
 **wingId** | **Integer**| The wing to rename | 
 **naming** | [**PutFleetsFleetIdWingsWingIdNaming**](PutFleetsFleetIdWingsWingIdNaming.md)| New name of the wing | 
 **datasource** | **String**| The server name you would like data from | [optional] [default to tranquility]

### Return type

null (empty response body)

### Authorization

[evesso](../README.md#evesso)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

