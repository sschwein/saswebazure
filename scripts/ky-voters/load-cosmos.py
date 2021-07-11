import logging
import json
import os
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


def replace_cosmos(uri, key, database_name, container_name, doc_id, doc):
    client = CosmosClient(uri, key)
    database = client.get_database_client(database=database_name)
    container = database.get_container_client(container_name)
    container.replace_item(doc_id, doc)


def load_voters(voter):
    # try:
    replace_cosmos(
        COSMOS_URI,
        COSMOS_KEY,
        "voters",
        "raw-data",
        voter["id"],
        voter
    )
    # except Exception as e:
    #     logging.warning(f'{voter["id"]} failed with {e}')


if __name__ == "__main__":
    logging.getLogger().setLevel(logging.INFO)
    logging.getLogger("azure").setLevel(logging.WARNING)

    with open('voter-list-2-updated.jsonl', 'r') as _file:
        voters = [json.loads(row) for row in _file.readlines()]

    start_time = datetime.now()
    for batch in chunks(voters, 5000):
        with Pool(30) as pool:
            results = pool.map(load_voters, batch)

    end_time = datetime.now()
    logging.info(f"Total time taken: {(end_time - start_time).total_seconds()}")
