// CIFF.h
#ifndef CIFFHEADER_H
#define CIFFHEADER_H

#include <string>
#include <list>
#include <vector>
#include <algorithm>
#include <fstream>
#include <iostream>
#include <sstream>
#include "toojpeg.hpp"


using namespace std;


typedef struct {
    string magic;
    int header_size;
    int content_size;
    int width;
    int height;
    string caption;
    vector<string> tags;
} CiffHeader;

typedef struct {
    int red;
    int green;
    int blue;
} RGB;

enum CiffStatus {
    CIFF_OK = 0,
    CIFF_VALUE_NOT_INT,
    CIFF_MAGIC_ERROR,
    CIFF_HEADER_SIZE_ERROR,
    CONTENT_SIZE_ERROR,
    CONTENT_SIZE_NOT_WXHX3_ERROR,
    TAG_CONTAIN_N_ERROR,
    RGB_NOT_IN_RANGE_ERROR
};


class CIFF {
    CiffHeader header;
    vector<RGB> content;
    CiffStatus ciffStatus;

    size_t createHeader(string magic, int hs, int cs, vector<string> rawCiff, size_t curr_pos);
    void readContent(vector<string> rawCiff, size_t curr_pos);
    void setStatus(CiffStatus newStatus);
public:
    CIFF(string magic, int hs, int cs, vector<string> rawCiff, int serial);
    void createPPM(int serial);
    void createJPG(int serial);
    void printCIFFHeader();
    int getStatus();
};

#endif
