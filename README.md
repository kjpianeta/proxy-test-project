## proxy-test-project
The proxy-test-project proxies http requests, to provided upstream targets, via WebAPI.
It's a Node.js project. It also relies on NGINX to serve as a front facing proxy for the WepAPI and
Docker for portability.

##### Requirements
This project requires:
* docker
* docker-compose
* bash

##### Initalization
This project relies on docker-compose to facilitate it's orchestration and portability.
To start the application
```bash
docker-compose up --build
```
##### Usage
Invocation to proxy target http://www.google.com:
```bash
curl 'http://localhost:9000/proxy?target=http://www.google.com'
```
Invocation to fetch the internal state for proxied endpoints:
```bash
curl 'http://localhost:9000/proxy/stats'
```
Expected JSON content returned by /proxy/stats WebAPI 
```json
[
  {
    "target": "http://www.google.com",
    "count": 1,
    "http_status": [
      {
        "2XX": "1"
      },
      {
        "3XX": "0"
      },
      {
        "4XX": "0"
      },
      {
        "5XX": "0"
      }
    ],
    "avg_latency_ms": 129
  }
]
```
##### Test
The project also includes integration test with mocked endpoints.
The test suite is based on the [mocha](https://mochajs.org/) framework. Target endpoint mocks
are provided by [node-nock](https://github.com/node-nock/nock). The node-nock framework
allows intercepting requests at the Node.js application level.

```bash
docker exec proxy-test-project_proxyapp_1 npm test
```
Test output:
```text

> proxyapp@0.0.1 test /app
> ./node_modules/mocha/bin/mocha --exit --ui bdd



  Test when upstream proxy request httpStatus returns 200
    Given client calls proxy
GET /proxy?target=http://www.google.com 200 1024.990 ms - -
      ✓ When proxy call to target www.google.com returns httpStatus 200 after ~ 1000ms (1057ms)
GET /proxy/stats 200 2.471 ms - 132
[ { target: 'http://www.google.com',
    count: 1,
    http_status: [ { '2XX': '1' }, { '3XX': '0' }, { '4XX': '0' }, { '5XX': '0' } ],
    avg_latency_ms: 1020 } ]
1
      ✓ Then proxy reports target httpStatus 2XX increased by 1

  Test when upstream proxy request httpStatus returns 300
    Given client calls proxy
GET /proxy?target=http://www.google.com 300 1003.669 ms - -
      ✓ When proxy call to target www.google.com returns httpStatus 300 after ~ 1000ms (1007ms)
GET /proxy/stats 200 0.448 ms - 132
[ { target: 'http://www.google.com',
    count: 2,
    http_status: [ { '2XX': '1' }, { '3XX': '1' }, { '4XX': '0' }, { '5XX': '0' } ],
    avg_latency_ms: 1003 } ]
1
      ✓ Then proxy reports target httpStatus 3XX increased by 1

  Test when upstream proxy request httpStatus returns 400
    Given client calls proxy
GET /proxy?target=http://www.google.com 400 1002.129 ms - -
      ✓ When proxy call to target www.google.com returns httpStatus 400 after ~ 1000ms (1006ms)
GET /proxy/stats 200 0.210 ms - 132
[ { target: 'http://www.google.com',
    count: 3,
    http_status: [ { '2XX': '1' }, { '3XX': '1' }, { '4XX': '1' }, { '5XX': '0' } ],
    avg_latency_ms: 1001 } ]
1
      ✓ Then proxy reports target httpStatus 4XX increased by 1

  Test when upstream proxy request httpStatus returns 500
    Given client calls proxy
GET /proxy?target=http://www.google.com 500 1005.577 ms - -
      ✓ When proxy call to target www.google.com returns httpStatus 500 after ~ 1000ms (1009ms)
GET /proxy/stats 200 0.270 ms - 132
[ { target: 'http://www.google.com',
    count: 4,
    http_status: [ { '2XX': '1' }, { '3XX': '1' }, { '4XX': '1' }, { '5XX': '1' } ],
    avg_latency_ms: 1005 } ]
1
      ✓ Then proxy reports target httpStatus 5XX increased by 1


  8 passing (4s)

```
