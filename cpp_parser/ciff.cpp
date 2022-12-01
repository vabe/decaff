#include <string>
#include <list>
#include <vector>
#include <algorithm>
#include <fstream>
#include <iostream>
#include <sstream>
#include <ctime>
#include "ciff.hpp"
#include "helper.hpp"
#include "toojpeg.hpp"
#include "logger.hpp"

using namespace std;

std::ofstream myFile;
string byteStream;

string CIFF::getByteStream(){
    return byteStream;
}

string CIFF::getByteArray(){
    string arr = "[";
    arr += getByteStream();
    arr += "]";
    return arr;
}

void myOutput(unsigned char byte){
        myFile << byte;
        byteStream += to_string(byte) + ",";
}

void CIFF::createJPG(int serial){
    string fileName = "previews/" + to_string(time(nullptr)) + "_" + to_string(serial) + ".jpeg";
    //myFile = ofstream(fileName, std::ios_base::out | std::ios_base::binary);
    
    const auto bytesPerPixel = 3;
    //auto image = new unsigned char[header.width * header.height * bytesPerPixel];
    auto image = new unsigned char[header.width * header.height * bytesPerPixel];
    for (auto y = 0; y < header.height; y++){
        for (auto x = 0; x < header.width; x++){
            // memory location of current pixel
            //auto offset = (y * header.width + x);
            auto offset = (y * header.width + x) * bytesPerPixel;

            image[offset    ] = content[offset/3].red;
            image[offset + 1] = content[offset/3].green;
            image[offset + 2] = content[offset/3].blue;
        }
    }

    const bool isRGB      = true;  // true = RGB image, else false = grayscale
    const auto quality    = 90;    // compression quality: 0 = worst, 100 = best, 80 to 90 are most often used
    const bool downsample = false; // false = save as YCbCr444 JPEG (better quality), true = YCbCr420 (smaller file)
    const char* comment = header.caption.c_str(); // arbitrary JPEG comment
    auto ok = TooJpeg::writeJpeg(myOutput, image, header.width, header.height, isRGB, quality, downsample, comment);
    delete[] image;
    byteStream.pop_back();
    //myFile.close();

}

int CIFF::getStatus(){
    return ciffStatus;
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
            if(HexToInt(rawCiff[i]) > 255 ||HexToInt(rawCiff[i]) < 0) throw RGB_NOT_IN_RANGE_ERROR;
            //content.push_back(tmp);
            rgb++;
            if(rgb > 2){
                content.push_back(tmp);
                rgb = 0;
            }
        }
        //if(content.size() != header.content_size) throw CONTENT_SIZE_ERROR;
        if(content.size() != header.content_size/3) throw CONTENT_SIZE_ERROR;
    }
    catch(CiffStatus errorStatus) {
        setStatus(errorStatus);
    }
}

string CIFF::getCaption(){
    return header.caption;
}

string CIFF::getTags(){
    string tags = "[";
    for(int i = 0; i<header.tags.size(); i++){
        tags += "\"" + header.tags[i] + "\", ";
    }
    tags.pop_back();
    tags.pop_back();
    tags += "]";
    return tags;
} 

void CIFF::printCIFFHeader(){
    //for debug
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
    auto logger = Logger::GetInstance();
    logger->Log(__FILE__, __LINE__, "Parsing CIFF" , LogLevel::INFO);
    size_t curr_pos = 0;
    ciffStatus = CIFF_OK;
    curr_pos = createHeader(magic, hs, cs, rawCiff, curr_pos);
    if(ciffStatus == CIFF_OK){
        readContent(rawCiff, curr_pos);
    }
}
