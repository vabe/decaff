#include <node.h>

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

#include "caff.hpp"
#include "logger.hpp"

#include <filesystem>


namespace parser {

using namespace std;

using v8::Context;
using v8::Exception;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

bool is_valid_filename(const std::string& s)
{
    static const regex e("^[a-zA-Z0-9_-]*.caff$", regex_constants::icase);
    return regex_match(s, e);
}

void parse(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();
    Local<Context> context = isolate->GetCurrentContext();
    // Check the number of arguments passed.
    if (args.Length() != 1) {
        // Throw an Error that is passed back to JavaScript
        isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate,
                            "Wrong number of arguments").ToLocalChecked()));
        return;
  }
    auto logger = Logger::GetInstance();

    if (!args[0]->IsString()) {
        isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate,
                            "Wrong arguments").ToLocalChecked()));
        return;
    }

    Local<Object> obj = Object::New(isolate);
    v8::String::Utf8Value str(isolate, args[0]);
    std::string binaryString(*str);

    //string outputName = to_string(time(nullptr)) + "_" +current_file_name;
    //logger->SetLogPreferences("log/"+outputName+".txt", logger->GetLogLevel("INFO"), logger->GetLogOutput("FILE"));
    //logger->Log(__FILE__, __LINE__, "INIT Filename: " + current_file_name, LogLevel::INFO);

    //if(!is_valid_filename(current_file_name)){
    //    logger->Log(__FILE__, __LINE__, "INVALID Filename: " + current_file_name, LogLevel::ERROR);
    //    exit (EXIT_FAILURE);
    //}

    //_CrtSetDbgFlag(_CRTDBG_ALLOC_MEM_DF | _CRTDBG_LEAK_CHECK_DF);
    //ifstream input( "caff_files/" + current_file_name, std::ios::binary );
    //logger->Log(__FILE__, __LINE__, "INPUT: " + to_string(input.is_open()), LogLevel::INFO);
    //logger->Log(__FILE__, __LINE__, to_string(buffer.size()), LogLevel::INFO);
    //vector<unsigned char> buffer(std::istreambuf_iterator<char>(input), {});

    vector<string> rawCaff;

    //if(buffer.size() == 0) {
    //    logger->Log(__FILE__, __LINE__, "File empty " + current_file_name, LogLevel::ERROR);
    //} else {
        for(char i: binaryString) {
            ostringstream oss;
            oss << hex << (int)(i & 0xff);
            rawCaff.push_back(oss.str());
        }
    //}

    CAFF caffFile(rawCaff);
    if(caffFile.getStatus() == CAFF_OK){
        logger->Log(__FILE__, __LINE__, "CAFF Parsing SUCCESS", LogLevel::INFO);
    }else{
        logger->Log(__FILE__, __LINE__, "CAFF Parsing FAILED", LogLevel::ERROR);
    }

    //input.close();

    args.GetReturnValue().Set(v8::String::NewFromUtf8(isolate, caffFile.getPreview().c_str()).ToLocalChecked());
}

void Init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "parse", parse);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)
}