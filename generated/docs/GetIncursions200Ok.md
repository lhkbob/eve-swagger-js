# EveSwaggerInterface.GetIncursions200Ok

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**constellationId** | **Integer** | The constellation id in which this incursion takes place | 
**factionId** | **Integer** | The attacking faction&#39;s id | 
**hasBoss** | **Boolean** | Whether the final encounter has boss or not | 
**infestedSolarSystems** | **[Integer]** | A list of infested solar system ids that are a part of this incursion | 
**influence** | **Number** | Influence of this incursion as a float from 0 to 1 | 
**stagingSolarSystemId** | **Integer** | Staging solar system for this incursion | 
**state** | **String** | The state of this incursion | 
**type** | **String** | The type of this incursion | 


<a name="StateEnum"></a>
## Enum: StateEnum


* `withdrawing` (value: `"withdrawing"`)

* `mobilizing` (value: `"mobilizing"`)

* `established` (value: `"established"`)




