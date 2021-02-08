import { MongoClient, ObjectId } from 'mongodb';
import * as moment from 'moment';

import { MONGO } from '../config/config';
import * as MongoConnector from '../connector/mongo';
import * as Global from './global';

let mongoPool: MongoClient;
let collection;

export async function init() {
  mongoPool = await MongoConnector.createPool(MONGO);
  collection = MongoConnector.request({pool: mongoPool, databaseName: 'app', collectionName: 'note'});
}

export async function getAll(options: { search?: string, offset: number, limit: number }): Promise<{ total: number, data: any[] }> {
  if (Global.isNaN(options?.offset) || Global.isNaN(options?.limit)) {
    throw {status: 500, message: `Invalid parameters`};
  }

  const findOptions: any = {};
  if (options.search) {
    findOptions.$text = {
      $search: options.search
    };

    findOptions.$text = {
      $search: options.search
    };
  }

  const sort = {
    index: -1,
    // score: {$meta: 'textScore'},
  };

  const projection = {
    // score: {$meta: 'textScore'},
  };

  const res = await collection.find(findOptions).sort(sort).project(projection).collation({locale: 'en_US', numericOrdering: true}).toArray();
  const data = [];
  for (let i = 0; i < res.length; i++) {
    if (i < options.offset) {
      continue;
    }

    data.push(res[i]);

    if (data.length >= options.limit) {
      break;
    }
  }

  return {
    total: res.length,
    data,
  };
}

export async function getOne(options: any): Promise<any> {
  const data = await collection.findOne({_id: new ObjectId(options.id)});
  return data;
}

export async function add(options: any): Promise<any> {
  const index = await getLastIndex();
  const insertValue = {
    title: options.title,
    content: options.content,
    color: options.color,
    images: options.images,
    date: moment().format(),
    index,
  };

  const data = await collection.insertOne(insertValue);
  return data.insertedId.toString();
}

export async function remove(options: any): Promise<any> {
  await collection.findOneAndDelete({_id: new ObjectId(options.id)});
}

export async function getLastIndex(): Promise<any> {
  const data = await collection.find().sort({index: -1}).collation({locale: 'en_US', numericOrdering: true}).toArray();
  if (Global.isEmpty(data)) {
    return 1;
  }

  return (data[0].index || 1) + 1;
}

export async function update(options: any): Promise<any> {
  const id = options._id;
  const updateValue = {
    title: options.title,
    content: options.content,
    color: options.color,
    date: options.date,
    index: options.index,
    images: options.images,
  };

  await collection.findOneAndUpdate({_id: new ObjectId(id)}, {$set: updateValue});
  return id;
}
