// CAFF.h
#ifndef CAFFHEADER_H
#define CAFFHEADER_H

#include "ciff.hpp"
#include <list>
#include <ctime>
#include <string>


using namespace std;

typedef struct {
    int id;
    int length;
    tm *creationYear;
    int creatorLen;
    string creatorLength;
} Credits;

typedef struct {
    int id;
    int length;
    string magic;
    int headerSize;
    int numOfCIFFS;
} CaffHeader;

class CAFF{
    list<CIFF> ciffs;
    Credits credits;
    CaffHeader ch;
public:
    CAFF(vector<string> caffFile);
};

CAFF::CAFF(vector<string> caffFile){
    /*for(size_t i = 0; i<caffFile.size(); ++i) {
        cout << caffFile[i];
    }*/
}

#endif