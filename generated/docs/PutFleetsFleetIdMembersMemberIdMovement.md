# EveSwaggerInterface.PutFleetsFleetIdMembersMemberIdMovement

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**role** | **String** | - If a character is moved to the &#x60;fleet_commander&#x60; role, neither &#x60;wing_id&#x60; or &#x60;squad_id&#x60; should be specified - If a character is moved to the &#x60;wing_commander&#x60; role, only &#x60;wing_id&#x60; should be specified - If a character is moved to the &#x60;squad_commander&#x60; role, both &#x60;wing_id&#x60; and &#x60;squad_id&#x60; should be specified - If a character is moved to the &#x60;squad_member&#x60; role, both &#x60;wing_id&#x60; and &#x60;squad_id&#x60; should be specified  | 
**squadId** | **Integer** | squad_id integer | [optional] 
**wingId** | **Integer** | wing_id integer | [optional] 


<a name="RoleEnum"></a>
## Enum: RoleEnum


* `fleet_commander` (value: `"fleet_commander"`)

* `wing_commander` (value: `"wing_commander"`)

* `squad_commander` (value: `"squad_commander"`)

* `squad_member` (value: `"squad_member"`)




