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
    int year;
    int month;
    int day;
    int hour;
    int minu;
} CustomTime;

typedef struct {
    int id;
    int length;
    CustomTime creationTime;
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
    int duration;
    vector<CIFF> ciff; //egy elemu lesz
} Animation;

class CAFF{
    vector<Animation> ciffs;
    Credits credits;
    CaffHeader ch;

    size_t createHeader(vector<string> rawFile, size_t current_pos);
    size_t createCredits(vector<string> rawFile, size_t current_pos);
    void createAnimation(vector<string> rawFile, size_t current_pos);
    
    //FILE* returnPreview();
public:
    CAFF(vector<string> caffFile);
    void printHeader();
    void printCredits();
};

size_t CAFF::createHeader(vector<string> rawFile, size_t current_pos){
    int tmp;
    //header.id
    ch.id = HexToInt(rawFile[current_pos]);
    current_pos++;

    //header.length
    ch.length = HexToInt(readNext8Byte(rawFile, current_pos));
    current_pos+=8;

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
    ch.headerSize = HexToInt(readNext8Byte(rawFile, current_pos));
    current_pos+=8;

    //header.numOfCIFFS
    ch.numOfCIFFS = HexToInt(readNext8Byte(rawFile, current_pos));
    current_pos+=8;
    
    //printHeader();
    return current_pos;
}

size_t CAFF::createCredits(vector<string> rawFile, size_t current_pos){
    int tmp;
    //credits.id
    credits.id = HexToInt(rawFile[current_pos]);
    current_pos++;

    //credits.length
    credits.length = HexToInt(readNext8Byte(rawFile, current_pos));
    current_pos+=8;

    //credits.creationYear
    string sYear;
    sYear += rawFile[current_pos];
    current_pos++;
    sYear = rawFile[current_pos] + sYear;
    credits.creationTime.year = HexToInt(sYear);
    current_pos++;

    credits.creationTime.month = HexToInt(rawFile[current_pos]);
    current_pos++;

    credits.creationTime.day = HexToInt(rawFile[current_pos]);
    current_pos++;

    credits.creationTime.hour = HexToInt(rawFile[current_pos]);
    current_pos++;

    credits.creationTime.minu = HexToInt(rawFile[current_pos]);
    current_pos++;

    //credits.len
    credits.creatorLen = HexToInt(readNext8Byte(rawFile, current_pos));
    current_pos+=8;

    //credits.creator
    string tmpCreator;
    for(size_t i = current_pos; i<current_pos+credits.creatorLen; ++i) {
        tmpCreator += rawFile[i];
        tmp = i;
    }
    credits.creator = hexToASCII(tmpCreator);
    current_pos = tmp;
    current_pos++;

    printCredits();
    return current_pos;
}

void CAFF::createAnimation(vector<string> rawFile, size_t current_pos){    
    int tmp;
    for(int i = 0; i<ch.numOfCIFFS; i++){
        Animation tmpAnim;
        //ciffs.id
        tmpAnim.id = HexToInt(rawFile[current_pos]);
        current_pos++;

        //ciffs.length
        tmpAnim.length = HexToInt(readNext8Byte(rawFile, current_pos));
        current_pos+=8;

        //CIFF init
        //duration to inint
        int duration = HexToInt(readNext8Byte(rawFile, current_pos));
        tmpAnim.duration = duration;
        current_pos+=8;

        //Magic to init
        string tmpMagic;
        for(size_t i = current_pos; i<current_pos+4; ++i) {
            tmpMagic += rawFile[i];
            tmp = i;
        }
        string magic = hexToASCII(tmpMagic);
        current_pos = tmp;
        current_pos++;

        //header_size to init
        int hs = stoi(readNext8Byte(rawFile, current_pos));
        current_pos+=8;

        //content_size to init
        int cs = HexToInt(readNext8Byte(rawFile, current_pos));
        current_pos+=8;    

        //Read to init + calc till next 
        vector<string> rawCiff;
        for(size_t i = current_pos; i<current_pos+(hs+cs)+11; i++){
            rawCiff.push_back(rawFile[i]);
            tmp = i;
        }
        CIFF ciff(magic, hs, cs, rawCiff, i);
        tmpAnim.ciff.push_back(ciff);
        ciffs.push_back(tmpAnim);
        current_pos = tmp;
        cout << current_pos << endl; 
    }
    
}

void CAFF::printHeader(){
    cout << "ID: " << ch.id << "\n" 
    << "Length: " << ch.length << "\n" 
    << "Magic: " << ch.magic << "\n" 
    << "HSize: " << ch.headerSize << "\n" 
    << "Num of CIFFs: " << ch.numOfCIFFS << "\n" << endl;
}

void CAFF::printCredits(){
    cout << "ID: " << credits.id << "\n"
    << "Length: " << credits.length << "\n"
    << "Creation: " << credits.creationTime.year << " "
        << credits.creationTime.month << " "
        << credits.creationTime.day << " "
        << credits.creationTime.hour << ":" << credits.creationTime.minu << "\n"
    << "Creator Len: " << credits.creatorLen << "\n"
    << "Creator: " << credits.creator << endl;
}
/*
FILE* CAFF::returnPreview(){
    return ciffs.ciffs[0].createJPG();
}
*/

CAFF::CAFF(vector<string> caffFile){
    size_t current = 0;
    //Header
    current = createHeader(caffFile, current);

    //Credits
    current = createCredits(caffFile, current);
    createAnimation(caffFile, current);
    for(size_t i = 0; i < ciffs.size(); i++){
        ciffs[i].ciff[0].printCIFFHeader();
        ciffs[i].ciff[0].createPPM(i);
    }
}

#endif