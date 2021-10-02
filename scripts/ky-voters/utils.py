import logging
import os
import requests
import urllib


def separate_number(addr):
    if not addr[0].isnumeric():
        return addr
    else:
        i = 0
        for char in addr:
            if not char.isnumeric():
                break
            i += 1
        addr = f"{addr[:i]} {addr[i:]}"
        return addr


def trim_address(addr):
    if "APT" in addr:
        addr = addr.split(" APT ")[0]
    if "A PT" in addr:
        addr = addr.split(" A PT ")[0]
    if "AP T" in addr:
        addr = addr.split(" AP T ")[0]
    if " RM " in addr:
        addr = addr.split(" RM ")[0]
    if " R M " in addr:
        addr = addr.split(" R M ")[0]
    if "UNIT" in addr:
        addr = addr.split(" UNIT ")[0]
    if "U NIT" in addr:
        addr = addr.split(" U NIT ")[0]
    if "UN IT" in addr:
        addr = addr.split(" UN IT ")[0]
    if "UNI T" in addr:
        addr = addr.split(" UNI T ")[0]
    if "LOT" in addr:
        addr = addr.split(" LOT ")[0]
    if "L OT" in addr:
        addr = addr.split(" L OT ")[0]
    if "LO T" in addr:
        addr = addr.split(" LO T ")[0]
    if "BLDG" in addr:
        addr = addr.split(" BLDG ")[0]
    if "B LDG" in addr:
        addr = addr.split(" B LDG ")[0]
    if "BL DG" in addr:
        addr = addr.split(" BL DG ")[0]
    if "BLD G" in addr:
        addr = addr.split(" BLD G ")[0]
    if "TRLR" in addr:
        addr = addr.split(" TRLR ")[0]
    if "STE" in addr:
        addr = addr.split(" STE ")[0]
    if "ST E" in addr:
        addr = addr.split(" ST E ")[0]
    if "S TE" in addr:
        addr = addr.split(" S TE ")[0]
    if "#" in addr:
        addr = addr.split(" #")[0]
    if "REAR" in addr:
        addr = addr.split(" REAR")[0]
    if " FL " in addr:
        addr = addr.split(" FL ")[0]

    addr = addr.replace(" TRCE", " TRACE")
    addr = addr.replace(" CI R", " CIR")
    addr = addr.replace(" C IR", " CIR")
    addr = addr.replace(" D R", " DR")
    addr = addr.replace(" R D", " RD")
    addr = addr.replace(" C T", " CT")
    addr = addr.replace(" 1/2 ", "")
    addr = addr.replace(" VLG", " VILLAGE")
    addr = addr.replace(" W AY", " WAY")
    addr = addr.replace(" WA Y", " WAY")
    addr = addr.replace(" B LVD", " BLVD")
    addr = addr.replace(" BL VD", " BLVD")
    addr = addr.replace(" BLV D", " BLVD")
    addr = addr.replace(" COPPERCREEK ", " COPPER CREEK ")
    addr = addr.replace(" SILVERCREEK ", " SILVER CREEK ")
    addr = addr.replace(" OAKCREEK ", " OAK CREEK ")
    addr = addr.replace(" MEADOWCREEK ", " MEADOW CREEK ")
    addr = addr.replace(" BLF", " BLUFF")
    addr = addr.replace(" LAWRENCEKIRK ", " LAWRENCE KIRK ")
    addr = addr.replace(" BAYGARDEN ", " BAY GARDEN ")
    addr = addr.replace(" EASTBAY ", " EAST BAY ")
    addr = addr.replace(" MEADOWLARK ", " MEADOW LARK ")
    addr = addr.replace(" HAWTHORN HL", " HAWTHORN HILL")
    addr = addr.replace(" MAPLECREEK ", " MAPLE CREEK ")
    addr = addr.replace(" HI VIEW ", " HIVIEW ")
    addr = addr.replace(" CHURC H ", " CHURCH ")
    addr = addr.replace(" TRADESMILL ", " TRADES MILL ")
    addr = addr.replace(" STABLELAKE ", " STABLE LAKE ")
    addr = addr.replace(" LAKEGREEN ", " LAKE GREEN ")
    addr = addr.replace(" HOLW", " HOLLOW")
    addr = addr.replace(" SILVERLEAF ", " SILVER LEAF ")
    addr = addr.replace(" LA FOLLETTE ", " LAFOLLETTE ")

    if not addr.split(' ')[0].isnumeric():
        addr = separate_number(addr)

    return addr


