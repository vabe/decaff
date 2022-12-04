import requests
from flask import Flask, jsonify, request
from flask_restful import Resource, Api
from flask_restful import reqparse
import json
import wrapper
import subprocess

app = Flask(__name__)
api = Api(app)


@app.route('/uploader', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        data = request.get_json()
        f = wrapper.parse(data['upload_path'], data['json_name'])
        file_path = f"{data['upload_path']}/{data['json_name']}.json"
        if ("&" in data['json_name']) or (";" in data['json_name']):
            return_json =  {
                "code": 406,
                "message": "Not Acceptable"
            }  
            return json.dumps(return_json)
        f2 = open(file_path)
        return_json = json.load(f2)
        return return_json



if __name__ == '__main__':
    proc = f"make -C cpp_parser"
    proc = proc.split()
    subprocess.run(proc)
    app.run(debug=True)