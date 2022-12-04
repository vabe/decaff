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

typedef struct
{
    int year;
    int month;
    int day;
    int hour;
    int minu;
} CustomTime;

typedef struct
{
    int id;
    int length;
    CustomTime creationTime;
    int creatorLen;
    string creator;
} Credits;

typedef struct
{
    int id;
    int length;
    string magic;
    int headerSize;
    int numOfCIFFS;
} CaffHeader;

typedef struct
{
    int id;
    int length;
    int duration;
    vector<CIFF> ciff; // egy elemu lesz
} Animation;

enum CaffStatus
{
    CAFF_OK = 0,
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
    CIFF_ERROR,
    CIFF_NUMBER_ERROR
};

class CAFF
{
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
    CaffStatus getStatus();
    string getPreview();
    string getMeta(string path, string name);
    string getCreationTime();
};

#endif
