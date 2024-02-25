/**
 * Copyright reelyActive 2024
 * We believe in an open Internet of Things
 */


const EventEmitter = require('events').EventEmitter;
const ObjectAnalyticsDecoder = require('./objectanalyticsdecoder.js');
const MqttListener = require('./mqttlistener.js');
const TestListener = require('./testlistener.js');


/**
 * BarnowlAxis Class
 * Converts Axis Communications data into the infrastructureMessage format.
 * @param {Object} options The options as a JSON object.
 */
class BarnowlAxis extends EventEmitter {

  /**
   * BarnowlAxis constructor
   * @param {Object} options The options as a JSON object.
   * @constructor
   */
  constructor(options) {
    super();
    options = options || {};
    options.barnowl = this;

    this.listeners = [];
    this.objectAnalyticsDecoder = new ObjectAnalyticsDecoder({ barnowl: this });
  }

  /**
   * Add a listener to the given hardware interface.
   * @param {Class} ListenerClass The (uninstantiated) listener class.
   * @param {Object} options The options as a JSON object.
   */
  addListener(ListenerClass, options) {
    options = options || {};
    options.decoder = this.objectAnalyticsDecoder;

    let listener = new ListenerClass(options);
    this.listeners.push(listener);
  }

  /**
   * Handle and emit the given raddec.
   * @param {Raddec} raddec The given Raddec instance.
   */
  handleRaddec(raddec) {
    // TODO: observe options to normalise raddec
    this.emit("raddec", raddec);
  }

  /**
   * Handle and emit the given infrastructure message.
   * @param {Object} message The given infrastructure message.
   */
  handleInfrastructureMessage(message) {
    this.emit("infrastructureMessage", message);
  }
}


module.exports = BarnowlAxis;
module.exports.MqttListener = MqttListener;
module.exports.TestListener = TestListener;
