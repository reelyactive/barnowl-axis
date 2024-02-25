/**
 * Copyright reelyActive 2024
 * We believe in an open Internet of Things
 */


/**
 * ObjectAnalyticsDecoder Class
 * Decodes data from Axis Object Analytics payloads and forwards the
 * infrastructureMessages to the given BarnowlAxis instance.
 */
class ObjectAnalyticsDecoder {

  /**
   * ObjectAnalyticsDecoder constructor
   * @param {Object} options The options as a JSON object.
   * @constructor
   */
  constructor(options) {
    options = options || {};

    this.barnowl = options.barnowl;
  }

  /**
   * Handle data from a given source, specified by the origin
   * @param {Object} data The data as JSON.
   * @param {String} origin The unique origin identifier of the listener.
   * @param {Number} time The time of the data capture.
   * @param {Object} decodingOptions The payload decoding options.
   */
  handleData(data, origin, time, decodingOptions) {
    let self = this;
    let infrastructureMessage = processPayload(data, origin, time,
                                               decodingOptions);

    if(infrastructureMessage) {
      self.barnowl.handleInfrastructureMessage(infrastructureMessage);
    }
  }
}


/**
 * Process Axis Object Analytics payload
 * @param {Object} data The data as JSON.
 * @param {String} origin The unique origin identifier of the listener.
 * @param {Number} time The time of the data capture.
 * @param {Object} decodingOptions The payload decoding options.
 */
function processPayload(data, origin, time, decodingOptions) {
  let isValidPayload = (data && data.hasOwnProperty('topic') &&
                        data.hasOwnProperty('timestamp') &&
                        data.hasOwnProperty('message') &&
                        data.message.hasOwnProperty('data'));

  if(!isValidPayload) {
    return null;
  }

  let deviceId = (typeof data.serial === 'string') ? data.serial.toLowerCase() :
                                                     undefined;
  let infrastructureMessage = { deviceId: deviceId,
                                deviceIdType: 3, // TODO: confirm
                                timestamp: data.timestamp };
  let isScenario = (typeof data.message.data.scenario === 'string');
  let isMotion = data.message.data.hasOwnProperty('active');

  if(isScenario) {
    return processScenario(infrastructureMessage, data.message.data);
  }
  else if(isMotion) {
    let isActive = (data.message.data.active !== '0');
    infrastructureMessage.isMotionDetected = [ isActive ];
    return infrastructureMessage;
  }

  return null;
}


/**
 * Process Axis Object Analytics scenario
 * @param {Object} infrastructureMessage The infrastructureMessage to augment.
 * @param {Object} data The data as JSON.
 */
function processScenario(infrastructureMessage, data) {
  switch(data.scenario) {
    case 'numberOfOccupants':
      if(typeof data.total !== 'string') { return null; }
      infrastructureMessage.numberOfOccupants = parseInt(data.total);
      return infrastructureMessage;
    case 'passageCounts':
      if(typeof data.total !== 'string') { return null; }
      infrastructureMessage.passageCounts = [ parseInt(data.total) ];
      return infrastructureMessage;
    default:
      return null;
  }
}


module.exports = ObjectAnalyticsDecoder;
