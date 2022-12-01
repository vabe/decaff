#ifndef HELPER_HPP
#define HELPER_HPP

#include <string>
#include <list>
#include <vector>
#include <algorithm>
#include <iostream>

using namespace std;

int HexToInt(string hexa);
string LittleToBigEndian(vector<string> littleEndian);
string readNext8Byte(vector<string> rawFile, size_t current_pos);
string hexToASCII(string hex);

#endif // HELPER_HPP
