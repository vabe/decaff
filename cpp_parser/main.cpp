#include <iostream>
#include <fstream>
#include <cstdio>
#include <iomanip>
#include <bitset>
#include <vector>
#include <cstddef>
#include <sstream>
#include <regex>
//#include <crtdbg.h>

#include "caff.hpp"

using namespace std;
//g++ main.cpp -o main && /mnt/d/Zsombi/BME/msc/2022-2023-1/szbizt/git/decaff/cpp_parser/main 1.caff
bool is_valid_filename(const std::string& s)
{
    static const regex e("^[a-zA-Z0-9_-]*.caff$", regex_constants::icase);
    return regex_match(s, e);
}

int main(int argc, char *argv[]) {
    std::string current_file_name = argv[1];
    cout << current_file_name << endl;
    if(!is_valid_filename(current_file_name)){
        cout << "invalid filename" << endl;
        exit (EXIT_FAILURE);
    }

    //_CrtSetDbgFlag(_CRTDBG_ALLOC_MEM_DF | _CRTDBG_LEAK_CHECK_DF);
    ifstream input( "caff_files/" + current_file_name, std::ios::binary );
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
    input.close();
}
