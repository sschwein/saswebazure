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

BATCH_SIZE = 10
output_file_name = "greenberg-voters-2021-10-05.jsonl"
id_col_name = "id"
ids_query = f"SELECT TOP 10 c.{id_col_name} FROM c"
main_query = "SELECT * FROM c WHERE c.{id_col} in ({id_list})"

source_uri = COSMOS_URI
source_key = COSMOS_KEY
source_database = "voters"
source_container = "raw-data"

destination_uri = IMPACTKY_COSMOS_URI
destination_key = IMPACTKY_COSMOS_KEY
destination_database = "greenberg2022"
destination_container = "voters"


def trim_item(item):
    del item["_rid"]
    del item["_self"]
    del item["_etag"]
    del item["_attachments"]
    del item["_ts"]

    return item


def update_item(item):
    general_history_sum = 0
    primary_history_sum = 0
    full_residence_address = f"{item['residence']['street_address']} {item['residence']['city_address']} {item['residence']['state']} {item['residence']['zip']}"
    for row in item["voting_history"]:
        general_history_sum += row["general_code"]
        primary_history_sum += row["primary_code"]

    item["general_history_sum"] = general_history_sum
    item["primary_history_sum"] = primary_history_sum
    item["precinct_year_key"] = f"{item['precinct_code']} 2022"
    item["full_name"] = f"{item['last_name']}, {item['first_name']} {item['middle_name']}"
    item["pbi_uuid"] = f"{item['first_name']} {item['middle_name']} {item['last_name']} {full_residence_address}"
    item["kref_uuid"] = f"{item['first_name']} {item['last_name']} {full_residence_address}"
    item["impactky_uuid"] = item["uuid"]
    item["id"] = item["uuid"]
    del item["uuid"]

    item["length_of_registration"] = (datetime(2022, 11, 8) - datetime.fromisoformat(item["date_of_registration"])).total_seconds() / 86400 / 365
    if item["length_of_registration"] <= 0.2467:
        item["length_of_registration_bucket"] = {"code": 0, "text": "0) Less than 3 Months"}
    elif item["length_of_registration"] <= 0.495:
        item["length_of_registration_bucket"] = {"code": 1, "text": "1) Less than 6 Months"}
    elif item["length_of_registration"] <= 1:
        item["length_of_registration_bucket"] = {"code": 2, "text": "2) Less 1 Year"}
    elif item["length_of_registration"] <= 3:
        item["length_of_registration_bucket"] = {"code": 3, "text": "3) Between 1 and 3 Years"}
    elif item["length_of_registration"] <= 6:
        item["length_of_registration_bucket"] = {"code": 4, "text": "4) Between 3 and 6 Years"}
    elif item["length_of_registration"] <= 10:
        item["length_of_registration_bucket"] = {"code": 5, "text": "5) Between 6 and 10 Years"}
    elif item["length_of_registration"] <= 15:
        item["length_of_registration_bucket"] = {"code": 6, "text": "6) Between 10 and 15 Years"}
    elif item["length_of_registration"] <= 20:
        item["length_of_registration_bucket"] = {"code": 7, "text": "7) Between 15 and 20 Years"}
    elif item["length_of_registration"] <= 25:
        item["length_of_registration_bucket"] = {"code": 8, "text": "8) Between 20 and 25 Years"}
    elif item["length_of_registration"] > 25:
        item["length_of_registration_bucket"] = {"code": 9, "text": "9) Over 25 Years"}
    else:
        item["length_of_registration_bucket"] = {"code": -1, "text": "Unknown"}

    item["sex_code"] = item["sex"]
    if item["sex_code"] == "M":
        item["sex"] = "Male"
    elif item["sex_code"] == "F":
        item["sex"] = "Female"
    elif item["sex_code"] == "N":
        item["sex"] = "Other"
    else:
        item["sex"] = "Unknown"

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

        docs_to_move = [update_item(trim_item(row)) for row in batch]
        with open(output_file_name, 'a') as _file:
            for row in docs_to_move:
                _file.write(f"{json.dumps(row)}\n")

        break
        # for batch in chunks(docs_to_move, BATCH_SIZE):
        # with Pool(30) as pool:
        #     results = pool.map(load_voters, docs_to_move)

        # destination_id_query = query_cosmos(
        #     destination_uri,
        #     destination_key,
        #     destination_database,
        #     destination_container,
        #     ids_query
        # )
        # destination_ids = [row[id_col_name] for row in destination_id_query]
        # rows_remaining = len(source_ids) - len(destination_ids)