def clean_address(addr):
    addr = addr.replace(" TRCE", " TRACE")
    addr = addr.replace(" CI R;", " CIR;")
    addr = addr.replace(" C IR;", " CIR;")
    addr = addr.replace(" A PT ", " APT ")
    addr = addr.replace(" AP T ", " APT ")
    addr = addr.replace(" R M ", " RM ")
    addr = addr.replace(" U NIT ", " UNIT ")
    addr = addr.replace(" UN IT ", " UNIT ")
    addr = addr.replace(" UNI T ", " UNIT ")
    addr = addr.replace(" LO T ", " LOT ")
    addr = addr.replace(" L OT ", " LOT ")
    addr = addr.replace(" B LDG ", " BLDG ")
    addr = addr.replace(" BL DG ", " BLDG ")
    addr = addr.replace(" BLD G ", " BLDG ")
    addr = addr.replace(" ST E ", " STE ")
    addr = addr.replace(" S TE ", " STE ")
    addr = addr.replace(" D R;", " DR;")
    addr = addr.replace(" R D;", " RD;")
    addr = addr.replace(" C T;", " CT;")
    addr = addr.replace(" W AY;", " WAY;")
    addr = addr.replace(" WA Y;", " WAY;")
    addr = addr.replace(" B LVD", " BLVD")
    addr = addr.replace(" BL VD", " BLVD")
    addr = addr.replace(" BLV D", " BLVD")
    addr = addr.replace(" COPPERCREEK ", " COPPER CREEK ")
    addr = addr.replace(" SILVERCREEK ", " SILVER CREEK ")
    addr = addr.replace(" OAKCREEK ", " OAK CREEK ")
    addr = addr.replace(" MEADOWCREEK ", " MEADOW CREEK ")
    addr = addr.replace(" BLF", " BLUFF")
    addr = addr.replace(" LAWRENCEKIRK ", " LAWRENCE KIRK ")
    addr = addr.replace(" BAYGARDEN ", " BAY GARDEN ")
    addr = addr.replace(" EASTBAY ", " EAST BAY ")
    addr = addr.replace(" MEADOWLARK ", " MEADOW LARK ")
    addr = addr.replace(" HAWTHORN HL", " HAWTHORN HILL")
    addr = addr.replace(" MAPLECREEK ", " MAPLE CREEK ")
    addr = addr.replace(" HI VIEW ", " HIVIEW ")
    addr = addr.replace(" CHURC H ", " CHURCH ")
    addr = addr.replace(" TRADESMILL ", " TRADES MILL ")
    addr = addr.replace(" STABLELAKE ", " STABLE LAKE ")
    addr = addr.replace(" LAKEGREEN ", " LAKE GREEN ")
    addr = addr.replace(" HOLW", " HOLLOW")
    addr = addr.replace(" SILVERLEAF ", " SILVER LEAF ")
    addr = addr.replace(" LA FOLLETTE ", " LAFOLLETTE ")

    if not addr.split(' ')[0].isnumeric():
        addr = separate_number(addr)

    return addr


def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        logging.info(f"starting chunk {i}")
        yield lst[i:i + n]


def geocode_address(address):
    url = os.getenv("GOOGLE_GEOCODING_URL")
    api_key = os.getenv("GOOGLE_MAPS_API_KEY")
    bounds = "38.37295008285184,-85.94441794520358,37.99716815572792,-85.40531360892128"

    parsed_address = urllib.parse.quote(address)
    full_url = f"{url}address={parsed_address}&key={api_key}&bounds={bounds}&language=en"
    response = requests.get(full_url)

    if response.status_code == 200:
        data = response.json()
        if len(data["results"]) == 0:
            return (None, None)

        gps_coords = data["results"][0]["geometry"]["location"]
        logging.info(f"Geocoded address: {address} at gps coordinates: {gps_coords}")
        return (gps_coords["lat"], gps_coords["lng"], data)
    else:
        logging.warning("Failed to geocode address")
        return (None, None)
