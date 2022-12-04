#include "ciff.hpp"
#include "caff.hpp"
#include "helper.hpp"
#include <list>
#include <ctime>
#include <string>
#include <iostream>
#include <algorithm>
#include "logger.hpp"

using namespace std;

void CAFF::setStatus(CaffStatus newStatus)
{
    status = newStatus;
}

CaffStatus CAFF::getStatus()
{
    return status;
}

void CAFF::handleError()
{
    auto logger = Logger::GetInstance();
    if (status == CIFF_ERROR)
    {
        for (Animation a : ciffs)
        {
            if (a.ciff[0].getStatus() != CIFF_OK)
            {
                logger->Log(__FILE__, __LINE__, "CIFF Error: " + to_string(a.ciff[0].getStatus()), LogLevel::ERROR);
            }
        }
    }
    else
    {
        logger->Log(__FILE__, __LINE__, "CAFF Error: " + to_string(status), LogLevel::ERROR);
    }
}

size_t CAFF::createHeader(vector<string> rawFile, size_t current_pos)
{
    auto logger = Logger::GetInstance();
    logger->Log(__FILE__, __LINE__, "CAFF HEADER PARSING", LogLevel::INFO);
    int tmp;

    try
    {
        try
        {
            ch.id = HexToInt(rawFile[current_pos]);
            current_pos++;

            ch.length = HexToInt(readNext8Byte(rawFile, current_pos));
            current_pos += 8;
        }
        catch (invalid_argument &e)
        {
            setStatus(VALUE_NOT_INT);
            handleError();
        }
        catch (const out_of_range &oor)
        {
            setStatus(VALUE_NOT_INT);
            handleError();
        }
        if (ch.id != 1)
            throw HEADER_ID_ERROR;

        string tmpMagic;
        for (size_t i = current_pos; i < current_pos + 4; ++i)
        {
            tmpMagic += rawFile[i];
            tmp = i;
        }
        try
        {
            ch.magic = hexToASCII(tmpMagic);
        }
        catch (invalid_argument &e)
        {
            setStatus(VALUE_NOT_INT);
            handleError();
        }
        catch (const out_of_range &oor)
        {
            setStatus(VALUE_NOT_INT);
            handleError();
        }
        if (ch.magic != "CAFF")
            throw HEADER_MAGIC_ERROR;
        current_pos = tmp;
        current_pos++;

        try
        {
            ch.headerSize = HexToInt(readNext8Byte(rawFile, current_pos));
            current_pos += 8;

            ch.numOfCIFFS = HexToInt(readNext8Byte(rawFile, current_pos));
            current_pos += 8;
        }
        catch (invalid_argument &e)
        {
            setStatus(VALUE_NOT_INT);
            handleError();
        }
        catch (const out_of_range &oor)
        {
            setStatus(VALUE_NOT_INT);
            handleError();
        }

        if (ch.length != ch.headerSize)
            throw HEADER_LENGTH_ERROR;
        if (ch.length != 20)
            throw HEADER_LENGTH_ERROR;
        if (ch.headerSize != 20)
            throw HEADER_SIZE_ERROR;
    }
    catch (CaffStatus errorStatus)
    {
        setStatus(errorStatus);
        handleError();
    }

    return current_pos;
}

