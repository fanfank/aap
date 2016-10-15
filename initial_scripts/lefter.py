# -*- coding: utf8 -*-
"""
@author xuruiqi
@date   20160611
@desc   初始化header记录
"""

from common import *

lefter_list = [
# 页面管理lefter
{
    "name": "页面管理lefter",
    "uniqkey": "pal",
    "components": json.dumps({
        "item": ["pa-ap", "pa-pl"],
    }),
    "op_user": "xuruiqi",
},
# Header管理lefter
{
    "name": "Header管理lefter",
    "uniqkey": "hal",
    "components": json.dumps({
        "item": ["ha-ah", "ha-hl"],
    }),
    "op_user": "xuruiqi",
},
# Lefter管理lefter
{
    "name": "Lefter管理lefter",
    "uniqkey": "lal",
    "components": json.dumps({
        "item": ["la-al", "la-ll"],
    }),
    "op_user": "xuruiqi",
},
# Item管理lefter
{
    "name": "Item管理lefter",
    "uniqkey": "ial",
    "components": json.dumps({
        "item": ["ia-ai", "ia-il"],
    }),
    "op_user": "xuruiqi",
},
# Form管理lefter
{
    "name": "Form管理lefter",
    "uniqkey": "fal",
    "components": json.dumps({
        "item": ["fa-af", "fa-fl"],
    }),
    "op_user": "xuruiqi",
},
# Form Item管理lefter
{
    "name": "Form Item管理lefter",
    "uniqkey": "fial",
    "components": json.dumps({
        "item": ["fia-afi", "fia-fil"],
    }),
    "op_user": "xuruiqi",
},
]

if __name__ == "__main__":
    for lefter in lefter_list:
        req = {
            "url": "http://%s/api/lefter/add_lefter" % HOST_N_PORT,
            "method": "POST",
            "data": lefter,
            "response_format": "json",
        }
        resp = http_request(req)
        print "%s:%s:%r" % (resp["errno"], resp["errmsg"], resp["data"])
