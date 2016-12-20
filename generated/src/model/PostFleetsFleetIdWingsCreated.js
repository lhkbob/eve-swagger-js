/**
 * EVE Swagger Interface
 * An OpenAPI for EVE Online
 *
 * OpenAPI spec version: 0.3.2.dev3
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.EveSwaggerInterface) {
      root.EveSwaggerInterface = {};
    }
    root.EveSwaggerInterface.PostFleetsFleetIdWingsCreated = factory(root.EveSwaggerInterface.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The PostFleetsFleetIdWingsCreated model module.
   * @module model/PostFleetsFleetIdWingsCreated
   * @version 0.3.2.dev3
   */

  /**
   * Constructs a new <code>PostFleetsFleetIdWingsCreated</code>.
   * 201 created object
   * @alias module:model/PostFleetsFleetIdWingsCreated
   * @class
   * @param wingId {Integer} The wing_id of the newly created wing
   */
  var exports = function(wingId) {
    var _this = this;

    _this['wing_id'] = wingId;
  };

  /**
   * Constructs a <code>PostFleetsFleetIdWingsCreated</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/PostFleetsFleetIdWingsCreated} obj Optional instance to populate.
   * @return {module:model/PostFleetsFleetIdWingsCreated} The populated <code>PostFleetsFleetIdWingsCreated</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('wing_id')) {
        obj['wing_id'] = ApiClient.convertToType(data['wing_id'], 'Integer');
      }
    }
    return obj;
  }

  /**
   * The wing_id of the newly created wing
   * @member {Integer} wing_id
   */
  exports.prototype['wing_id'] = undefined;



  return exports;
}));

