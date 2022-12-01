import requests
from flask import Flask
from flask_restful import Resource, Api
import wrapper
import subprocess

app = Flask(__name__)
api = Api(app)


class Parse(Resource):
    def get(self):
        wrapper.parse("1.caff")
        return {'hello': 'world'}


api.add_resource(Parse, '/')

if __name__ == '__main__':
    proc = f"make -C cpp_parser"
    proc = proc.split()
    subprocess.run(proc)
    app.run(debug=True)
