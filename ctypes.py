import ctypes
import pathlib

if __name__ == "__main__":
    # Load the shared library into ctypes
    libname = pathlib.Path().absolute() / "libcmult.so"
    c_lib = ctypes.CDLL(libname)

    path = "D:/Zsombi/BME/msc/2022-2023-1/szbizt/git/decaff/"
    name = "caff_files/1.caff"
    ans = c_lib.parse(path, name)
