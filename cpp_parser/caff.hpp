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

enum CaffStatus {
    VALUE_NOT_INT,
    HEADER_ID_ERROR,
    HEADER_LENGTH_ERROR,
    HEADER_MAGIC_ERROR,
    HEADER_SIZE_ERROR,
    TIME_ERROR,
    CREDIT_ID_ERROR,
    CREDIT_LENGTH_ERROR,
    CREATOR_LENGTH_ERROR,
    ANIMATION_ID_ERROR,
    CAFF_OK
};

class CAFF{
    vector<Animation> ciffs;
    Credits credits;
    CaffHeader ch;
    CaffStatus status;

    size_t createHeader(vector<string> rawFile, size_t current_pos);
    size_t createCredits(vector<string> rawFile, size_t current_pos);
    void createAnimation(vector<string> rawFile, size_t current_pos);
    void setStatus(CaffStatus newStatus);
    void handleError();
public:
    CAFF(vector<string> caffFile);
    void printHeader();
    void printCredits();
    string getStatus();
};

void CAFF::setStatus(CaffStatus newStatus){
    status = newStatus;
}

void CAFF::handleError(){
    cout << status <<endl;
}

size_t CAFF::createHeader(vector<string> rawFile, size_t current_pos){
    int tmp;
    //header.id
    try {
        try {
            ch.id = HexToInt(rawFile[current_pos]);
            current_pos++;

            //header.length
            ch.length = HexToInt(readNext8Byte(rawFile, current_pos));
            current_pos+=8;
        }
        catch (invalid_argument& e){
            setStatus(VALUE_NOT_INT);
            handleError();
        }
        catch (const out_of_range& oor){
            setStatus(VALUE_NOT_INT);
            handleError();
        }
        if(ch.id !=1) throw HEADER_ID_ERROR;

        //header.magic
        string tmpMagic;
        for(size_t i = current_pos; i<current_pos+4; ++i) {
            tmpMagic += rawFile[i];
            tmp = i;
        }
        ch.magic = hexToASCII(tmpMagic);
        if(ch.magic != "CAFF") throw HEADER_MAGIC_ERROR;
        current_pos = tmp;
        current_pos++;
        
        try {
            //header.header_size 
            ch.headerSize = HexToInt(readNext8Byte(rawFile, current_pos));
            current_pos+=8;

            //header.numOfCIFFS
            ch.numOfCIFFS = HexToInt(readNext8Byte(rawFile, current_pos));
            current_pos+=8;
        }
        catch (invalid_argument& e){
            setStatus(VALUE_NOT_INT);
            handleError();
        }
        catch (const out_of_range& oor){
            setStatus(VALUE_NOT_INT);
            handleError();
        }

        if(ch.length != ch.headerSize) throw HEADER_LENGTH_ERROR;
        if(ch.length != 20) throw HEADER_LENGTH_ERROR;
        if(ch.headerSize != 20) throw HEADER_SIZE_ERROR;

    }
    catch (CaffStatus errorStatus){
        setStatus(errorStatus);
        handleError();
    }
    
    //printHeader();
    return current_pos;
}

size_t CAFF::createCredits(vector<string> rawFile, size_t current_pos){
    int tmp;
    
    try {
        try {
            //credits.id
            credits.id = HexToInt(rawFile[current_pos]);
            current_pos++;

            //credits.length
            credits.length = HexToInt(readNext8Byte(rawFile, current_pos));
            current_pos+=8;
        }
        catch (invalid_argument& e){
            setStatus(VALUE_NOT_INT);
            handleError();
        }
        catch (const out_of_range& oor){
            setStatus(VALUE_NOT_INT);
            handleError();
        }
        if(credits.id != 2) throw CREDIT_ID_ERROR;

        try {
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
        }
        catch (invalid_argument& e){
            setStatus(VALUE_NOT_INT);
            handleError();
        }
        catch (const out_of_range& oor){
            setStatus(VALUE_NOT_INT);
            handleError();
        }
        if(credits.creationTime.year < 1900 &&
        (credits.creationTime.month > 12 || credits.creationTime.month < 1) &&
        (credits.creationTime.day > 31 || credits.creationTime.day < 1) &&
        (credits.creationTime.hour > 24 || credits.creationTime.hour < 0) &&
        (credits.creationTime.minu > 59 || credits.creationTime.minu < 0)) throw TIME_ERROR;

        try {
            //credits.len
            cout << current_pos <<endl;
            credits.creatorLen = HexToInt(readNext8Byte(rawFile, current_pos));
            current_pos+=8;
        }
        catch (invalid_argument& e){
            setStatus(VALUE_NOT_INT);
            handleError();
        }
        catch (const out_of_range& oor){
            setStatus(VALUE_NOT_INT);
            handleError();
        }
        //credits.creator
        if(credits.creatorLen > 0){
            string tmpCreator;
            for(size_t i = current_pos; i<current_pos+credits.creatorLen; ++i) {
                tmpCreator += rawFile[i];
                tmp = i;
            }
            credits.creator = hexToASCII(tmpCreator);
            current_pos = tmp;
            current_pos++;
        }
        else {
            credits.creator = "";
        }
        if(credits.creatorLen != credits.creator.length()) throw CREATOR_LENGTH_ERROR;
        if(credits.length != 14 + credits.creatorLen) throw CREDIT_LENGTH_ERROR;
        
    }
    catch (CaffStatus errorStatus) {
        setStatus(errorStatus);
        handleError();
    }

    printCredits();
    return current_pos;
}

void CAFF::createAnimation(vector<string> rawFile, size_t current_pos){    
    int tmp;
    try {
        for(int i = 0; i<ch.numOfCIFFS; i++){
            Animation tmpAnim;
            try {
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
            }
            catch (invalid_argument& e){
                setStatus(VALUE_NOT_INT);
                handleError();
            }
            catch (const out_of_range& oor){
                setStatus(VALUE_NOT_INT);
                handleError();
            }
            if(tmpAnim.id != 3) throw ANIMATION_ID_ERROR;
            
            //Magic to init
            string tmpMagic;
            for(size_t i = current_pos; i<current_pos+4; ++i) {
                tmpMagic += rawFile[i];
                tmp = i;
            }
            string magic = hexToASCII(tmpMagic);
            current_pos = tmp;
            current_pos++;

            int hs, cs;
            try {
                //header_size to init
                hs = stoi(readNext8Byte(rawFile, current_pos));
                current_pos+=8;
                cout << hs <<endl;
                //content_size to init
                cs = HexToInt(readNext8Byte(rawFile, current_pos));
                current_pos+=8;  
            }
            catch (invalid_argument& e){
                setStatus(VALUE_NOT_INT);
                handleError();
            }
            catch (const out_of_range& oor){
                setStatus(VALUE_NOT_INT);
                handleError();
            }
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
            //cout << current_pos << endl; 
        }
    }
    catch (CaffStatus errorStatus){

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

CAFF::CAFF(vector<string> caffFile){
    size_t current = 0;
    status = CAFF_OK;
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