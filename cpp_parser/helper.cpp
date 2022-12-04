#include "helper.hpp"

int HexToInt(string hexa)
{
    return std::stoul(hexa, nullptr, 16);
}

string LittleToBigEndian(vector<string> littleEndian)
{
    string bigEndian;
    reverse(littleEndian.begin(), littleEndian.end());
    for (size_t i = 0; i < littleEndian.size(); i++)
    {
        bigEndian += littleEndian[i];
    }
    return bigEndian;
}

string readNext8Byte(vector<string> rawFile, size_t current_pos)
{
    vector<string> tmpLength;
    for (size_t i = current_pos; i < current_pos + 8; ++i)
    {
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
