import asyncio
import logging
import json
import jsonlines
import os
import uuid
from azure.cosmos.aio import CosmosClient
from datetime import datetime
# from multiprocessing.pool import Pool
from scripts.utils import chunks

logging.getLogger().setLevel(logging.INFO)
logging.getLogger("azure").setLevel(logging.WARNING)

BATCH_SIZE = 10000


async def write_to_cosmos(database, container_name, data):
    container = database.get_container_client(container_name)
    result = await container.upsert_item(data)

    return result


async def wrapper(database, item, container):
    try:
        await write_to_cosmos(
            database,
            container,
            item
        )
    except Exception as e:
        logging.warning(f"failed on cosmos write to container '{container}' due to: {e}")


async def worker(queue):
    while True:
        database, item, container = await queue.get()
        await wrapper(database, item, container)
        queue.task_done()


async def add_to_queue(items, container):
    queue = asyncio.Queue()
    cosmos_client = CosmosClient(test, test)
    database = cosmos_client.get_database_client(database=cosmos_database)

    for item in items:
        if "id" not in item.keys():
            raise Exception("id missing")
            # item["id"] = str(uuid.uuid4())
        queue.put_nowait((database, item, container))

    tasks = []
    for i in range(50):
        task = asyncio.create_task(worker(queue))
        tasks.append(task)
    
    await queue.join()

    for task in tasks:
        task.cancel()

    await asyncio.gather(*tasks, return_exceptions=True)

    await cosmos_client.close()


for container in containers:
    with jsonlines.open(f"test.txt") as reader:
        for i, batch in enumerate(chunks(reader, BATCH_SIZE)):
            start_time = datetime.now()

            asyncio.run(add_to_queue(batch, container))

            end_time = datetime.now()
            logging.info(f"execution took {int((end_time - start_time).total_seconds())} seconds")
