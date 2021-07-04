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
    if "STR" in addr:
        addr = addr.split(" STR")[0]
    if "ST E" in addr:
        addr = addr.split(" STR")[0]
    if "S TE" in addr:
        addr = addr.split(" STR")[0]
    if "#" in addr:
        addr = addr.split(" #")[0]

    addr = addr.replace(" TRCE", " TRACE")
    addr = addr.replace(" CI R;", " CIR;")
    addr = addr.replace(" C IR;", " CIR;")
    addr = addr.replace(" D R;", " DR;")

    return addr
