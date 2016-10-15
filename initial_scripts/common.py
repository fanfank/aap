# -*- coding: utf8 -*-
"""
@author xuruiqi
@date   20161009
@desc   初始化的公用文件
"""
import json
import os
import sys
import urllib
import urllib2
import traceback

HOST_N_PORT = os.environ.get("HOST_N_PORT", "")
if not HOST_N_PORT:
    print "请确保AAP后端已经启动，且通过环境变量HOST_N_PORT=IP:PORT指定AAP后端的IP端口"
    exit(255)

def http_request(params):
    """a wrap function for send http request
    Authors: xuruiqi
    Inputs:
        param: dict
            {
                "url": string,    target url
                "method": string, "GET" or "POST"
                "data": dict,     if data is specified, POST is used
                "response_format": string, return format, "json" or "raw"
            }

    """
    try:
        if params.get("data", None):
            post_data = params["data"]
            if not isinstance(post_data, basestring):
                post_data = urllib.urlencode(post_data)

            req = urllib2.Request(
                params["url"],
                post_data
            )   
        else:
            req = urllib2.Request(params["url"])

        if params.get("headers", None):
            for k, v in params["headers"].iteritems():
                req.add_header(k, v)

        if not params.get("timeout", None):
            params["timeout"] = 10

        response = urllib2.urlopen(req, timeout = params["timeout"])
        status_code = response.getcode()
        if status_code >= 300:
            return {
                "errno": -1,
                "errmsg": str(status_code),
            }

        raw_data = response.read()
    except Exception as ex:
        errmsg = "Unknown exception=[{}], traceback=[{}]".format(
            repr(ex),
            repr(traceback.format_exception(*sys.exc_info()))
        )
        return {
            "errno": -2,
            "errmsg": errmsg,
        }

    return {
        "errno": 0,
        "errmsg": "success",
        "data": raw_data \
                if params.get("response_format", "raw") != "json" \
                else json.loads(raw_data.strip()),
    }
