import json
import argparse
import logging
from os import readlink
import subprocess
from copy import deepcopy
from datetime import date

nominatim_search_template = 'nominatim search --project-dir /mnt/nas/sschwein/Drive/Nominatim/nominatim-planet --query "{address}"'


def trim_address(addr):
    if "APT" in addr:
        addr = addr.split(" APT")[0]
    if "A PT" in addr:
        addr = addr.split(" A PT")[0]
    if "AP T" in addr:
        addr = addr.split(" AP T")[0]
    if " RM " in addr:
        addr = addr.split(" RM ")[0]
    if " R M " in addr:
        addr = addr.split(" R M ")[0]
    if "UNIT" in addr:
        addr = addr.split(" UNIT")[0]
    if "U NIT" in addr:
        addr = addr.split(" U NIT")[0]
    if "UN IT" in addr:
        addr = addr.split(" UN IT")[0]
    if "UNI T" in addr:
        addr = addr.split(" UNI T")[0]
    if "LOT" in addr:
        addr = addr.split(" LOT")[0]
    if "L OT" in addr:
        addr = addr.split(" L OT")[0]
    if "LO T" in addr:
        addr = addr.split(" LO T")[0]
    if "BLDG" in addr:
        addr = addr.split(" BLDG")[0]
    if "B LDG" in addr:
        addr = addr.split(" B LDG")[0]
    if "BL DG" in addr:
        addr = addr.split(" BL DG")[0]
    if "BLD G" in addr:
        addr = addr.split(" BLD G")[0]
    if "TRLR" in addr:
        addr = addr.split(" TRLR")[0]

    return addr


def run():
    with open("gps-errors.jsonl", "r") as _file:
        errors = {f'{trim_address(json.loads(row)["address"].split(";")[0])};{json.loads(row)["address"].split(";")[1]}' for row in _file.readlines()}
        logging.info(f"loaded {len(errors)} unique address errors")

    voters = dict()
    with open("voter-list-full.jsonl", "r") as _file:
        for row in _file.readlines():
            voter = json.loads(row)
            trimmed_address = trim_address(voter["residence"]["street_address"])
            address_string = f'{trimmed_address}; {voter["residence"]["city_address"]}, {voter["residence"]["state"]} {voter["residence"]["zip"][:5]}'
            voter["nominatim_address_string"] = f'{trimmed_address}; {voter["residence"]["state"]}, {voter["residence"]["zip"][:5]}'
            voters[address_string] = voter
        logging.info(f"loaded {len(voters.items())} unique addresses")

    for i, address in enumerate(errors):
        voter = voters[address]
        nominatim_search = deepcopy(nominatim_search_template).format(address=voter["nominatim_address_string"])

        results = subprocess.run(nominatim_search, shell=True, capture_output=True)

        try:
            stdout = json.loads(results.stdout.decode("utf-8"))
        except Exception as e:
            error = {
                "address": address,
                "nominatim_address": voter["nominatim_address_string"],
                "message": f"Python Exception: {e}"
            }
            with open("gps-errors-2.jsonl", "a") as _file:
                _file.write(f"{json.dumps(error)}\n")

            if i % 250 == 0:
                logging.info(f"Converted {i} addresses")
            continue

        if len(stdout) == 0:
            error = {
                "address": address,
                "nominatim_address": voter["nominatim_address_string"],
                "message": "No address found"
            }
            with open("gps-errors-2.jsonl", "a") as _file:
                _file.write(f"{json.dumps(error)}\n")
        elif len(stdout) > 1:
            error = {
                "address": address,
                "nominatim_address": voter["nominatim_address_string"],
                "message": f"{len(stdout)} addresses found"
            }
            with open("gps-errors.jsonl", "a") as _file:
                _file.write(f"{json.dumps(error)}\n")
        else:
            gps = {
                "latitude": stdout[0]["lat"],
                "longitude": stdout[0]["lon"],
                "address": voter["nominatim_address_string"]
            }
            with open("gps-voters-2.jsonl", "a") as _file:
                _file.write(f"{json.dumps(gps)}\n")

        if i % 250 == 0:
            logging.info(f"Converted {i} addresses")


if __name__ == "__main__":
    logging.getLogger().setLevel(logging.INFO)
    run()