# cpp_parser/caffparser 1.caff
import string
import subprocess


def parse(cpath: string, cname: string):
    proc = f"cpp_parser/caffparser {cpath} {cname}"
    print(cpath)
    proc = proc.split()
    subprocess.run(proc)
