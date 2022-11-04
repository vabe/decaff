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
    CIFF_VALUE_NOT_INT,
    CIFF_MAGIC_ERROR,
    CIFF_HEADER_SIZE_ERROR,
    CONTENT_SIZE_ERROR,
    CONTENT_SIZE_NOT_WXHX3_ERROR,
    CAPTION_CONTAIN_N_ERROR,
    LAST_CHAR_NOT_0_ERROR,
    TAG_CONTAIN_N_ERROR,
    RGB_NOT_IN_RANGE_ERROR,
    CIFF_OK
};

class CIFF {
    CiffHeader header;
    vector<RGB> content;

    int duration;

    size_t createHeader(string magic, int hs, int cs, vector<string> rawCiff, size_t curr_pos);
    void readContent(vector<string> rawCiff, size_t curr_pos);
    void setStatus(string newStatus);
public:
    CIFF(string magic, int hs, int cs, vector<string> rawCiff, int serial);
    void createPPM(int serial);
    void printCIFFHeader();
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

string readNext8Byte(vector<string> rawFile, size_t current_pos){
    vector<string> tmpLength;
    for(size_t i = current_pos; i<current_pos+8; ++i) {
        tmpLength.push_back(rawFile[i]);
    }
    return LittleToBigEndian(tmpLength);

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

size_t CIFF::createHeader(string magic, int hs, int cs, vector<string> rawCiff, size_t curr_pos){
    cout << "CIFF HEADER" << endl;
    header.magic = magic;
    header.header_size = hs;
    header.content_size = cs;

    int tmp;
    //header.with
    vector<string> tmpWidth;
    for(size_t i = curr_pos; i<curr_pos+8; ++i) {
        tmpWidth.push_back(rawCiff[i]);
        tmp = i;
    }
    string tw;
    tw = LittleToBigEndian(tmpWidth);
    header.width = HexToInt(tw);
    curr_pos = tmp;
    curr_pos++;    

    //header.height
    vector<string> tmpHeight;
    for(size_t i = curr_pos; i<curr_pos+8; ++i) {
        tmpHeight.push_back(rawCiff[i]);
        tmp = i;
    }
    string th;
    th = LittleToBigEndian(tmpHeight);
    header.height = HexToInt(th);
    curr_pos = tmp;
    curr_pos++; 

    //header.caption
    string tmpCh;
    size_t i = curr_pos;
    string cap = "";
    while(tmpCh != "\n"){
        string tmpS = rawCiff[i];
        tmpCh = hexToASCII(tmpS);
        cap += tmpCh;
        ++i;
        tmp = i;
    }
    header.caption = cap;
    curr_pos = tmp;
    //curr_pos++;

    //header.tags
    string tags;
    for(size_t i = curr_pos; i<hs; ++i){
        tags += (hexToASCII(rawCiff[i]));
        tmp = i;
    }
    curr_pos = tmp;
    curr_pos++;

    printCIFFHeader();
    cout << "CIFF HEADER END" << endl;
    return curr_pos;
}

void CIFF::readContent(vector<string> rawCiff, size_t curr_pos){
    cout << "CIFF CONTENT" << endl;
    vector<string> tmp;
    int rgb = 0;
    for(size_t i = curr_pos; i < curr_pos + header.content_size; i++){ 
        RGB tmp;
        switch (rgb)
        {
        case 0:
            tmp.red = HexToInt(rawCiff[i]);
            break;
        case 1:
            tmp.green = HexToInt(rawCiff[i]);
            break;
        case 2:
            tmp.blue = HexToInt(rawCiff[i]);
            break;
        }
        content.push_back(tmp);
        rgb++;
        if(rgb > 2){
            rgb = 0;
        }
    }
    cout << "CIFF CONTENT END" << endl;
}

void CIFF::createPPM(int serial){
    cout << "CIFF PPM" << endl;
    string name = "caffpreview" + to_string(serial) + ".ppm";
    ofstream pic(name, std::ofstream::out);
    if (pic.is_open()){
        pic << "P3 " << header.width << " " << header.height << " 255\n"; 
        ostringstream  line;
        int widthcounter = 0;
        for(size_t i = 0; i<content.size()/3; i++){
            line << content[i].red << " " << content[i].green << " " << content[i].blue << " "; 
            widthcounter++;
            if(widthcounter == header.width){
                line << "\n";
                widthcounter = 0;
            }
        }
        pic << line.str() << endl;
        pic.close();
    } else cout << "Problem with opening file";
    cout << "CIFF PPM END" << endl;
}

void CIFF::printCIFFHeader(){
    cout << "Magic: " << header.magic << "\n" 
    << "Header size: " << header.header_size << "\n"
    << "Content size: " << header.content_size << "\n"
    << "Width: " << header.width << "\n"
    << "Heigth " << header.height << "\n"
    << "Caption: " << header.caption << "\n"
    << endl;
    /*for(int i = 0; i< header.tags.size(); i++){
        cout << "Tag" << i << ": " << header.tags[i] << endl;
    }*/
}

CIFF::CIFF(string magic, int hs, int cs, vector<string> rawCiff, int serial){
    cout << "\nCIFF BEGIN" << endl;

    size_t curr_pos = 0;
    curr_pos = createHeader(magic, hs, cs, rawCiff, curr_pos);
    readContent(rawCiff, curr_pos);
    //createPPM(serial);
    cout << "CIFF END" << endl;
}

#endif