size_t CAFF::createCredits(vector<string> rawFile, size_t current_pos)
{
    auto logger = Logger::GetInstance();
    logger->Log(__FILE__, __LINE__, "CAFF CREDITS PARSING", LogLevel::INFO);
    int tmp;

    try
    {
        try
        {
            credits.id = HexToInt(rawFile[current_pos]);
            current_pos++;

            credits.length = HexToInt(readNext8Byte(rawFile, current_pos));
            current_pos += 8;
        }
        catch (invalid_argument &e)
        {
            setStatus(VALUE_NOT_INT);
            handleError();
        }
        catch (const out_of_range &oor)
        {
            setStatus(VALUE_NOT_INT);
            handleError();
        }
        if (credits.id != 2)
            throw CREDIT_ID_ERROR;

        try
        {
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
        catch (invalid_argument &e)
        {
            setStatus(VALUE_NOT_INT);
            handleError();
        }
        catch (const out_of_range &oor)
        {
            setStatus(VALUE_NOT_INT);
            handleError();
        }
        if (credits.creationTime.year < 1900 ||
            (credits.creationTime.month > 12 || credits.creationTime.month < 1) ||
            (credits.creationTime.day > 31 || credits.creationTime.day < 1) ||
            (credits.creationTime.hour > 24 || credits.creationTime.hour < 0) ||
            (credits.creationTime.minu > 59 || credits.creationTime.minu < 0))
            throw TIME_ERROR;

        try
        {
            credits.creatorLen = HexToInt(readNext8Byte(rawFile, current_pos));
            current_pos += 8;
        }
        catch (invalid_argument &e)
        {
            setStatus(VALUE_NOT_INT);
            handleError();
        }
        catch (const out_of_range &oor)
        {
            setStatus(VALUE_NOT_INT);
            handleError();
        }
        if (credits.creatorLen > 0)
        {
            string tmpCreator;
            for (size_t i = current_pos; i < current_pos + credits.creatorLen; ++i)
            {
                tmpCreator += rawFile[i];
                tmp = i;
            }
            try
            {
                credits.creator = hexToASCII(tmpCreator);
            }
            catch (invalid_argument &e)
            {
                setStatus(VALUE_NOT_INT);
                handleError();
            }
            catch (const out_of_range &oor)
            {
                setStatus(VALUE_NOT_INT);
                handleError();
            }
            current_pos = tmp;
            current_pos++;
        }
        else
        {
            credits.creator = "";
        }
        if (credits.creatorLen != credits.creator.length())
            throw CREATOR_LENGTH_ERROR;
        if (credits.length != 14 + credits.creatorLen)
            throw CREDIT_LENGTH_ERROR;
    }
    catch (CaffStatus errorStatus)
    {
        setStatus(errorStatus);
        handleError();
    }

    return current_pos;
}

void CAFF::createAnimation(vector<string> rawFile, size_t current_pos)
{
    auto logger = Logger::GetInstance();
    logger->Log(__FILE__, __LINE__, "CAFF ANIMATION PARSING", LogLevel::INFO);
    int tmp;
    try
    {
        for (int i = 0; i < 1; i++)
        {
            Animation tmpAnim;
            try
            {
                tmpAnim.id = HexToInt(rawFile[current_pos]);
                current_pos++;

                tmpAnim.length = HexToInt(readNext8Byte(rawFile, current_pos));
                current_pos += 8;

                int duration = HexToInt(readNext8Byte(rawFile, current_pos));
                tmpAnim.duration = duration;
                current_pos += 8;
            }
            catch (invalid_argument &e)
            {
                setStatus(VALUE_NOT_INT);
                handleError();
            }
            catch (const out_of_range &oor)
            {
                setStatus(VALUE_NOT_INT);
                handleError();
            }
            if (tmpAnim.id != 3)
                throw ANIMATION_ID_ERROR;

            string tmpMagic;
            for (size_t i = current_pos; i < current_pos + 4; ++i)
            {
                tmpMagic += rawFile[i];
                tmp = i;
            }
            string magic;
            try
            {
                magic = hexToASCII(tmpMagic);
            }
            catch (invalid_argument &e)
            {
                setStatus(VALUE_NOT_INT);
                handleError();
            }
            catch (const out_of_range &oor)
            {
                setStatus(VALUE_NOT_INT);
                handleError();
            }
            current_pos = tmp;
            current_pos++;

            int hs, cs;
            try
            {
                hs = HexToInt(readNext8Byte(rawFile, current_pos));
                current_pos += 8;

                cs = HexToInt(readNext8Byte(rawFile, current_pos));
                current_pos += 8;
            }
            catch (invalid_argument &e)
            {
                setStatus(VALUE_NOT_INT);
                handleError();
            }
            catch (const out_of_range &oor)
            {
                setStatus(VALUE_NOT_INT);
                handleError();
            }
            // Read to init + calc till next
            vector<string> rawCiff;
            for (size_t i = current_pos; i < current_pos + (hs + cs); i++)
            {
                rawCiff.push_back(rawFile[i]);
                tmp = i;
            }
            CIFF ciff(magic, hs, cs, rawCiff, i);
            tmpAnim.ciff.push_back(ciff);
            if (ciff.getStatus() != CIFF_OK)
                throw CIFF_ERROR;
            ciffs.push_back(tmpAnim);
            current_pos = tmp - 20;
            current_pos++;
        }
    }
    catch (CaffStatus errorStatus)
    {
        setStatus(errorStatus);
        handleError();
    }
}

void CAFF::printHeader()
{
    cout << "ID: " << ch.id << "\n"
         << "Length: " << ch.length << "\n"
         << "Magic: " << ch.magic << "\n"
         << "HSize: " << ch.headerSize << "\n"
         << "Num of CIFFs: " << ch.numOfCIFFS << "\n"
         << endl;
}

void CAFF::printCredits()
{
    cout << "ID: " << credits.id << "\n"
         << "Length: " << credits.length << "\n"
         << "Creation: " << credits.creationTime.year << " "
         << credits.creationTime.month << " "
         << credits.creationTime.day << " "
         << credits.creationTime.hour << ":" << credits.creationTime.minu << "\n"
         << "Creator Len: " << credits.creatorLen << "\n"
         << "Creator: " << credits.creator << endl;
}

string CAFF::getPreview()
{
    return ciffs[0].ciff[0].getByteStream();
}

string CAFF::getCreationTime()
{
    return to_string(credits.creationTime.year) + "." +
           to_string(credits.creationTime.month) + "." +
           to_string(credits.creationTime.day) + ". " +
           to_string(credits.creationTime.hour) + ":" +
           to_string(credits.creationTime.minu);
}

string CAFF::getMeta(string path, string name)
{
    auto logger = Logger::GetInstance();

    ofstream json;
    json.open(path + "/" + name + ".json");
    string data = "{\n"
                  "\t\"created\": {\n"
                  "\t\t\"year\": " +
                  to_string(credits.creationTime.year) + ",\n"
                                                         "\t\t\"month\": " +
                  to_string(credits.creationTime.month) + ",\n"
                                                          "\t\t\"day\": " +
                  to_string(credits.creationTime.day) + ",\n"
                                                        "\t\t\"hour\": " +
                  to_string(credits.creationTime.hour) + ",\n"
                                                         "\t\t\"minute\": " +
                  to_string(credits.creationTime.minu) + "\n"
                                                         "\t},\n"
                                                         "\t\"creator\": \"" +
                  credits.creator + "\",\n"
                                    "\t\"type\": \"caff\",\n"
                                    "\t\"caption\": \"" +
                  ciffs[0].ciff[0].getCaption() + "\",\n"
                                                  "\t\"tags\": " +
                  ciffs[0].ciff[0].getTags() + ",\n"
                                               "\t\"preview\": " +
                  ciffs[0].ciff[0].getByteArray() + "\n"
                                                    "}";
    logger->Log(__FILE__, __LINE__, data, LogLevel::INFO);
    json << data;
    json.close();
    return data;
}

CAFF::CAFF(vector<string> caffFile)
{
    auto logger = Logger::GetInstance();
    logger->Log(__FILE__, __LINE__, "Parsing CAFF", LogLevel::INFO);
    size_t current = 0;
    status = CAFF_OK;
    current = createHeader(caffFile, current);
    current = createCredits(caffFile, current);
    createAnimation(caffFile, current);

    ciffs[0].ciff[0].createJPG(0);
}
