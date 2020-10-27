module.exports = {
  mockResponses: [
    {
      'headers': { 'Content-Type': 'application/json' },
      'url': '/testendpoint1',
      'method': 'GET',
      'status': 200,
      'body': { 'key1': 'value1' }
    },
    {
      'headers': { 'Content-Type': 'application/json' },
      'url': '/testendpoint1',
      'method': 'POST',
      'status': 200,
      'body': { 'key2': 'value2' },
      'conditionalResponse': [
        {
          'payload': {
            'user': 'CJV'
          },
          'body': {
            'key3': 'value3'
          }
        }
      ]
    }
  ]
};