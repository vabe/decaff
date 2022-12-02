
#include <iostream>
#include <fstream>
#include <cstdio>
#include <iomanip>
#include <bitset>
#include <vector>
#include <cstddef>
#include <sstream>
#include <regex>
#include <ctime>
//#include <crtdbg.h>
//#include <windows.h>

#include "caff.hpp"
#include "logger.hpp"


using namespace std;


bool is_valid_filename(const std::string& s)
{
    static const regex e("^[a-zA-Z0-9_-]*.caff$", regex_constants::icase);
    return regex_match(s, e);
}



int main(int argc, char *argv[]) {
    std::string current_file_name;
    //cout << current_file_name << endl;
    //string current_file_name;
    auto logger = Logger::GetInstance();
    current_file_name = argv[2];

    if(!is_valid_filename(current_file_name)){
        cout << "invalid filename" << endl;
        logger->Log(__FILE__, __LINE__, "INVALID Filename: " + current_file_name, LogLevel::ERROR);
        exit (EXIT_FAILURE);
    }

    string cpath =  argv[1];
    string outputName = to_string(time(nullptr)) + "_" +current_file_name;
    logger->SetLogPreferences(cpath +"/"+outputName+".txt", logger->GetLogLevel("INFO"), logger->GetLogOutput("FILE"));
    logger->Log(__FILE__, __LINE__, "INIT Filename: " + current_file_name, LogLevel::INFO);

    //_CrtSetDbgFlag(_CRTDBG_ALLOC_MEM_DF | _CRTDBG_LEAK_CHECK_DF);
    ifstream input( cpath + "/" + current_file_name, std::ios::binary );
    vector<unsigned char> buffer(std::istreambuf_iterator<char>(input), {});
    vector<string> rawCaff;

    if(buffer.size() == 0) {
        logger->Log(__FILE__, __LINE__, "File empty " + current_file_name, LogLevel::ERROR);
    } else {
        for(char i: buffer) {
            ostringstream oss;
            oss << hex << (int)(i & 0xff);
            rawCaff.push_back(oss.str());
        }
    }

    CAFF caffFile(rawCaff);
    caffFile.getMeta(cpath, current_file_name);
    if(caffFile.getStatus() == CAFF_OK){
        logger->Log(__FILE__, __LINE__, "CAFF Parsing SUCCESS", LogLevel::INFO);
    }else{
        logger->Log(__FILE__, __LINE__, "CAFF Parsing FAILED", LogLevel::ERROR);
    }
    input.close();
}
