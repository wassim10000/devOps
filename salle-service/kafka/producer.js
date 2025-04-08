const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'salle-service',
  brokers: ['kafka:9092'], // On utilise le nom de service Docker
});

const producer = kafka.producer();

const produceEvent = async (topic, payload) => {
  await producer.connect();
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(payload) }],
  });
  await producer.disconnect();
};

module.exports = produceEvent;
