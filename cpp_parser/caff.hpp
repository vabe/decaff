// CAFF.h
#ifndef CAFFHEADER_H
#define CAFFHEADER_H

#include "ciff.hpp"
#include <list>
#include <ctime>
#include <string>
#include <iostream>
#include <algorithm>

using namespace std;

typedef struct {
    int id;
    int length;
    tm *creationTime;
    int creatorLen;
    string creator;
} Credits;

typedef struct {
    int id;
    int length;
    string magic;
    int headerSize;
    int numOfCIFFS;
} CaffHeader;

typedef struct {
    int id;
    int length;
    vector<CIFF> ciffs;
} Animation;

class CAFF{
    Animation ciffs;
    Credits credits;
    CaffHeader ch;

    size_t createHeader(vector<string> rawFile, size_t current_pos);
    size_t createCredits(vector<string> rawFile, size_t current_pos);
    void createAnimation(vector<string> rawFile, size_t current_pos);
public:
    CAFF(vector<string> caffFile);
    void printHeader();
    void printCredits();
};

int HexToInt(string hexa){
    return std::stoul(hexa, nullptr, 16);
}

string LittleToBigEndian(vector<string> littleEndian){
    string bigEndian;
    reverse(littleEndian.begin(), littleEndian.end());
    for(size_t i = 0; i<littleEndian.size(); i++){
        bigEndian += littleEndian[i];
    }
    return bigEndian;
}

string hexToASCII(string hex)
{
    string ascii = "";
    for (size_t i = 0; i < hex.length(); i += 2)
    {
        string part = hex.substr(i, 2);
        char ch = stoul(part, nullptr, 16);
        ascii += ch;
    }
    return ascii;
}

size_t CAFF::createHeader(vector<string> rawFile, size_t current_pos){
    int tmp;
    //header.id
    ch.id = HexToInt(rawFile[current_pos]);
    current_pos++;

    //header.length
    vector<string> tmpLength;
    for(size_t i = current_pos; i<current_pos+8; ++i) {
        tmpLength.push_back(rawFile[i]);
        tmp = i;
    }
    string tlength;
    tlength = LittleToBigEndian(tmpLength);
    ch.length = HexToInt(tlength);
    current_pos = tmp;
    current_pos++;

    //header.magic
    string tmpMagic;
    for(size_t i = current_pos; i<current_pos+4; ++i) {
        tmpMagic += rawFile[i];
        tmp = i;
    }
    ch.magic = hexToASCII(tmpMagic);
    current_pos = tmp;
    current_pos++;
    
    //header.header_size 
    vector<string> tmpHeaderSize;
    for(size_t i = current_pos; i<current_pos+8; ++i) {
        tmpHeaderSize.push_back(rawFile[i]);
        tmp = i;
    }
    string ths;
    ths = LittleToBigEndian(tmpHeaderSize);
    ch.headerSize = HexToInt(ths);
    current_pos = tmp;
    current_pos++;

    //header.numOfCIFFS
    vector<string> tmpCIFFNum;
    for(size_t i = current_pos; i<current_pos+8; ++i) {
        tmpCIFFNum.push_back(rawFile[i]);
        tmp = i;
    }
    string tnc;
    tnc = LittleToBigEndian(tmpCIFFNum);
    ch.numOfCIFFS = HexToInt(tnc);
    current_pos = tmp;
    current_pos++;
    
    printHeader();
    return current_pos;
}

size_t CAFF::createCredits(vector<string> rawFile, size_t current_pos){
    int tmp;
    //credits.id
    credits.id = HexToInt(rawFile[current_pos]);
    current_pos++;

    //credits.length
    vector<string> tmpLength;
    for(size_t i = current_pos; i<current_pos+8; ++i) {
        tmpLength.push_back(rawFile[i]);
        tmp = i;
    }
    string tlength;
    tlength = LittleToBigEndian(tmpLength);
    credits.length = HexToInt(tlength);
    current_pos = tmp;
    current_pos++;

    //credits.creationYear
    string sYear;
    tm *tmpTime;
    sYear += rawFile[current_pos];
    current_pos++;
    sYear = rawFile[current_pos] + sYear;
    int year = HexToInt(sYear);
    tmpTime->tm_year = year; 
    current_pos++;

    string sMonth = rawFile[current_pos];
    tmpTime->tm_mon = HexToInt(sMonth);
    current_pos++;

    string sDay = rawFile[current_pos];
    tmpTime->tm_mday = HexToInt(sDay);
    current_pos++;

    string sHour = rawFile[current_pos];
    tmpTime->tm_hour = HexToInt(sHour);
    current_pos++;

    string sMin = rawFile[current_pos];
    tmpTime->tm_min = HexToInt(sMin);
    current_pos++;

    credits.creationTime = tmpTime;

    //credits.len
    vector<string> tmpLen;
    for(size_t i = current_pos; i<current_pos+8; ++i) {
        tmpLen.push_back(rawFile[i]);
        tmp = i;
    }
    string tl;
    tl = LittleToBigEndian(tmpLen);
    credits.creatorLen = HexToInt(tl);
    current_pos = tmp;
    current_pos++;

    //credits.creator
    string tmpCreator;
    for(size_t i = current_pos; i<current_pos+credits.creatorLen; ++i) {
        tmpCreator += rawFile[i];
        tmp = i;
    }
    credits.creator = hexToASCII(tmpCreator);
    current_pos = tmp;
    current_pos++;

    //printCredits();
    return current_pos;
}

void CAFF::createAnimation(vector<string> rawFile, size_t current_pos){
    int tmp;
    //ciffs.id
    ciffs.id = HexToInt(rawFile[current_pos]);
    current_pos++;

    //ciffs.length
    vector<string> tmpLength;
    for(size_t i = current_pos; i<current_pos+8; ++i) {
        tmpLength.push_back(rawFile[i]);
        tmp = i;
    }
    string tlength;
    tlength = LittleToBigEndian(tmpLength);
    ciffs.length = HexToInt(tlength);
    current_pos = tmp;
    current_pos++;

    //TODO 
}

void CAFF::printHeader(){
    cout << ch.id << "\n" 
    << ch.length << "\n" 
    << ch.magic << "\n" 
    << ch.headerSize << "\n" 
    << ch.numOfCIFFS << "\n" << endl;
}

void CAFF::printCredits(){
    cout << credits.id << "\n" 
    << credits.length << "\n" 
    << credits.creationTime->tm_year << " " 
        << credits.creationTime->tm_mon << " " 
        << credits.creationTime->tm_mday << " " 
        << credits.creationTime->tm_hour << ":" << credits.creationTime->tm_min << "\n" 
    << credits.creatorLen << "\n" 
    << credits.creator << endl;
}

CAFF::CAFF(vector<string> caffFile){
    size_t current = 0;
    //Header
    current = createHeader(caffFile, current);

    //Credits
    current = createCredits(caffFile, current);

    createAnimation(caffFile, current);
}

#endif