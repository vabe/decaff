#include <iostream>
#include <fstream>
#include <cstdio>
#include <iomanip>
#include <bitset>
#include <vector>
#include <cstddef>
#include <sstream>

#include "caff.hpp"

using namespace std;

// https://en.cppreference.com/w/cpp/types/byte
// https://cplusplus.com/doc/tutorial/files/




int main() {

    ifstream input( "caff_files/1.caff", std::ios::binary );
    vector<unsigned char> buffer(std::istreambuf_iterator<char>(input), {});

    vector<string> rawCaff;

    if(buffer.size() == 0) {
        cout << "Üres";
    } else {
        for(char i: buffer) {
            ostringstream oss;
            oss << hex << (int)(i & 0xff);
            rawCaff.push_back(oss.str());
        }
    }

    CAFF caffFile(rawCaff);
}
