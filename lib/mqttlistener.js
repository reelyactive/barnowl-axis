/**
 * Copyright reelyActive 2024
 * We believe in an open Internet of Things
 */


const mqtt = require('mqtt');


const DEFAULT_URL = 'mqtt://localhost';
const DEFAULT_CLIENT_OPTIONS = {};
const DEFAULT_TOPIC =
                    'axis/+/event/CameraApplicationPlatform/ObjectAnalytics/#';


/**
 * MqttListener Class
 * Listens for messages as the client of a MQTT server.
 */
class MqttListener {

  /**
   * MqttListener constructor
   * @param {Object} options The options as a JSON object.
   * @constructor
   */
  constructor(options) {
    options = options || {};

    this.decoder = options.decoder;
    this.url = options.url || DEFAULT_URL;
    this.client = createMqttClient(this, this.url, options.clientOptions);
    this.client.on('message', (topic, message) => {
      handleMessage(message, topic, this.decoder, this.url,
                    options.decodingOptions);
    });
  }

}


/**
 * Create the MQTT client and handle messages.
 * @param {MqttListener} instance The MqttListener instance.
 * @param {String} url The MQTT server URL.
 * @param {Object} clientOptions The MQTT client options.
 * @param {String} topic The MQTT topic to which to subscribe.
 */
function createMqttClient(instance, url, clientOptions, topic) {
  clientOptions = clientOptions || DEFAULT_CLIENT_OPTIONS;
  topic = topic || DEFAULT_TOPIC;

  let client = mqtt.connect(instance.url, clientOptions);

  client.on('connect', () => {
    client.subscribe(topic, (err) => {
      if(!err) {
        console.log('barnowl-axis: connected to MQTT server and subscribed');
      }
    });
  });

  return client;
}


/**
 * Handle the given message and topic.
 * @param {Buffer} message The MQTT message.
 * @param {String} topic The MQTT topic.
 * @param {ObjectAnalyticsDecoder} decoder The message decoder.
 * @param {String} url The MQTT server URL.
 * @param {Object} decodingOptions The decoding options, if any.
 */
function handleMessage(message, topic, decoder, url, decodingOptions) {
  let jsonMessage = JSON.parse(message.toString());
  decoder.handleData(jsonMessage, url, Date.now(), decodingOptions);
}


module.exports = MqttListener;
