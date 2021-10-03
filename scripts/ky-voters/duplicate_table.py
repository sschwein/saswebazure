import logging
import json
import os
from azure import cosmos
from azure.cosmos import CosmosClient
from datetime import datetime
from multiprocessing.pool import Pool
from utils import chunks


# DEV
# COSMOS_URI = os.environ["DEV_COSMOS_URI"]
# COSMOS_KEY = os.environ["DEV_COSMOS_KEY"]
# PROD
COSMOS_URI = os.environ["PROD_COSMOS_URI"]
COSMOS_KEY = os.environ["PROD_COSMOS_KEY"]
# Impact KY
IMPACTKY_COSMOS_URI = os.environ["IMPACTKY_COSMOS_URI"]
IMPACTKY_COSMOS_KEY = os.environ["IMPACTKY_COSMOS_KEY"]

BATCH_SIZE = 10000
output_file_name = "addresses-2021-10-03.jsonl"
id_col_name = "id"
ids_query = f"SELECT c.{id_col_name} FROM c"
main_query = "SELECT * FROM c WHERE c.{id_col} in ({id_list})"

source_uri = COSMOS_URI
source_key = COSMOS_KEY
source_database = "voters"
source_container = "addresses"

destination_uri = IMPACTKY_COSMOS_URI
destination_key = IMPACTKY_COSMOS_KEY
destination_database = "shared"
destination_container = "addresses"


def trim_item(item):
    del item["_rid"]
    del item["_self"]
    del item["_etag"]
    del item["_attachments"]
    del item["_ts"]
    return item


def upsert_cosmos(uri, key, database_name, container_name, doc):
    client = CosmosClient(uri, key)
    database = client.get_database_client(database=database_name)
    container = database.get_container_client(container_name)
    container.upsert_item(doc)


def load_voters(voter):
    try:
        upsert_cosmos(
            destination_uri,
            destination_key,
            destination_database,
            destination_container,
            voter
        )
    except Exception as e:
        logging.warning(str(e))
        pass


def query_cosmos(uri, key, database_name, container_name, query):
    client = CosmosClient(uri, key)
    database = client.get_database_client(database=database_name)
    container = database.get_container_client(container_name)
    items = container.query_items(query, enable_cross_partition_query=True)

    return items


if __name__ == "__main__":
    logging.getLogger().setLevel(logging.INFO)
    logging.getLogger("azure").setLevel(logging.WARNING)

    source_id_query = query_cosmos(
        source_uri,
        source_key,
        source_database,
        source_container,
        ids_query
    )
    source_ids = [row[id_col_name] for row in source_id_query]

    destination_id_query = query_cosmos(
        destination_uri,
        destination_key,
        destination_database,
        destination_container,
        ids_query
    )
    destination_ids = [row[id_col_name] for row in destination_id_query]
    rows_remaining = len(source_ids) - len(destination_ids)

    while rows_remaining > 0:
        logging.info(f"rows to move: {len(source_ids)}, rows already moved: {len(destination_ids)}, rows remaining: {rows_remaining}")
        ids_to_move = list(set(source_ids).difference(set(destination_ids)))[:BATCH_SIZE]
        id_list_substr = "','".join(ids_to_move)
        id_list_str = f"'{id_list_substr}'"
        batch_query = main_query.format(id_col=id_col_name, id_list=id_list_str)
        batch = query_cosmos(
            source_uri,
            source_key,
            source_database,
            source_container,
            batch_query
        )

        docs_to_move = [trim_item(row) for row in batch]
        with open(output_file_name, 'a') as _file:
            for row in docs_to_move:
                _file.write(f"{json.dumps(row)}\n")

        # for batch in chunks(docs_to_move, BATCH_SIZE):
        with Pool(30) as pool:
            results = pool.map(load_voters, docs_to_move)

        destination_id_query = query_cosmos(
            destination_uri,
            destination_key,
            destination_database,
            destination_container,
            ids_query
        )
        destination_ids = [row[id_col_name] for row in destination_id_query]
        rows_remaining = len(source_ids) - len(destination_ids)
