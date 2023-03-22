import EventEmitter from 'node:events';

class CriticalErrorEmitter extends EventEmitter {}

export default new CriticalErrorEmitter();
