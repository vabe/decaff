# cpp_parser/caffparser 1.caff
import string
import subprocess


def parse(caff: string):
    proc = f"cpp_parser/caffparser {caff}"
    proc = proc.split()
    subprocess.run(proc)
