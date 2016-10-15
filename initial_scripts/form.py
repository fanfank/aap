# -*- coding: utf8 -*-
"""
@author xuruiqi
@date   20160608
@desc   初始化form记录
"""

from common import *

form_list = [
# 添加页面
{
    "name": "添加页面",
    "post_api": "/api/page/add_page",
    "urlmark": "add_page",
    "content_type": "application/x-www-form-urlencoded;charset=utf-8",
    "components": json.dumps({
        "form_input": ["n-n", "p-name", "p-title", "fi-urlmark", "p-comp", "p-ct", "n-opu", "n-ext"],
    }),
    "op_user": "xuruiqi",
},
# 添加Header
{
    "name": "添加Header",
    "post_api": "/api/header/add_header",
    "urlmark": "add_header",
    "content_type": "application/x-www-form-urlencoded;charset=utf-8",
    "components": json.dumps({
        "form_input": ["n-n", "h-name", "fi-uniqkey", "h-comp", "n-opu", "n-ext"],
    }),
    "op_user": "xuruiqi",
},
# 添加Lefter
{
    "name": "添加Lefter",
    "post_api": "/api/lefter/add_lefter",
    "urlmark": "add_lefter",
    "content_type": "application/x-www-form-urlencoded;charset=utf-8",
    "components": json.dumps({
        "form_input": ["n-n", "l-name", "fi-uniqkey", "l-comp", "n-opu", "n-ext"],
    }),
    "op_user": "xuruiqi",
},
# 添加Item
{
    "name": "添加Item",
    "post_api": "/api/item/add_item",
    "urlmark": "add_item",
    "content_type": "application/x-www-form-urlencoded;charset=utf-8",
    "components": json.dumps({
        "form_input": ["n-n", "i-name", "fi-uniqkey", "fi-disp", "i-itype", "i-jtype", "n-opu", "n-ext"],
    }),
    "op_user": "xuruiqi",
},
# 添加Form
{
    "name": "添加表单",
    "post_api": "/api/form/add_form",
    "urlmark": "add_form",
    "content_type": "application/x-www-form-urlencoded;charset=utf-8",
    "components": json.dumps({
        "form_input": ["n-n", "f-name", "f-papi", "fi-urlmark", "f-submittype", "f-comp", "n-opu", "n-ext"],
    }),
    "op_user": "xuruiqi",
},
# 添加Form Input
{
    "name": "添加表单输入",
    "post_api": "/api/form_input/add_form_input",
    "urlmark": "add_form_input",
    "content_type": "application/x-www-form-urlencoded;charset=utf-8",
    "components": json.dumps({
        "form_input": ["n-n", "fi-name", "fi-uniqkey", "fi-disp", "fi-help", "fi-default", "fi-pkey", "fi-itype", "fi-rhattrs", "n-opu", "n-ext"],
    }),
    "op_user": "xuruiqi",
},
]

if __name__ == "__main__":
    for form in form_list:
        req = {
            "url": "http://%s/api/form/add_form" % HOST_N_PORT,
            "method": "POST",
            "data": form,
            "response_format": "json",
        }
        resp = http_request(req)
        print "%s:%s:%r" % (resp["errno"], resp["errmsg"], resp["data"])
