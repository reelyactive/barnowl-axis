/**
 * Copyright reelyActive 2024
 * We believe in an open Internet of Things
 */


const DEFAULT_MESSAGE_PERIOD_MILLISECONDS = 10000;
const TEST_ORIGIN = 'test';


/**
 * TestListener Class
 * Provides a consistent stream of artificially generated messages.
 */
class TestListener {

  /**
   * TestListener constructor
   * @param {Object} options The options as a JSON object.
   * @constructor
   */
  constructor(options) {
    options = options || {};

    this.decoder = options.decoder;
    this.messagePeriod = options.messagePeriod ||
                         DEFAULT_MESSAGE_PERIOD_MILLISECONDS;
    this.decodingOptions = options.decodingOptions || {};

    setInterval(emitMessages, this.messagePeriod, this);
  }

}


/**
 * Emit simulated messages
 * See: https://www.axis.com/developer-community/axis-object-analytics-counting-data
 * @param {TestListener} instance The given instance.
 */
function emitMessages(instance) {
  let now = new Date();

  let occupancyInArea = Math.round(Math.random() * 10);
  let simulatedOccupancyMessage = {
      topic: "axis:CameraApplicationPlatform/ObjectAnalytics/Device1Scenario1",
      timestamp: now.getTime(),
      serial: "B8A44F941234",
      message: {
          source: {},
          key: {},
          data: {
              scenario: "numberOfOccupants",
              total: occupancyInArea.toString(),
              human: occupancyInArea.toString()
          }
      }
  };
  instance.decoder.handleData(simulatedOccupancyMessage, TEST_ORIGIN,
                              now.getTime(), instance.decodingOptions);

  let crosslineCount = Math.round(Math.random() * 4);
  let simulatedPassagesMessage = {
      topic: "axis:CameraApplicationPlatform/ObjectAnalytics/Device1Scenario2",
      timestamp: now.getTime(),
      serial: "B8A44F941234",
      message: {
          source: {},
          key: {},
          data: {
              scenario: "passageCounts",
              reason: "human",
              total: crosslineCount.toString(),
              totalHuman: crosslineCount.toString()
          }
      }
  };
  instance.decoder.handleData(simulatedPassagesMessage, TEST_ORIGIN,
                              now.getTime(), instance.decodingOptions);

  let active = Math.round(Math.random());
  let simulatedMotionMessage = {
      topic: "axis:CameraApplicationPlatform/ObjectAnalytics/Device1Scenario3",
      timestamp: now.getTime(),
      serial: "B8A44F941234", // This isn't part of the original message
      message: {
          source: {},
          key: {},
          data: {
              active: active.toString()
          }
      }
  };

  instance.decoder.handleData(simulatedMotionMessage, TEST_ORIGIN,
                              now.getTime(), instance.decodingOptions);

}


module.exports = TestListener;
