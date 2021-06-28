import axios from "axios";

export class ElasticsearchService {
  constructor() {}
  matchRecord = async (index: string, filter: any) => {
    try {
      const route = "http://localhost:9200/" + index + "/_search";
      const result = await axios.post(route, {
        query: {
          bool: {
            should: filter
          }
        }
      });
      return {
        total: result.data.hits.total.value,
        hits: result.data.hits.hits.map((x: any) => x._source)
      };
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  matchRecordAnd = async (index: string, filter: any) => {
    try {
      // [CODE REVIEW] Put this to .env
      const route = "http://localhost:9200/" + index + "/_search";
      const result = await axios.post(route, {
        query: {
          bool: {
            must: filter
          }
        }
      });
      return {
        total: result.data.hits.total.value,
        hits: result.data.hits.hits.map((x: any) => x._source)
      };
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  createRecord = async (index: string, type: string, body: any) => {
    const route = "http://localhost:9200/" + index + "/" + type + "/";
    const result = await axios.post(route, body);
    console.log("successful: ", result.data["_shards"].successful);
    return result.data._shards.successful;
  };
}
