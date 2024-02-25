barnowl-axis
============

__barnowl-axis__ converts [AXIS Object Analytics](https://www.axis.com/products/axis-object-analytics) messages from network cameras into standard developer-friendly JSON that is vendor/technology/application-agnostic.

__barnowl-axis__ is a lightweight [Node.js package](https://www.npmjs.com/package/barnowl-axis) that can run on resource-constrained edge devices as well as on powerful cloud servers and anything in between.  It is included in reelyActive's [Pareto Anywhere](https://www.reelyactive.com/pareto/anywhere/) open source middleware suite, and can just as easily be run standalone behind a [barnowl](https://github.com/reelyactive/barnowl) instance, as detailed in the code examples below.


Quick Start
-----------

Clone this repository, install package dependencies with `npm install`, and then from the root folder run at any time:

    npm start

__barnowl-axis__ will attempt to connect to a local MQTT server localhost (mqtt://localhost) and subscribe to the Object Analytics topic, outputting processed messages as JSON to the console.


Hello barnowl-axis!
-------------------

Developing an application directly from __barnowl-axis__?  Start by pasting the code below into a file called server.js:

```javascript
const Barnowl = require('barnowl');
const BarnowlAxis = require('barnowl-axis');

let barnowl = new Barnowl({ enableMixing: true });

barnowl.addListener(BarnowlAxis, {}, BarnowlAxis.MqttListener,
                    { url: "mqtt://localhost" });

barnowl.on('infrastructureMessage', (infrastructureMessage) => {
  console.log(infrastructureMessage);
  // Trigger your application logic here
});
```

From the same folder as the server.js file, install package dependencies with the commands `npm install barnowl-axis` and `npm install barnowl`.  Then run the code with the command `node server.js` and observe infrastructureMessage objects output to the console:

```javascript
{
  deviceId: "b8a44f941234",
  deviceIdType: 2,
  isMotionDetected: [ true ],
  timestamp: 1645568542222
}
```

See the [Supported Listener Interfaces](#supported-listener-interfaces) below to adapt the code to listen for your network camera(s).


Supported Listener Interfaces
-----------------------------

The following listener interfaces are supported by __barnowl-axis__.  Extend the [Hello barnowl-axis!](#hello-barnowl-axis) example above by pasting in any of the code snippets below.

### MQTT

Connect to a MQTT server and subscribe to the Object Analytics topic to receive messages:

```javascript
let options = { url: "mqtt://localhost", clientOptions: { username: "user",
                                                          password: "pass" } }; 
barnowl.addListener(BarnowlAxis, {}, BarnowlAxis.MqttListener, options);
```

### Test

Provides periodic AXIS Object Analytics messages for testing purposes.

```javascript
barnowl.addListener(BarnowlAxis, {}, BarnowlAxis.TestListener, {});
```

Supported AXIS Object Analytics scenarios
-----------------------------------------

The following AXIS Object Analytics scenarios are supported:

| Scenario           | Decoded property  | Required scenario name |
|:-------------------|:-------------------------------------------|
| Object in area     | isMotionDetected  | n/a                    |
| Line crossing      | isMotionDetected  | n/a                    |
| Time in area       | isMotionDetected  | n/a                    |
| Crossline counting | passageCounts     | Crossline              |
| Occupancy in area  | numberOfOccupants | Occupancy              |

See the [advlib Standard Properties](https://github.com/reelyactive/advlib/#standard-properties) for details of each decoded property.

Note that the Crossline counting scenario must be named _Crossline_ and the Occupancy in area scenario named _Occupancy_ in order for the corresponding messages to be decoded into `passageCounts` and `numberOfOccupants` properties, respectively.  The AXIS Object Analytics MQTT messages do not include a property to distinguish scenario type, and hence the user-defined name (included in the message as "scenario" property) is observed by __barnowl-axis__ to make this distinction.

The other scenarios require no naming constraints.  The messages for the other scenarios simply include an "active" property which is interpreted by __barnowl-axis__ as `isMotionDetected`.  It is therefore possible for two such scenarios to simultaneously produce contradictory `isMotionDetected` outputs.


Contributing
------------

Discover [how to contribute](CONTRIBUTING.md) to this open source project which upholds a standard [code of conduct](CODE_OF_CONDUCT.md).


Security
--------

Consult our [security policy](SECURITY.md) for best practices using this open source software and to report vulnerabilities.


License
-------

MIT License

Copyright (c) 2024 [reelyActive](https://www.reelyactive.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.