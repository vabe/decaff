// CIFF.h
#ifndef CIFFHEADER_H
#define CIFFHEADER_H

#include <string>
#include <list>
#include <vector>

using namespace std;


typedef struct {
    char magic[4];
    int header_size;
    int content_size;
    int weigth;
    int height;
    string caption;
    list<string> tags; 
} CiffHeader;

typedef struct {
    int red;
    int green;
    int blue;
} RGB;


class CIFF {
    CiffHeader header;
    list<RGB> content;

    int duration;
public:
    CIFF();
};

#endif