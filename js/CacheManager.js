import GraphQLRange from 'react-relay/lib/GraphQLRange';

/**
 * Stores field metadata and values, provides
 * an interface to deserialized cached data
 */
class CacheRecord {
  constructor(dataId, typeName) {
    this.dataId = dataId;
    this.typeName = typeName;
    this.fields = {};
  }
  saveField(field, value) {
    // console.log('saveField', { field, value })
    this.fields[field] = value;
  }
  static fromJSON(data) {
    return new CacheRecord(data.dataId, data.typeName);
  }
}


class CacheRecordStore {
  constructor(records, rootCallMap) {
    console.log('CacheRecordStore', records, rootCallMap)
    this.records = records || {}
    this.rootCallMap = rootCallMap || {}
  }
  writeRootCall(storageKey, identifyingArgValue, dataId) {
    this.rootCallMap[storageKey] = dataId;
  }
  getDataIdFromRootCallName(callName, callValue) {
    return this.rootCallMap[callName];
  }
  readNode(id) {
    return this.records[id] || null;
  }
  static fromJSON({ records, rootCallMap }) {
    for (var key in records) {
      const record = records[key];
      const range = record.__range__;
      if (range) {
        record.__range__ = GraphQLRange.fromJSON(range)
      }
     }
    return new CacheRecordStore(records, rootCallMap);
  }
}


// Implements the CacheWriter interface specified by
// RelayTypes, uses an instance of CacheRecordStore
// to manage the CacheRecord instances
class CacheWriter {
  constructor() {
    let localCache = localStorage.getItem('cache');
    if (localCache) {
      localCache = JSON.parse(localCache).cache;
      this.cache = CacheRecordStore.fromJSON(localCache);
    } else {
      this.cache = new CacheRecordStore();
    }
  }

  writeField(dataId, field, value, typeName) {
    console.group('writeField');
    console.log({ dataId, field, value, typeName })
    let record = this.cache.records[dataId];
    if (!record) {
      record = {
        __dataID__: dataId,
        __typename: typeName,
      }
    }
    record[field] = value;
    this.cache.records[dataId] = record;
    console.groupEnd('writeField');
  }

  writeNode(dataId, record) {
    console.group('writeNode')
    console.log({ dataId, record })
    this.cache.records[dataId] = record;
    console.log({
      records: { ...this.cache.records }
    });
    console.groupEnd('writeNode')
  }

  readNode(dataId) {
    console.group('readNode')
    console.log(dataId)
    const record = this.cache.readNode(dataId)
    console.log({ record });
    console.groupEnd('readNode')
    return record;
  }

  writeRootCall(storageKey, identifyingArgValue, dataId) {
    console.group('writeRootCall')
    console.log({ storageKey, identifyingArgValue, dataId })
    console.groupEnd('writeRootCall')
    this.cache.rootCallMap[storageKey] = dataId;
  }

  readRootCall(callName, callValue, callback) {
    console.group('readRootCall');
    console.log({ callName, callValue });
    console.groupEnd('readRootCall');
    const dataId = this.cache.rootCallMap[callName];
    callback(null, dataId)
  }

}

const cacheWriter = new CacheWriter();

// Serialize and save the cache after two seconds
window.setTimeout(() => {
  localStorage.setItem('cache', JSON.stringify(cacheWriter));
  console.log('saved');
}, 2000)

// Make the cacheWriter accessible in the global scope
// so we can inspect it
window.cacheWriter = cacheWriter;

const RelayCacheManager = {
  clear() {
    console.log('RelayCacheManager.clear')
  },
  getMutationWriter() {
    console.log('getMutationWriter')
    return cacheWriter;
  },
  getQueryWriter() {
    console.log('getQueryWriter')
    return cacheWriter;
  },
  getAllRecords() {
    return cacheWriter.cache.records;
  },
  readNode(id, callback) {
    const node = cacheWriter.readNode(id);
    callback(null, node)
  },
  readRootCall(callName, callValue, callback) {
    console.group('readRootCall')
    console.log({ callName, callValue, callback })
    console.groupEnd('readRootCall')
    cacheWriter.readRootCall(callName, callValue, callback);
  }
}

export default RelayCacheManager;
