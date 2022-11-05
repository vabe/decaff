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
    CIFF_OK = 0,
    CIFF_VALUE_NOT_INT,
    CIFF_MAGIC_ERROR,
    CIFF_HEADER_SIZE_ERROR,
    CONTENT_SIZE_ERROR,
    CONTENT_SIZE_NOT_WXHX3_ERROR,
    LAST_CHAR_NOT_0_ERROR,
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
    void printCIFFHeader();
    int getStatus();
};

int CIFF::getStatus(){
    return ciffStatus;
}

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
    try {
        header.magic = magic;
        header.header_size = hs;
        header.content_size = cs;
        if(header.magic != "CIFF") throw CIFF_MAGIC_ERROR;

        int tmp;
        try {
            //header.width
            header.width = HexToInt(readNext8Byte(rawCiff, curr_pos));
            curr_pos+=8;    

            //header.height
            header.height = HexToInt(readNext8Byte(rawCiff, curr_pos));
            curr_pos+=8;   
        }
        catch (invalid_argument& e){
            setStatus(CIFF_VALUE_NOT_INT);
            return -1;
        }
        catch (const out_of_range& oor){
            setStatus(CIFF_VALUE_NOT_INT);
            return -1;
        }
        if(header.content_size != header.width * header.height *3) throw CONTENT_SIZE_NOT_WXHX3_ERROR;

        //header.caption
        string tmpCh;
        size_t i = curr_pos;
        string cap = "";
        while(tmpCh != "\n"){
            string tmpS = rawCiff[i];
            try {
                tmpCh = hexToASCII(tmpS);
            }
            catch (invalid_argument& e){
                setStatus(CIFF_VALUE_NOT_INT);
                return -1;
            }
            catch (const out_of_range& oor){
                setStatus(CIFF_VALUE_NOT_INT);
                return -1;
            }
            if(tmpCh != "\n"){
                cap += tmpCh;
            }
            ++i;
            tmp = i;
        }
        header.caption = cap;
        curr_pos = tmp;

        //header.tags
        vector<string> tags;
        string tag = "";
        for(size_t i = curr_pos; i<hs-20; ++i){
            if(rawCiff[i] == "0"){
                header.tags.push_back(tag);
                tag = "";
            }
            else {
                try {
                    tag += hexToASCII(rawCiff[i]);
                }
                catch (invalid_argument& e){
                    setStatus(CIFF_VALUE_NOT_INT);
                    return -1;
                }
                catch (const out_of_range& oor){
                    setStatus(CIFF_VALUE_NOT_INT);
                    return -1;
                }
            }
            tmp = i;
        }
        for(string a: header.tags){
            if(a.find('\n')<a.length()) throw TAG_CONTAIN_N_ERROR;
        }
        curr_pos = tmp;
        curr_pos++;
        int tagsLength = 0;
        for(string a: header.tags){
            tagsLength += a.length();
        }
        if(header.header_size != header.magic.length() + 8 + 8 + 8 + 8 + header.caption.length() + 1 + tagsLength + 3) throw CIFF_HEADER_SIZE_ERROR;
    }
    catch (CiffStatus errorStatus){
        setStatus(errorStatus);
        return -1;
    }
    
    //printCIFFHeader();
    return curr_pos;
}

void CIFF::readContent(vector<string> rawCiff, size_t curr_pos){
    vector<string> tmp;
    int rgb = 0;
    int tmpi;
    try {
        for(size_t i = curr_pos; i < curr_pos + header.content_size; i++){ 
            RGB tmp;
            try {
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
            }
            catch (invalid_argument& e){
                setStatus(CIFF_VALUE_NOT_INT);
                return;
            }
            catch (const out_of_range& oor){
                setStatus(CIFF_VALUE_NOT_INT);
                return;
            }
            cout << tmp.red << endl;
            //if((tmp.red > 255 || tmp.red < 0) || 
            //(tmp.green > 255 || tmp.green < 0) ||
            //(tmp.blue > 255 || tmp.blue < 0)) throw RGB_NOT_IN_RANGE_ERROR;
            content.push_back(tmp);
            rgb++;
            if(rgb > 2){
                rgb = 0;
            }
            tmpi = i;
        }
        if(content.size() != header.content_size) throw CONTENT_SIZE_ERROR;
    }
    catch(CiffStatus errorStatus) {
        cout << errorStatus << endl; 
        setStatus(errorStatus);
    }
    
}

void CIFF::createPPM(int serial){
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
}

void CIFF::printCIFFHeader(){
    cout << "\nMagic: " << header.magic << "\n" 
    << "Header size: " << header.header_size << "\n"
    << "Content size: " << header.content_size << "\n"
    << "Width: " << header.width << "\n"
    << "Heigth " << header.height << "\n"
    << "Caption: " << header.caption << "\n"
    << "Tags: ";
    for(string a: header.tags){
        cout << a << " ";
    }
     cout << endl;
}

void CIFF::setStatus(CiffStatus newStatus){
    ciffStatus = newStatus;
}

CIFF::CIFF(string magic, int hs, int cs, vector<string> rawCiff, int serial){
    size_t curr_pos = 0;
    ciffStatus = CIFF_OK;
    curr_pos = createHeader(magic, hs, cs, rawCiff, curr_pos);
    if(ciffStatus == CIFF_OK){
        readContent(rawCiff, curr_pos);
    }
}

#endif